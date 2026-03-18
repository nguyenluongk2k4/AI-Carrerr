"""
╔══════════════════════════════════════════════════════════════╗
║          HÀNH TRANG SỐ — RAG CHATBOT (Gemini)               ║
║  Tư vấn tuyển sinh cho học sinh lớp 10-12 và phụ huynh      ║
╚══════════════════════════════════════════════════════════════╝

QUAN TRỌNG: Chạy embed.py trước để tạo ChromaDB, sau đó mới chạy file này.

    python embed.py   ← chạy 1 lần để tạo vector database
    python chatbot.py ← chạy chatbot

Công nghệ:
  - LangChain (LCEL)     : RAG pipeline hiện đại
  - ChromaDB             : Vector store (persistent tại ./chroma_db)
  - HuggingFace Embed    : sentence-transformers/all-MiniLM-L6-v2 (local)
  - Google Gemini        : LLM (cấu hình GOOGLE_API_KEY trong .env)
"""

import os
import sys
from enum import Enum
from collections import deque

from dotenv import load_dotenv

import traceback

# LangChain core (compatible với v1.x)
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

# ─────────────────────────── CONFIG ────────────────────────────
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
GEMINI_MODEL   = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
# Phải dùng cùng model với embed.py
EMBED_MODEL    = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"


# ═══════════════════════════════════════════════════════════════
#  1. LOAD VECTOR DB
# ═══════════════════════════════════════════════════════════════
def load_vector_db() -> Chroma:
    """
    Load ChromaDB đã tạo sẵn bởi embed.py.
    Nếu chưa có → báo lỗi và hướng dẫn.
    """
    if not os.path.exists(CHROMA_DB_PATH) or not os.listdir(CHROMA_DB_PATH):
        print("=" * 55)
        print("[LỖI] Chưa tìm thấy ChromaDB!")
        print("  Hãy chạy:  python embed.py")
        print("  Sau đó:    python chatbot.py")
        print("=" * 55)
        sys.exit(1)

    print("[*] Đang tải embedding model (local, không cần API)...")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBED_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

    print(f"[*] Đang load ChromaDB từ '{CHROMA_DB_PATH}' ...")
    vectorstore = Chroma(
        persist_directory=CHROMA_DB_PATH,
        embedding_function=embeddings,
        collection_name="hanh_trang_so",
    )

    count = vectorstore._collection.count()
    print(f"[✓] ChromaDB sẵn sàng — {count} vectors đã được load.\n")
    return vectorstore


# ═══════════════════════════════════════════════════════════════
#  2. BUILD GEMINI LLM
# ═══════════════════════════════════════════════════════════════
def build_llm() -> ChatGoogleGenerativeAI:
    if not GOOGLE_API_KEY:
        print("=" * 55)
        print("[LỖI] Thiếu GOOGLE_API_KEY trong file .env!")
        print("  Lấy key miễn phí: https://aistudio.google.com/app/apikey")
        print("  Điền vào .env:    GOOGLE_API_KEY=your_key_here")
        print("=" * 55)
        sys.exit(1)
    try:
        llm = ChatGoogleGenerativeAI(
            model=GEMINI_MODEL,
            google_api_key=GOOGLE_API_KEY,
            temperature=0.3,
        )
        print(f"[✓] Gemini LLM sẵn sàng (model: {GEMINI_MODEL}).\n")
        return llm
    except Exception as e:
        print(f"[LỖI] Không thể khởi tạo Gemini: {e}")
        sys.exit(1)


# ═══════════════════════════════════════════════════════════════
#  3. BUILD RAG CHAIN (LCEL)
# ═══════════════════════════════════════════════════════════════
SYSTEM_TEMPLATE = """Bạn là chuyên gia tư vấn tuyển sinh của dự án **Hành Trang Số**.
Đối tượng: học sinh lớp 10-12 và phụ huynh tại Việt Nam.

Nguyên tắc:
- Chỉ dùng thông tin trong CONTEXT để trả lời.
- Nếu context không đủ: gợi ý người dùng để lại email để chuyên gia tư vấn 1-1 💌.
- KHÔNG bịa đặt điểm chuẩn, học phí hay thông tin không có trong context.
- Văn phong: thân thiện, trẻ trung, chuyên nghiệp. Dùng emoji vừa phải 😊.

CONTEXT từ cơ sở dữ liệu:
{context}"""


