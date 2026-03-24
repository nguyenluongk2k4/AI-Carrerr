import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ResultsFooterCta } from "../components/ResultsFooterCta";
import { useAuth } from "../utils/useAuth";
import { saveResult } from "../utils/saveResult";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

const SUBJECT_LABELS: Record<string, string> = {
  dialy: "Địa lý",
  hoahoc: "Hóa học",
  tinhoc: "Tin học",
  history: "Lịch sử",
  biology: "Sinh học",
  literature: "Văn học",
  general: "Kiến thức tổng hợp",
  culture: "Văn hóa - Nghệ thuật",
  iq: "Test IQ",
};

type AbilityQuestion = {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c?: string;
  option_d?: string;
  value_a?: number;
  value_b?: number;
  value_c?: number;
  value_d?: number;
};

const TOTAL_SECONDS = 10 * 60;

export function AbilityRunnerFixed() {
  const navigate = useNavigate();
  const { subject } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AbilityQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [score, setScore] = useState<number | null>(null);

  const subjectLabel = useMemo(() => {
    if (!subject) return "Năng lực";
    return SUBJECT_LABELS[subject] ?? "Năng lực";
  }, [subject]);

  useEffect(() => {
    if (!subject) return;
    const controller = new AbortController();
    setLoading(true);
    setLoadError(null);
    fetch(`${API_BASE}/ability/${subject}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => setQuestions(data.questions ?? []))
      .catch(() => setLoadError("Không tải được dữ liệu môn học."))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [subject]);

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const questionCount = questions.length;

  const answeredCount = useMemo(() => {
    return questions.reduce((count, q) => count + (answers[q.id] ? 1 : 0), 0);
  }, [questions, answers]);

  const isComplete = questionCount > 0 && answeredCount === questionCount;

  const getOptions = (q: AbilityQuestion) => {
    const options: { key: string; label: string }[] = [];
    if (q.option_a) options.push({ key: "a", label: q.option_a });
    if (q.option_b) options.push({ key: "b", label: q.option_b });
    if (q.option_c) options.push({ key: "c", label: q.option_c });
    if (q.option_d) options.push({ key: "d", label: q.option_d });
    return options;
  };

  const handleSubmit = async () => {
    if (!subject) return;
    const answersPayload = Object.entries(answers).map(([id, answer]) => ({
      id: Number(id),
      answer,
    }));
    const response = await fetch(`${API_BASE}/ability/grade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, answers: answersPayload }),
    });
    if (!response.ok) return;
    const data = (await response.json()) as { score: number };
    setScore(data.score ?? 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`;
  };

  if (!subject) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-slate-600">Không tìm thấy môn học.</p>
        <button
          className="mt-4 rounded-md bg-orange-500 px-4 py-2 text-white"
          onClick={() => navigate("/ability")}
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-wide uppercase">
          LÀM BÀI TEST NĂNG LỰC
        </h1>
        <div className="mt-3 flex items-center justify-center gap-6 text-sm sm:text-base font-semibold uppercase text-slate-900">
          <span className="text-orange-500 border-l-4 border-orange-500 pl-4">Xem bài test</span>
          <span className="text-slate-500">|</span>
          <span>Làm bài</span>
          <span className="text-slate-500">|</span>
          <span>Nộp bài</span>
          <span className="text-slate-500">|</span>
          <span>Xem kết quả</span>
        </div>
        <div className="mt-6 h-[2px] bg-slate-200" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            {loading ? (
              <p className="text-slate-500">Đang tải dữ liệu...</p>
            ) : loadError ? (
              <p className="text-red-500">{loadError}</p>
            ) : !started ? (
              <>
                <h2 className="text-lg font-semibold text-slate-800">
                  Bài kiểm tra năng lực {subjectLabel} {questionCount} câu
                </h2>
                <div className="mt-4 space-y-2 text-slate-700">
                  <div>
                    <span className="font-semibold">Số câu hỏi:</span> {questionCount}
                  </div>
                  <div>
                    <span className="font-semibold">Thời gian:</span> 0:10:0
                  </div>
                  <div className="pt-2">
                    <span className="font-semibold">Yêu cầu:</span>
                    <p className="mt-1 text-sm text-slate-600">
                      Hãy chọn đáp án đúng nhất cho từng câu hỏi. Kết quả sẽ được tổng hợp sau khi bạn nộp bài.
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setStarted(true);
                      setTimeLeft(TOTAL_SECONDS);
                    }}
                    className="min-w-[260px] rounded-full border-2 border-slate-400 px-6 py-2 text-sm font-semibold text-slate-700 hover:border-slate-600 hover:text-slate-900"
                  >
                    Bắt đầu làm bài test
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const q = questions[currentIndex];
                  if (!q) return null;
                  const selected = answers[q.id];
                  const options = getOptions(q);
                  return (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="text-sm font-semibold text-slate-500">
                        Câu {q.id} / {questionCount}
                      </div>
                      <div className="mt-2 text-base text-slate-800">{q.question}</div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {options.map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setAnswers({ ...answers, [q.id]: opt.key })}
                            className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                              selected === opt.key
                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                : "border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            <span className="block font-semibold text-slate-700">
                              {opt.key.toUpperCase()}.
                            </span>
                            <span className="text-slate-600">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                          disabled={currentIndex === 0}
                          className="rounded-full border border-slate-300 px-5 py-2 text-sm text-slate-600 hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Câu trước
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentIndex((idx) => Math.min(questionCount - 1, idx + 1))}
                          disabled={currentIndex >= questionCount - 1}
                          className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Câu tiếp theo
                        </button>
                      </div>
                      {isComplete && (
                        <div className="mt-8 space-y-4">
                          <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full rounded-md bg-[#7cc251] py-3 text-center font-semibold text-white shadow-sm hover:bg-[#6ab344]"
                          >
                            NỘP BÀI
                          </button>
                          <div className="text-sm text-green-700 italic">
                            WOW! Chúc mừng bạn đã hoàn thành bài kiểm tra. Bạn vui lòng nộp bài để xem kết quả.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                {score !== null && (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-orange-200 text-slate-800 px-4 py-2 font-semibold">
                      Bài trắc nghiệm {subjectLabel} {questionCount} câu
                    </div>
                    <div className="p-4 text-slate-700">
                      <div className="text-sm font-semibold mb-2">Kết quả bài Test</div>
                      <div className="flex items-center justify-between border-b py-2 text-sm">
                        <span>Số câu hỏi</span>
                        <span>{questionCount}</span>
                      </div>
                      <div className="flex items-center justify-between border-b py-2 text-sm">
                        <span>Thời gian</span>
                        <span>0:10:0</span>
                      </div>
                      <div className="flex items-center justify-between py-2 text-sm">
                        <span>Kết quả</span>
                        <span>
                          {score}/{questionCount}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
                          onClick={() => window.location.reload()}
                        >
                          Làm lại
                        </button>
                        {user?.isPremium && (
                          <button
                            type="button"
                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                            onClick={async () => {
                              if (!subject) return;
                              await saveResult(user.username, "ability", {
                                subject,
                                score,
                                total: questionCount,
                              });
                            }}
                          >
                            Lưu kết quả
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 p-4 text-center">
              <div className="text-sm font-semibold text-slate-600">Thời gian còn lại</div>
              <div className="mt-2 text-2xl font-bold text-slate-700">00 : {formatTime(timeLeft)}</div>
            </div>
            <div className="max-h-[520px] overflow-y-auto p-4">
              <div className="grid grid-cols-4 gap-3">
                {questions.map((q, index) => {
                  const isAnswered = Boolean(answers[q.id]);
                  const isCurrent = started && index === currentIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => started && setCurrentIndex(index)}
                      className={`flex items-center justify-center rounded-full text-sm font-semibold h-10 w-10 border ${
                        isCurrent
                          ? "border-orange-500 text-orange-600"
                          : isAnswered
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-slate-300 text-slate-600"
                      }`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {score !== null && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <ResultsFooterCta />
        </div>
      )}
    </div>
  );
}
