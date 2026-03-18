import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { TrendingUp, Award, Lightbulb, ChevronRight, Sparkles, Lock } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "motion/react";
import { usePremium } from "../utils/usePremium";
import { getWeakSubjects } from "../data/assessment";

type AssessmentSummaryItem = {
  id: number;
  question: string;
  answerKey: string;
  answerLabel: string;
};

type AssessmentMatch = {
  program: string;
  school: string;
  school_name: string;
  major: string;
  percent: number;
  score: number;
  types: string[];
  evidence: string[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const LoadingIndicator = ({ label = "Đang tải dữ liệu..." }: { label?: string }) => (
  <div className="flex items-center gap-3 text-gray-600">
    <div className="h-6 w-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    <span>{label}</span>
  </div>
);

const FullPageLoading = ({ label }: { label: string }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="bg-white border-2 border-blue-100 rounded-2xl shadow-lg px-8 py-10 text-center">
      <div className="mx-auto mb-4 h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <div className="text-lg text-gray-700">{label}</div>
      <div className="text-sm text-gray-500 mt-2">Vui lòng chờ trong giây lát</div>
    </div>
  </div>
);

export function Results() {
  const navigate = useNavigate();
  const { isPremium, activate } = usePremium();
  const [summary, setSummary] = useState<AssessmentSummaryItem[] | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [aiResult, setAiResult] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiExpanded, setAiExpanded] = useState(false);
  const [matches, setMatches] = useState<AssessmentMatch[]>([]);
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [selectedCombo, setSelectedCombo] = useState("");
  const [multiAnswers, setMultiAnswers] = useState<Record<number, string[]>>({});

  const summaryKey = useMemo(() => {
    if (!summary || summary.length === 0) return "";
    return JSON.stringify({
      summary,
      selectedCombo,
      multiAnswers,
      scores,
    });
  }, [summary, selectedCombo, multiAnswers, scores]);

  useEffect(() => {
    const raw = localStorage.getItem("assessmentData");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        summary?: AssessmentSummaryItem[];
        answers?: Record<string, string>;
        multiAnswers?: Record<number, string[]>;
        scores?: Record<string, number | string>;
        selectedCombo?: string;
        semesterScores?: {
          semester1: Record<string, number | string>;
          semester2: Record<string, number | string>;
        };
      };
      if (Array.isArray(parsed.summary) && parsed.summary.length > 0) {
        setSummary(parsed.summary);
      }
      if (parsed.scores) {
        const normalized: Record<string, number> = {};
        for (const [key, value] of Object.entries(parsed.scores)) {
          normalized[key] = Number(value) || 0;
        }
        setScores(normalized);
      } else if (parsed.semesterScores) {
        const normalized: Record<string, number> = {};
        for (const key of Object.keys(parsed.semesterScores.semester1 || {})) {
          const v1 = Number(parsed.semesterScores.semester1[key] ?? 0);
          const v2 = Number(parsed.semesterScores.semester2[key] ?? 0);
          normalized[key] = Number(((v1 + v2) / 2).toFixed(2));
        }
        setScores(normalized);
      }
      if (parsed.selectedCombo) {
        setSelectedCombo(parsed.selectedCombo);
      }
      if (parsed.multiAnswers) {
        setMultiAnswers(parsed.multiAnswers);
      }
      if (parsed.answers && Object.keys(parsed.answers).length > 0 && !parsed.summary) {
        const fallback = Object.entries(parsed.answers)
          .map(([key, value]) => ({
            id: Number(key),
            question: `Câu ${key}`,
            answerKey: String(value),
            answerLabel: "",
          }))
          .sort((a, b) => a.id - b.id);
        setSummary(fallback);
      }
    } catch {
      setSummary(null);
    }
  }, []);

  const strengthSubjects = useMemo(() => {
    if (!scores) return [];
    const ranked = Object.entries(scores)
      .map(([subject, score]) => ({ subject, score }))
      .sort((a, b) => b.score - a.score);
    return ranked.slice(0, 3);
  }, [scores]);

  const skillsData = useMemo(() => {
    if (!scores) return [];
    const ranked = Object.entries(scores)
      .map(([subject, score]) => ({ name: subject, score }))
      .sort((a, b) => b.score - a.score);
    return ranked.slice(0, 4);
  }, [scores]);

  const weakSubjects = useMemo(() => {
    return getWeakSubjects(scores, 7.0);
  }, [scores]);

  const aiLines = useMemo(() => {
    if (!aiResult) return [];
    const cleaned = aiResult
      .replace(/\*{1,3}/g, "")
      .replace(/_{1,3}/g, "")
      .replace(/`/g, "")
      .replace(/#+/g, "")
      .trim();
    return cleaned
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^[-•\d\.\s]+/, "").trim())
      .filter(Boolean);
  }, [aiResult]);

  const visibleAiLines = aiExpanded ? aiLines : aiLines.slice(0, 6);

  const topMatch = matches[0];
  const topMatchLabel = topMatch
    ? `${topMatch.school_name || topMatch.school}${topMatch.major ? ` - ${topMatch.major}` : ""}`
    : "Chưa có dữ liệu";
  const topMatchScore = topMatch?.percent ?? 0;
  const universityCount = matches.length;
  const topRecommendationCount = Math.min(matches.length, 3);

  const handleCreateRoadmap = (match: AssessmentMatch) => {
    localStorage.setItem(
      "selectedSchool",
      JSON.stringify({
        program: match.program,
        school: match.school,
        school_name: match.school_name,
        major: match.major,
      })
    );
    localStorage.setItem("weakSubjects", JSON.stringify(weakSubjects));
    navigate("/roadmap");
  };

  useEffect(() => {
    if (!summary || summary.length === 0) return;

    const cachedKey = localStorage.getItem("assessmentAiKey");
    const cachedResult = localStorage.getItem("assessmentAiResult");
    const cachedMatches = localStorage.getItem("assessmentAiMatches");
    const debugMode = true;
    if (!debugMode && cachedKey === summaryKey && cachedResult && cachedMatches) {
      setAiResult(cachedResult);
      setMatches(JSON.parse(cachedMatches) as AssessmentMatch[]);
      setAiStatus("success");
      return;
    }

    const controller = new AbortController();
    const run = async () => {
      setAiStatus("loading");
      setAiError("");
      try {
        const response = await fetch(`${API_BASE}/assessment/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            summary,
            top_k: 6,
            selected_combo: selectedCombo,
            scores: scores ?? undefined,
            debug: true,
          }),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = (await response.json()) as {
          answer?: string;
          matches?: AssessmentMatch[];
          debug_docs?: Array<Record<string, unknown>>;
        };
        const answer = data.answer ?? "Không nhận được phản hồi từ AI.";
        const ranked = Array.isArray(data.matches) ? data.matches : [];
        setAiResult(answer);
        setMatches(ranked);
        setAiStatus("success");
        localStorage.setItem("assessmentAiKey", summaryKey);
        localStorage.setItem("assessmentAiResult", answer);
        localStorage.setItem("assessmentAiMatches", JSON.stringify(ranked));
        if (data.debug_docs) {
          console.log("CHROMA DEBUG DOCS", data.debug_docs);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setAiStatus("error");
        setAiError("Không thể lấy phân tích AI. Vui lòng thử lại.");
      }
    };

    run();
    return () => controller.abort();
  }, [isPremium, summary, summaryKey]);

  if (!isPremium) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm">
              <Lock className="size-4" />
              <span>Kết quả không đầy đủ</span>
            </div>
            <h1 className="text-4xl mt-4">Mở khóa kết quả chi tiết</h1>
            <p className="text-xl text-gray-600 mt-2">
              Bạn đang xem bản tóm tắt. Nâng cấp để nhận phân tích đầy đủ và lộ trình hành động.
            </p>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100 mb-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl">Tin nhắn từ AI Advisor</h2>
              <span className="text-sm text-orange-600">Bản tóm tắt</span>
            </div>
            {!summary || summary.length === 0 ? (
              <div className="text-gray-600">Chưa có dữ liệu đánh giá. Vui lòng làm bài test trước.</div>
            ) : aiStatus === "loading" ? (
              <LoadingIndicator label="Đang tổng hợp tin nhắn..." />
            ) : aiStatus === "error" ? (
              <div className="text-red-600">{aiError}</div>
            ) : aiLines.length > 0 ? (
              <>
                <ul className="space-y-2 text-gray-700">
                  {visibleAiLines.map((line, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500">-</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                {aiLines.length > 6 && (
                  <button
                    onClick={() => setAiExpanded((prev) => !prev)}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                  >
                    {aiExpanded ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </>
            ) : (
              <div className="text-gray-500">Đang chuẩn bị dữ liệu...</div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-6 mb-10"
          >
            {[
              "Top trường phù hợp + giải thích",
              "Danh sách trường + lọc tài chính",
              "Lộ trình 6–12–24 tháng",
            ].map((label) => (
              <div
                key={label}
                className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Lock className="size-5 text-orange-600" />
                  </div>
                  <div className="text-gray-700 font-medium">{label}</div>
                </div>
                <div className="text-xs text-gray-400">Yêu cầu Premium để mở khóa</div>
              </div>
            ))}
          </motion.div>

          
        </div>
      </div>
    );
  }

  const shouldBlockPage = Boolean(summary) && aiStatus === "loading";
  if (shouldBlockPage) {
    return <FullPageLoading label="Đang tổng hợp kết quả từ dữ liệu..." />;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-700 text-sm">Đánh giá hoàn tất ✓</span>
          </div>
          <h1 className="text-4xl mb-4">Kết quả hướng nghiệp</h1>
          <p className="text-xl text-gray-600">
            Dựa trên bài test và dữ liệu học tập, hệ thống đề xuất trường phù hợp
          </p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Award className="size-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-semibold text-blue-600">{topMatchScore}%</div>
                <div className="text-sm text-gray-600">Điểm phù hợp cao nhất</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{topMatchLabel}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="size-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-semibold text-blue-600">{universityCount}</div>
                <div className="text-sm text-gray-600">Trường phù hợp</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Dựa trên điểm số và sở thích của bạn</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Lightbulb className="size-6 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-semibold text-orange-600">{topRecommendationCount}</div>
                <div className="text-sm text-gray-600">Gợi ý hàng đầu</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Các trường phù hợp nhất với hồ sơ của bạn</p>
          </motion.div>
        </div>

        {/* Insight Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl">Phân tích từ AI Advisor</h2>
              <span className="text-sm text-orange-600">Gemini + Chroma (RAG)</span>
            </div>
            {!summary || summary.length === 0 ? (
              <div className="text-gray-600">
                Chưa có dữ liệu đánh giá. Vui lòng làm bài test trước.
              </div>
            ) : aiStatus === "loading" ? (
              <LoadingIndicator label="Đang phân tích hồ sơ..." />
            ) : aiStatus === "error" ? (
              <div className="text-red-600">{aiError}</div>
            ) : aiLines.length > 0 ? (
              <>
                <ul className="space-y-2 text-gray-700">
                  {visibleAiLines.map((line, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                {aiLines.length > 6 && (
                  <button
                    onClick={() => setAiExpanded((prev) => !prev)}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700"
                  >
                    {aiExpanded ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </>
            ) : (
              <div className="text-gray-500">Đang chuẩn bị dữ liệu...</div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-100"
          >
            <h2 className="text-2xl mb-6">Điểm mạnh & môn cần cải thiện</h2>
            {skillsData.length === 0 ? (
              <div className="text-gray-600">Chưa có dữ liệu điểm để phân tích.</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={skillsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                    <YAxis domain={[0, 10]} tick={{ fill: "#6b7280" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    />
                    <Bar dataKey="score" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Môn mạnh</div>
                    <div className="space-y-2">
                      {strengthSubjects.map((item) => (
                        <div key={item.subject} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                          <span>{item.subject}</span>
                          <span className="text-blue-600 font-semibold">{item.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Môn cần cải thiện</div>
                    <div className="space-y-2">
                      {weakSubjects.map((subject) => (
                        <div key={subject} className="flex items-center justify-between bg-orange-50 px-3 py-2 rounded-lg">
                          <span>{subject}</span>
                          <span className="text-orange-600 font-semibold">Ưu tiên</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Top School Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl mb-8">Top trường phù hợp</h2>
          {aiStatus === "loading" ? (
            <LoadingIndicator label="Đang tải danh sách trường phù hợp..." />
          ) : matches.length === 0 ? (
            <div className="text-gray-600">Chưa có dữ liệu trường phù hợp.</div>
          ) : (
            <div className="space-y-6">
              {matches.map((match, idx) => (
                <motion.div
                  key={match.program}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-100 hover:border-blue-300 transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl">{match.school_name || match.school}</h3>
                          <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm">
                            #{idx + 1} Phù hợp
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {match.major ? `Ngành: ${match.major}` : "Ngành: Tổng hợp"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-semibold text-blue-700">
                          {match.percent}%
                        </div>
                        <div className="text-sm text-gray-600">Độ tương thích</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${match.percent}%` }}
                          transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                          className="h-full bg-blue-600"
                        />
                      </div>
                    </div>

                    {match.evidence.length > 0 && (
                      <div className="text-sm text-gray-600 space-y-2 mb-4">
                        {match.evidence.map((item, evidenceIndex) => (
                          <div key={evidenceIndex}>• {item}</div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleCreateRoadmap(match)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
                    >
                      Tạo roadmap
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex gap-4 justify-center mt-12"
        >
          <Link
            to="/universities"
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all"
          >
            <span>Khám phá trường đại học</span>
            <ChevronRight className="size-5" />
          </Link>
          <Link
            to="/roadmap"
            className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-orange-200 text-orange-600 rounded-xl hover:border-orange-300 transition-all"
          >
            <Sparkles className="size-5" />
            <span>Xem lộ trình sự nghiệp</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