def build_rag_chain(vectorstore: Chroma, llm: ChatGoogleGenerativeAI):
    """Tạo RAG chain bằng LCEL. Hỗ trợ lịch sử hội thoại (chat_history)."""
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 30},  # Tăng lên 15 để đủ trải đều cả 3-4 môn học (mỗi môn có 4-5 items)
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_TEMPLATE),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}"),
    ])

    def format_docs(docs) -> str:
        return "\n\n---\n".join(d.page_content for d in docs)

    def retrieve_context(inputs: dict) -> dict:
        question = inputs["question"]
        docs = retriever.invoke(question)
        return {
            "context":      format_docs(docs),
            "chat_history": inputs.get("chat_history", []),
            "question":     question,
        }

    chain = (
        RunnableLambda(retrieve_context)
        | prompt
        | llm
        | StrOutputParser()
    )
    # Trả về cả chain và các thành phần cần thiết để dùng linh hoạt
    return chain, retriever, prompt, llm


# ═══════════════════════════════════════════════════════════════
#  4. STATE MACHINE
# ═══════════════════════════════════════════════════════════════
class BotState(Enum):
    GREETING = "greeting"
    QUIZ     = "quiz"
    RAG_CHAT = "rag_chat"
    ROADMAP  = "roadmap"


QUIZ_QUESTIONS = [
    {
        "q": "🎯 Câu 1/5 — Bạn thích làm việc với điều gì nhất?",
        "options": {
            "A": "💻 Máy tính, code, giải thuật",
            "B": "🗣️ Con người, giao tiếp, kinh doanh",
            "C": "🩺 Sức khỏe, chăm sóc người khác",
            "D": "🎨 Nghệ thuật, thiết kế, sáng tạo",
        }
    },
    {
        "q": "📚 Câu 2/5 — Môn học bạn tự tin nhất là gì?",
        "options": {
            "A": "📐 Toán / Lý / Tin",
            "B": "✍️  Văn / Anh / Sử - Địa",
            "C": "🔬 Hóa / Sinh",
            "D": "🖌️  Vẽ / Mỹ thuật",
        }
    },
    {
        "q": "📊 Câu 3/5 — Điểm thi THPT dự kiến (tổng 3 môn)?",
        "options": {
            "A": "⭐ Trên 27 điểm",
            "B": "✅ 24–27 điểm",
            "C": "👍 20–24 điểm",
            "D": "🌱 Dưới 20 điểm",
        }
    },
    {
        "q": "💰 Câu 4/5 — Ngân sách học phí mỗi năm gia đình hỗ trợ được?",
        "options": {
            "A": "💚 Dưới 25 triệu VNĐ/năm",
            "B": "💛 25–40 triệu VNĐ/năm",
            "C": "🔶 Trên 40 triệu VNĐ/năm",
        }
    },
    {
        "q": "🎯 Câu 5/5 — Sau ra trường, bạn ưu tiên điều gì nhất?",
        "options": {
            "A": "💵 Thu nhập cao ngay sau tốt nghiệp",
            "B": "🔭 Môi trường nghiên cứu chuyên sâu",
            "C": "🌏 Làm việc trong môi trường quốc tế",
            "D": "🖌️  Tự do sáng tạo, thể hiện bản thân",
        }
    },
]

QUIZ_RESULTS = {
    "A": {
        "nganh": "CNTT / An toàn thông tin",
        "truong": "FPT University (SE), HUST (IT1), VNU-UET, PTIT (An toàn TT)",
        "mo_ta": "Tư duy logic, đam mê công nghệ — ngành IT là lựa chọn lý tưởng! 🖥️\nLương khởi điểm 10–25 triệu/tháng, cơ hội việc làm rất rộng mở.",
    },
    "B": {
        "nganh": "Kinh doanh quốc tế / Marketing / Quan hệ quốc tế",
        "truong": "FTU (KD Quốc tế), NEU (Logistics), UEH (Marketing), DAV (QHQT)",
        "mo_ta": "Giỏi giao tiếp, nhạy bén — ngành kinh tế-xã hội là sân chơi của bạn! 🌐\nThăng tiến nhanh nếu trau dồi tiếng Anh và kỹ năng mềm.",
    },
    "C": {
        "nganh": "Y khoa / Dược",
        "truong": "Đại học Y Hà Nội (HMU) — top 1 Y khoa cả nước",
        "mo_ta": "Thiên hướng chăm sóc, cống hiến — ngành Y là đỉnh cao! 🩺\n6 năm thử thách, nhưng phần thưởng nghề nghiệp rất xứng đáng.",
    },
    "D": {
        "nganh": "Kiến trúc / Thiết kế nội thất",
        "truong": "Đại học Kiến trúc Hà Nội (HAU)",
        "mo_ta": "Gu thẩm mỹ, tư duy không gian — Kiến trúc là nơi bạn tỏa sáng! 🎨\nLưu ý: phải rèn vẽ mỹ thuật sớm để vượt kỳ thi năng khiếu.",
    },
}


