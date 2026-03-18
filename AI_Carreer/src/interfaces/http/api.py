from typing import Dict, List, Optional, Tuple

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ...config import get_config
from ...domain.advisor import AdvisorMessage
from ...application.ask_advisor import ask_advisor
from ...application.search_chroma import (
    search_knowledge,
    search_knowledge_with_scores,
    count_knowledge,
)
from ...infrastructure.embeddings import build_embeddings
from ...infrastructure.chroma_store import load_chroma
from ...infrastructure.llm import build_llm
from ...infrastructure.rag_chain import build_rag_chain

app = FastAPI(title="Hanh Trang So Advisor API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str
    content: str


class AskAdvisorRequest(BaseModel):
    question: str
    chat_history: Optional[List[ChatMessage]] = None


class AskAdvisorResponse(BaseModel):
    answer: str


class SearchRequest(BaseModel):
    query: str
    k: int = 5


class SearchResponse(BaseModel):
    results: List[dict]

class AssessmentSummaryItem(BaseModel):
    id: int
    question: str
    answerKey: str
    answerLabel: str


class AssessmentAnalyzeRequest(BaseModel):
    summary: List[AssessmentSummaryItem]
    top_k: int = 6
    debug: bool = False
    selected_combo: Optional[str] = None
    locations: Optional[List[str]] = None
    family_condition: Optional[str] = None
    salary: Optional[str] = None
    habits: Optional[List[str]] = None
    scores: Optional[Dict[str, float]] = None


class AssessmentMatch(BaseModel):
    program: str
    school: str
    school_name: str
    major: str
    percent: int
    score: float
    types: List[str]
    evidence: List[str]


class AssessmentAnalyzeResponse(BaseModel):
    answer: str
    matches: List[AssessmentMatch]
    debug_docs: Optional[List[dict]] = None


class RoadmapRequest(BaseModel):
    program: str
    school: str
    major: str
    weak_subjects: List[str] = []


class TutorItem(BaseModel):
    type: str
    content: str


class TutorRecommendation(BaseModel):
    subject: str
    tutor: str
    items: List[TutorItem]


class RoadmapResponse(BaseModel):
    roadmap: List[str]
    courses: List[TutorRecommendation]

def _build_assessment_prompt(summary: List[AssessmentSummaryItem]) -> str:
    lines = []
    for item in summary:
        answer = item.answerLabel or item.answerKey or "Chưa trả lời"
        lines.append(f"- {item.question} → {answer}")

    return (
        "Bạn là chuyên gia tư vấn hướng nghiệp của Hành Trang Số.\n"
        "Dựa trên các câu trả lời sau, hãy:\n"
        "1) Tóm tắt chân dung học sinh (2-3 ý).\n"
        "2) Gợi ý 3 ngành phù hợp + lý do ngắn gọn.\n"
        "3) Nếu có dữ liệu trong CONTEXT, gợi ý trường/điểm chuẩn/học phí phù hợp; nếu thiếu dữ liệu thì nêu rõ.\n"
        "4) Đề xuất 3 hành động cụ thể trong 4-8 tuần tới.\n"
        "Trả lời tiếng Việt, dạng bullet rõ ràng.\n\n"
        "Thông tin học sinh:\n"
        + "\n".join(lines)
    )


def _parse_program(meta_id: Optional[str]) -> Tuple[str, str, str]:
    if not meta_id:
        return ("UNKNOWN", "", "")
    tokens = meta_id.split("_")
    if len(tokens) < 3:
        return (meta_id, "", "")
    program = "_".join(tokens[1:-1])
    school = tokens[1]
    major = "_".join(tokens[2:-1]) if len(tokens) > 3 else tokens[2]
    return (program, school, major)


SCHOOL_NAME_MAP = {
    "DAV": "Học viện Ngoại giao",
    "FPT": "FPT University",
    "FTU": "Đại học Ngoại thương",
    "HAU": "Đại học Kiến trúc Hà Nội",
    "HMU": "Đại học Y Hà Nội",
    "HUST": "Đại học Bách khoa Hà Nội",
    "NEU": "Đại học Kinh tế Quốc dân",
    "PTIT": "Học viện Công nghệ Bưu chính Viễn thông",
    "UEH": "Đại học Kinh tế TP.HCM",
    "VNU": "Đại học Quốc gia Việt Nam",
}

SUBJECT_CODE_MAP = {
    "Toán": "MATH",
    "Vật lý": "PHYS",
    "Hóa học": "CHEM",
    "Sinh học": "BIO",
    "Ngữ văn": "LIT",
    "Tiếng Anh": "ENG",
    "Lịch sử": "HIS",
    "Địa lý": "GEO",
}

COMBO_SUBJECTS = {
    "A00": ["Toán", "Vật lý", "Hóa học"],
    "A01": ["Toán", "Vật lý", "Tiếng Anh"],
    "B00": ["Toán", "Hóa học", "Sinh học"],
    "C00": ["Ngữ văn", "Lịch sử", "Địa lý"],
    "D01": ["Toán", "Ngữ văn", "Tiếng Anh"],
    "D07": ["Toán", "Hóa học", "Tiếng Anh"],
    "D14": ["Ngữ văn", "Lịch sử", "Tiếng Anh"],
    "D15": ["Ngữ văn", "Địa lý", "Tiếng Anh"],
}

MAJOR_GROUPS = {
    "tech": {"SE", "IT1", "UET_IT", "SEC"},
    "business": {"IB", "LOGISTICS", "MKT", "IR"},
    "health": {"MED"},
    "creative": {"ARCH"},
}


def _extract_tutor_name(content: str) -> str:
    if ":" in content:
        return content.split(":")[0].strip()
    return content[:60].strip()


def _extract_answer(summary: List[AssessmentSummaryItem], question_id: int) -> Optional[str]:
    for item in summary:
        if item.id == question_id:
            return item.answerKey or item.answerLabel
    return None


def _major_group(major_code: str) -> Optional[str]:
    for group, majors in MAJOR_GROUPS.items():
        if major_code in majors:
            return group
    return None


def _to_similarity(distance: float) -> float:
    return 1.0 / (1.0 + distance)


MAJOR_COMBO_MAP = {
    "SE": ["A00", "A01", "D01", "D07"],
    "IT1": ["A00", "A01", "D01", "D07"],
    "UET_IT": ["A00", "A01", "D01", "D07"],
    "SEC": ["A00", "A01", "D01", "D07"],
    "MED": ["B00"],
    "ARCH": ["A00", "A01"],
    "IB": ["A01", "D01", "D07"],
    "LOGISTICS": ["A01", "D01"],
    "MKT": ["D01", "A01", "D14", "D15"],
    "IR": ["D01", "D14", "D15", "C00"],
}

SCHOOL_REGIONS = {
    "HUST": ["north"],
    "HMU": ["north"],
    "DAV": ["north"],
    "PTIT": ["north"],
    "NEU": ["north"],
    "HAU": ["north"],
    "VNU": ["north"],
    "FTU": ["north", "south"],
    "UEH": ["south"],
    "FPT": ["north", "central", "south"],
}


def _normalize_region(label: str) -> Optional[str]:
    lowered = label.lower()
    if "bắc" in lowered:
        return "north"
    if "trung" in lowered:
        return "central"
    if "nam" in lowered:
        return "south"
    return None


def _matches_region(locations: Optional[List[str]], school: str) -> bool:
    if not locations:
        return False
    if any("không quan trọng" in loc.lower() for loc in locations):
        return False
    regions = SCHOOL_REGIONS.get(school, [])
    desired = [_normalize_region(loc) for loc in locations]
    desired = [item for item in desired if item]
    return any(region in regions for region in desired)


def _estimate_cost_bucket(text: str) -> Optional[str]:
    if not text:
        return None
    import re

    values = re.findall(r"(\d+[.,]?\d*)\s*triệu", text.lower())
    if not values:
        return None
    nums = []
    for value in values:
        try:
            nums.append(float(value.replace(",", ".")))
        except ValueError:
            continue
    if not nums:
        return None
    max_value = max(nums)
    if max_value <= 25:
        return "low"
    if max_value <= 40:
        return "mid"
    return "high"


def _family_bucket(condition: Optional[str]) -> Optional[str]:
    if not condition:
        return None
    lowered = condition.lower()
    if "tiết kiệm" in lowered:
        return "low"
    if "trung bình" in lowered:
        return "mid"
    if "khá" in lowered or "giỏi" in lowered:
        return "high"
    return None


@app.on_event("startup")
async def startup():
    cfg = get_config()
    if not cfg.google_api_key:
        raise RuntimeError("GOOGLE_API_KEY is missing")

    embeddings = build_embeddings(cfg.embed_model)
    store = load_chroma(cfg.chroma_db_path, embeddings)
    llm = build_llm(cfg.google_api_key, cfg.gemini_model)
    chain = build_rag_chain(store, llm)
    assessment_chain = build_rag_chain(store, llm, search_filter={"source": "data.json"})

    app.state.store = store
    app.state.chain = chain
    app.state.assessment_chain = assessment_chain


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/chroma/count")
async def chroma_count():
    count = await count_knowledge(app.state.store)
    return {"count": count}


@app.post("/chroma/search", response_model=SearchResponse)
async def chroma_search(payload: SearchRequest):
    results = await search_knowledge(app.state.store, payload.query, payload.k)
    return {
        "results": [
            {"content": r.content, "metadata": r.metadata} for r in results
        ]
    }


@app.post("/advisor/ask", response_model=AskAdvisorResponse)
async def advisor_ask(payload: AskAdvisorRequest):
    messages = payload.chat_history or []
    domain_messages = [AdvisorMessage(role=m.role, content=m.content) for m in messages]
    answer = await ask_advisor(app.state.chain, payload.question, domain_messages)
    return {"answer": answer}


@app.post("/assessment/analyze", response_model=AssessmentAnalyzeResponse)
async def assessment_analyze(payload: AssessmentAnalyzeRequest):
    if not payload.summary:
        raise HTTPException(status_code=400, detail="summary is required")

    prompt = _build_assessment_prompt(payload.summary)
    answer = await ask_advisor(app.state.assessment_chain, prompt, [])

    fetch_k = max(payload.top_k * 6, 24)
    scored = await search_knowledge_with_scores(app.state.store, prompt, fetch_k)

    debug_docs: List[dict] = []
    if payload.debug:
        for item in scored[:20]:
            meta = item.metadata if isinstance(item.metadata, dict) else {}
            debug_docs.append(
                {
                    "id": meta.get("id"),
                    "type": meta.get("type"),
                    "source": meta.get("source"),
                    "score": round(item.score, 6),
                    "content": item.content[:220],
                }
            )

    grouped: Dict[str, Dict[str, object]] = {}
    for item in scored:
        meta_id = item.metadata.get("id") if isinstance(item.metadata, dict) else None
        source = item.metadata.get("source") if isinstance(item.metadata, dict) else ""
        meta_type = item.metadata.get("type") if isinstance(item.metadata, dict) else None
        if source and "data_2.json" in source:
            continue
        if meta_id and str(meta_id).startswith("TUTOR_"):
            continue
        if meta_type not in {
            "admission_rules",
            "campus_life",
            "career_salary",
            "cost_estimate",
            "fallback_option",
            "gap_analysis",
            "scholarship_info",
            "student_review",
            "study_roadmap",
        }:
            continue
        program, school, major = _parse_program(meta_id)
        score = _to_similarity(item.score)

        if program not in grouped:
            grouped[program] = {
                "program": program,
                "school": school,
                "major": major,
                "score": score,
                "types": set(),
                "evidence": [],
                "cost_text": "",
            }
        else:
            grouped[program]["score"] = max(grouped[program]["score"], score)

        if meta_type:
            grouped[program]["types"].add(meta_type)
            if meta_type == "cost_estimate" and not grouped[program]["cost_text"]:
                grouped[program]["cost_text"] = item.content

        evidence = grouped[program]["evidence"]
        if len(evidence) < 2 and item.content not in evidence:
            evidence.append(item.content)

    selected_combo = (payload.selected_combo or "").upper()
    family_bucket = _family_bucket(payload.family_condition)
    interest_key = _extract_answer(payload.summary, 1)
    subject_key = _extract_answer(payload.summary, 2)
    interest_group = None
    subject_group = None
    if interest_key:
        interest_group = {"A": "tech", "B": "business", "C": "health", "D": "creative"}.get(
            interest_key.strip().upper()
        )
    if subject_key:
        subject_group = {"A": "tech", "B": "business", "C": "health", "D": "creative"}.get(
            subject_key.strip().upper()
        )

    combo_subjects = COMBO_SUBJECTS.get(selected_combo)
    combo_avg = None
    if payload.scores and combo_subjects:
        vals = [payload.scores.get(subj, 0) for subj in combo_subjects]
        if vals:
            combo_avg = sum(vals) / len(vals)
    matches_raw = []
    for item in grouped.values():
        bonus = 0.0
        major_code = str(item["major"]).upper()
        if selected_combo and selected_combo in MAJOR_COMBO_MAP.get(major_code, []):
            bonus += 0.18
        elif selected_combo:
            bonus -= 0.12
        if _matches_region(payload.locations, str(item["school"])):
            bonus += 0.08
        cost_bucket = _estimate_cost_bucket(str(item.get("cost_text", "")))
        if family_bucket and cost_bucket and family_bucket == cost_bucket:
            bonus += 0.05
        if interest_group:
            if major_code in MAJOR_GROUPS.get(interest_group, set()):
                bonus += 0.18
            else:
                bonus -= 0.08
        if subject_group and subject_group != interest_group:
            if major_code in MAJOR_GROUPS.get(subject_group, set()):
                bonus += 0.08
        if combo_avg is not None:
            bonus += (combo_avg / 10.0) * 0.06
        item["score"] = item["score"] + bonus
        matches_raw.append(item)

    matches_raw.sort(key=lambda item: item["score"], reverse=True)
    matches_raw = matches_raw[: payload.top_k]

    max_score = matches_raw[0]["score"] if matches_raw else 1.0
    matches: List[AssessmentMatch] = []
    for item in matches_raw:
        percent = int(round((item["score"] / max_score) * 100))
        matches.append(
            AssessmentMatch(
                program=item["program"],
                school=item["school"],
                school_name=SCHOOL_NAME_MAP.get(item["school"], item["school"]),
                major=item["major"],
                percent=percent,
                score=round(item["score"], 4),
                types=sorted(item["types"]),
                evidence=item["evidence"],
            )
        )

    response: dict = {"answer": answer, "matches": matches}
    if payload.debug:
        response["debug_docs"] = debug_docs
        print("=== CHROMA DEBUG (assessment/analyze) ===")
        for row in debug_docs:
            print(row)
        print("=== END DEBUG ===")
    return response


@app.post("/roadmap/school", response_model=RoadmapResponse)
async def roadmap_school(payload: RoadmapRequest):
    if not payload.school:
        raise HTTPException(status_code=400, detail="school is required")

    query = f"lộ trình học tập {payload.school} {payload.major}".strip()
    scored = await search_knowledge_with_scores(app.state.store, query, 30)

    roadmap_items: List[str] = []
    for item in scored:
        meta = item.metadata if isinstance(item.metadata, dict) else {}
        meta_id = meta.get("id", "")
        meta_type = meta.get("type", "")
        if meta_type != "study_roadmap":
            continue
        if payload.school not in str(meta_id):
            continue
        if payload.major and payload.major not in str(meta_id):
            continue
        if item.content not in roadmap_items:
            roadmap_items.append(item.content)
        if len(roadmap_items) >= 4:
            break

    courses: List[TutorRecommendation] = []
    for subject in payload.weak_subjects:
        code = SUBJECT_CODE_MAP.get(subject)
        if not code:
            continue
        tutor_scored = await search_knowledge_with_scores(
            app.state.store, f"{subject} giáo viên khóa học", 20
        )
        grouped: Dict[str, Dict[str, object]] = {}
        for doc in tutor_scored:
            meta = doc.metadata if isinstance(doc.metadata, dict) else {}
            meta_id = meta.get("id", "")
            meta_type = meta.get("type", "")
            if not str(meta_id).startswith(f"TUTOR_{code}_"):
                continue
            parts = str(meta_id).split("_")
            if len(parts) < 3:
                continue
            tutor_key = f"{parts[1]}_{parts[2]}"
            if tutor_key not in grouped:
                grouped[tutor_key] = {
                    "tutor": _extract_tutor_name(doc.content),
                    "score": _to_similarity(doc.score),
                    "items": [],
                }
            grouped[tutor_key]["score"] = max(grouped[tutor_key]["score"], _to_similarity(doc.score))
            grouped[tutor_key]["items"].append(
                {"type": meta_type or "info", "content": doc.content}
            )

        ranked = list(grouped.values())
        ranked.sort(key=lambda item: item["score"], reverse=True)
        ranked = ranked[:2]
        for tutor in ranked:
            courses.append(
                TutorRecommendation(
                    subject=subject,
                    tutor=tutor["tutor"],
                    items=[TutorItem(**item) for item in tutor["items"]],
                )
            )

    return {"roadmap": roadmap_items, "courses": courses}