def _score_quiz(answers: list[str]) -> str:
    count = {"A": 0, "B": 0, "C": 0, "D": 0}
    for a in answers:
        k = a.strip().upper()
        if k in count:
            count[k] += 1
    return max(count, key=lambda k: count[k])


def _is_roadmap_query(text: str) -> bool:
    keywords = ["lộ trình", "lo trinh", "làm sao để đỗ", "cách vào",
                "chuẩn bị", "ôn thi", "bước", "học như thế nào"]
    return any(k in text.lower() for k in keywords)


def _is_quiz_trigger(text: str) -> bool:
    triggers = ["test", "trắc nghiệm", "định hướng", "chưa biết",
                "chưa chọn", "không biết ngành", "tư vấn ngành"]
    return any(k in text.lower() for k in triggers)


# ═══════════════════════════════════════════════════════════════
#  5. BOT CLASS
# ═══════════════════════════════════════════════════════════════
class HanhTrangSoBot:
    """
    Chatbot Hành Trang Số — State Machine:
      GREETING → QUIZ → RAG_CHAT
               → RAG_CHAT / ROADMAP trực tiếp
    """

    def __init__(self, rag_chain_tuple):
        # rag_chain_tuple = (chain, retriever, prompt, llm)
        self.chain, self.retriever, self.prompt, self.llm = rag_chain_tuple
        self.state = BotState.GREETING
        self.quiz_index = 0
        self.quiz_answers: list[str] = []
        # Lưu lịch sử hội thoại cho RAG chain
        self.chat_history: list = []

        print()
        print("═" * 60)
        print("   HÀNH TRANG SỐ — Chatbot Tư Vấn Tuyển Sinh 🎓")
        print("═" * 60)
        print(self._greet())

    def chat(self, user_input: str) -> str:
        user_input = user_input.strip()
        if not user_input:
            return "Bạn ơi, nhập câu hỏi vào nhé 😊"

        if self.state == BotState.GREETING:
            return self._handle_greeting(user_input)
        if self.state == BotState.QUIZ:
            return self._handle_quiz(user_input)

        # RAG_CHAT hoặc ROADMAP
        if _is_roadmap_query(user_input):
            self.state = BotState.ROADMAP
            return self._handle_roadmap(user_input)
        self.state = BotState.RAG_CHAT
        return self._handle_rag(user_input)

    # ── Greeting ───────────────────────────────────────────────
    def _greet(self) -> str:
        return (
            "\n👋 Xin chào! Mình là trợ lý tư vấn của **Hành Trang Số**.\n"
            "Mình sẵn sàng giúp bạn tìm hiểu về trường đại học, ngành học,\n"
            "học phí, điểm chuẩn và lộ trình chinh phục ước mơ! 🚀\n\n"
            "💡 Bạn đã có ngành/trường trong đầu chưa?\n"
            "   → Đã có: hỏi thẳng mình nhé!\n"
            "   → Chưa biết: gõ 'test' để làm trắc nghiệm định hướng!"
        )

    def _handle_greeting(self, text: str) -> str:
        if _is_quiz_trigger(text):
            self.state = BotState.QUIZ
            self.quiz_index = 0
            self.quiz_answers = []
            return self._show_question()
        if _is_roadmap_query(text):
            self.state = BotState.ROADMAP
            return self._handle_roadmap(text)
        self.state = BotState.RAG_CHAT
        return self._handle_rag(text)

    # ── Quiz ───────────────────────────────────────────────────
    def _show_question(self) -> str:
        q = QUIZ_QUESTIONS[self.quiz_index]
        lines = [f"\n{q['q']}"]
        for key, val in q["options"].items():
            lines.append(f"   {key}. {val}")
        lines.append("\n👉 Gõ A / B / C / D:")
        return "\n".join(lines)

    def _handle_quiz(self, text: str) -> str:
        answer = text.strip().upper()
        valid = list(QUIZ_QUESTIONS[self.quiz_index]["options"].keys())
        if answer not in valid:
            return f"⚠️  Hãy chọn một trong: {', '.join(valid)}"
        self.quiz_answers.append(answer)
        self.quiz_index += 1
        if self.quiz_index < len(QUIZ_QUESTIONS):
            return self._show_question()
        return self._show_quiz_result()

    def _show_quiz_result(self) -> str:
        best = _score_quiz(self.quiz_answers)
        r = QUIZ_RESULTS.get(best, QUIZ_RESULTS["A"])
        self.state = BotState.RAG_CHAT

        # --- TÍCH HỢP BẢNG ĐIỂM GIẢ LẬP & TƯ VẤN TRUNG TÂM ---
        MOCK_TRANSCRIPT = {
            "Toán": 6.5, "Vật lý": 6.0, "Hóa Học": 7.0, "Sinh học": 6.5,
            "Ngữ Văn": 6.0, "Tiếng Anh": 5.5, "Lịch sử": 7.0, "Địa lý": 8.0
        }

        # Ngưỡng điểm chuẩn giả lập và môn quan trọng cho từng kết quả
        required_subjects = []
        if best == "A": # CNTT
            required_subjects = ["Toán", "Vật lý", "Tiếng Anh"]
        elif best == "B": # Kinh tế
            required_subjects = ["Toán", "Ngữ Văn", "Tiếng Anh"]
        elif best == "C": # Y Dược
            required_subjects = ["Toán", "Hóa Học", "Sinh học"]
        elif best == "D": # Kiến trúc
            required_subjects = ["Toán", "Vật lý"]

        weak_subjects = []
        # Điểm yêu cầu giả định là 8.0
        target_score = 8.0
        for subj in required_subjects:
            if MOCK_TRANSCRIPT.get(subj, 0) < target_score:
                weak_subjects.append(subj)

        transcript_text = f"📊 **Phân Tích Bảng Điểm (Mock Data)**\n"
        transcript_text += f"   ➤ Toán: {MOCK_TRANSCRIPT['Toán']} | Lý: {MOCK_TRANSCRIPT['Vật lý']} | Hóa: {MOCK_TRANSCRIPT['Hóa Học']} | Sinh: {MOCK_TRANSCRIPT['Sinh học']}\n"
        transcript_text += f"   ➤ Văn: {MOCK_TRANSCRIPT['Ngữ Văn']} | Anh: {MOCK_TRANSCRIPT['Tiếng Anh']} | Sử: {MOCK_TRANSCRIPT['Lịch sử']} | Địa: {MOCK_TRANSCRIPT['Địa lý']}\n\n"
        transcript_text += f"💡 Ngành **{r['nganh']}** yêu cầu các môn trọng điểm: **{', '.join(required_subjects)}** tối thiểu {target_score} điểm.\n"

        if weak_subjects:
            transcript_text += f"⚠️ Bạn đang có phần đuối sức ở các môn: **{', '.join(weak_subjects)}**.\n\n"
            transcript_text += "📚 **Đề xuất giáo viên/trung tâm cải thiện điểm số:**\n"
            
            # --- CHIẾN THUẬT GOM CONTEXT (Context Merging) ---
            all_relevant_docs = []
            print(f"\n[DEBUG] Đang tìm kiếm thông tin cho các môn: {weak_subjects}")
            
            for subj in weak_subjects:
                # Tìm kiếm riêng biệt cho từng môn
                # Tối ưu query để khớp với data_2.json (chứa từ khóa: Review, Thầy, Cô, Khóa học)
                query_subj = f"Review giáo viên khóa học môn {subj}, học phí, lộ trình của thầy cô dạy {subj}"
                
                # Gọi retriever
                docs = self.retriever.invoke(query_subj) 
                
                # Debug: In ra xem tìm thấy gì
                print(f"   > Môn {subj}: Tìm thấy {len(docs)} docs.")
                if docs:
                    print(f"     - Top 1: {docs[0].page_content[:50]}...")
                
                all_relevant_docs.extend(docs)

            # Hợp nhất context và gọi AI 1 lần duy nhất
            combined_context = "\n\n---\n".join(d.page_content for d in all_relevant_docs)
            
            # Tạo pipeline tổng hợp nhanh - Tập trung vào thông tin ngắn gọn
            simple_prompt = ChatPromptTemplate.from_template(
                "Dựa trên dữ liệu sau:\n{context}\n\n"
                "Nhiệm vụ: {question}\n"
                "Yêu cầu output:\n"
                "- Chỉ liệt kê danh sách các Giáo viên/Trung tâm/Khóa học có trong dữ liệu.\n"
                "- Với mỗi mục, chỉ ghi 3 dòng ngắn gọn: Tên, Điểm nổi bật, Học phí (nếu có).\n"
                "- Không tự bịa thêm lời khuyên hay văn bản dẫn dắt dài dòng."
            )
            summary_chain = simple_prompt | self.llm | StrOutputParser()
            
            try:
                recommendation = summary_chain.invoke({
                    "context": combined_context,
                    "question": f"Tổng hợp thông tin giáo viên/khóa học cho các môn: {', '.join(weak_subjects)}."
                })
                transcript_text += recommendation + "\n"
            except Exception as e:
                print(f"[LỖI AI Tư vấn] {e}")
                traceback.print_exc()
                transcript_text += "\n(Xin lỗi, phần tư vấn chi tiết đang gặp sự cố kỹ thuật. Bạn hãy thử lại sau nhé!)\n"
        else:
            transcript_text += "✅ Chúc mừng! Điểm số của bạn có vẻ khá an toàn với ngành này. Hãy tiếp tục duy trì phong độ nhé!\n\n"

        return (
            f"\n🎉 Dựa trên câu trả lời của bạn...\n\n"
            f"✨ **NGÀNH PHÙ HỢP**: {r['nganh']}\n\n"
            f"🏫 **TRƯỜNG GỢI Ý**: {r['truong']}\n\n"
            f"📝 {r['mo_ta']}\n\n"
            f"─────────────────────────────────────────────\n"
            f"{transcript_text}"
            f"─────────────────────────────────────────────\n"
            f"💬 Bạn có thể hỏi mình thêm về học phí trường, điểm chuẩn, hay thông tin về các giáo viên vừa được gợi ý nhé!"
        )

    # ── RAG (LCEL) ─────────────────────────────────────────────
    def _rag_invoke(self, question: str) -> str:
        try:
            answer = self.chain.invoke({
                "question":     question,
                "chat_history": self.chat_history,
            })
            # Cập nhật lịch sử
            self.chat_history.append(HumanMessage(content=question))
            self.chat_history.append(AIMessage(content=answer))
            # Giữ tối đa 10 lượt (20 messages) để tránh context quá dài
            if len(self.chat_history) > 20:
                self.chat_history = self.chat_history[-20:]
            return answer.strip()
        except Exception as e:
            return (
                f"⚠️ Lỗi Gemini API: {str(e)[:200]}\n"
                "Kiểm tra GOOGLE_API_KEY trong .env và thử lại nhé!"
            )

    def _handle_rag(self, text: str) -> str:
        answer = self._rag_invoke(text)
        return f"\n{answer}" if answer else self._fallback()

    def _handle_roadmap(self, text: str) -> str:
        enriched = f"Trình bày lộ trình từng bước cụ thể để: {text}"
        answer = self._rag_invoke(enriched)
        return f"\n🗺️ **Lộ trình:**\n{answer}" if answer else self._fallback()

    def _fallback(self) -> str:
        return (
            "🤔 Mình chưa tìm thấy thông tin chính xác về câu hỏi này.\n"
            "Bạn có thể để lại email để chuyên gia Hành Trang Số tư vấn 1-1 nhé! 💌"
        )


# ═══════════════════════════════════════════════════════════════
#  6. MAIN
# ═══════════════════════════════════════════════════════════════
def main():
    print("\n[*] Đang khởi động Hành Trang Số Chatbot (Gemini + ChromaDB)...")

    # Load ChromaDB đã build sẵn từ embed.py
    vectorstore = load_vector_db()

    # Khởi tạo Gemini LLM
    llm = build_llm()

    # Build RAG chain (LCEL) - Trả về bộ (chain, retriever, prompt, llm)
    rag_components = build_rag_chain(vectorstore, llm)

    # Khởi tạo bot
    bot = HanhTrangSoBot(rag_components)

    print("\n💡 Gõ 'exit' hoặc nhấn Ctrl+C để thoát.\n")

    while True:
        try:
            user_input = input("Bạn: ").strip()

            if user_input.lower() in ("exit", "quit", "thoát", "thoat"):
                print(
                    "\n👋 Cảm ơn bạn đã dùng Hành Trang Số!\n"
                    "   Chúc bạn chinh phục được ngôi trường mơ ước! 🎓✨\n"
                )
                break

            response = bot.chat(user_input)
            print(f"\nBot: {response}\n")
            print("─" * 55)

        except KeyboardInterrupt:
            print("\n\n👋 Đã thoát. Hành Trang Số luôn ở đây khi bạn cần! 🌟\n")
            break
        except Exception as e:
            print(f"\n[LỖI không mong đợi] {e}\n")


if __name__ == "__main__":
    main()
