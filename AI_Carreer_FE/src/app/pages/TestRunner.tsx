import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

type TestQuestion = {
  id: number;
  type: string;
  option_a: string;
  option_b: string;
  option_c?: string;
  option_d?: string;
  option_e?: string;
  value_a?: string;
  value_b?: string;
  value_c?: string;
  value_d?: string;
  value_e?: string;
  question?: string;
};

const TEST_TITLES: Record<string, string> = {
  mbti: "LÀM BÀI TEST TÍNH CÁCH",
  disc: "LÀM BÀI TEST TÍNH CÁCH",
  holland: "LÀM BÀI TEST MẬT MÃ HOLLAND",
  intel: "LÀM BÀI TEST ĐA TRÍ THÔNG MINH",
};

const TEST_SUMMARY_TITLES: Record<string, string> = {
  mbti: "Bài kiểm tra tính cách",
  disc: "Bài kiểm tra D.I.S.C",
  holland: "Bài test mật mã",
  intel: "Bài kiểm tra đa trí thông minh",
};

export function TestRunner() {
  const { testType } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [mbtiScores, setMbtiScores] = useState<Record<number, { a: number; b: number }>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40 * 60);

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

  const title = useMemo(() => {
    const key = (testType || "").toLowerCase();
    return TEST_TITLES[key] || "LÀM BÀI TEST";
  }, [testType]);

  const totalSeconds = useMemo(() => {
    const key = (testType || "").toLowerCase();
    if (key === "intel") return 20 * 60;
    if (key === "holland") return 15 * 60;
    if (key === "disc") return 15 * 60;
    return 40 * 60;
  }, [testType]);

  const summaryTitle = useMemo(() => {
    const key = (testType || "").toLowerCase();
    return TEST_SUMMARY_TITLES[key] || "Bài kiểm tra";
  }, [testType]);

  useEffect(() => {
    if (!started) {
      setTimeLeft(totalSeconds);
    }
  }, [totalSeconds, started]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/tests/${testType}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`Fetch failed: ${res.status}`);
        }
        const data = await res.json();
        setQuestions(Array.isArray(data.questions) ? data.questions : []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Không tải được dữ liệu bài test.");
      } finally {
        setLoading(false);
      }
    };
    if (testType) load();
    return () => controller.abort();
  }, [testType]);

  const questionCount = questions.length;

  const getOptions = (q: TestQuestion) => {
    const options: { key: string; label: string }[] = [];
    if (q.option_a) options.push({ key: "a", label: q.option_a });
    if (q.option_b) options.push({ key: "b", label: q.option_b });
    if (q.option_c) options.push({ key: "c", label: q.option_c });
    if (q.option_d) options.push({ key: "d", label: q.option_d });
    if (q.option_e) options.push({ key: "e", label: q.option_e });
    return options;
  };

  const answeredCount = useMemo(() => {
    return questions.reduce((count, q) => {
      const isAnswered =
        Boolean(answers[q.id]) || (testType?.toLowerCase() === "mbti" && mbtiScores[q.id]);
      return count + (isAnswered ? 1 : 0);
    }, 0);
  }, [questions, answers, mbtiScores, testType]);

  const isComplete = questionCount > 0 && answeredCount === questionCount;

  const handleSubmit = async () => {
    const mode = testType?.toLowerCase();
    if (mode === "mbti") {
      const scores = Object.entries(mbtiScores).map(([id, value]) => ({
        id: Number(id),
        a: value.a,
        b: value.b,
      }));
      if (scores.length === 0) return;
      const response = await fetch(`${API_BASE}/mbti/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores }),
      });
      if (!response.ok) return;
      const data = await response.json();
      localStorage.setItem("mbtiResult", JSON.stringify(data));
      navigate("/mbti-result");
      return;
    }

    if (mode === "intel") {
      const answersPayload = Object.entries(answers).map(([id, value]) => ({
        id: Number(id),
        answer: value.toUpperCase(),
      }));
      const response = await fetch(`${API_BASE}/mi/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersPayload }),
      });
      if (!response.ok) return;
      const data = await response.json();
      localStorage.setItem("miResult", JSON.stringify(data));
      navigate("/intel-result");
      return;
    }

    if (mode === "holland") {
      const answersPayload = Object.entries(answers).map(([id, value]) => ({
        id: Number(id),
        value: Number(value),
      }));
      const response = await fetch(`${API_BASE}/holland/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersPayload }),
      });
      if (!response.ok) return;
      const data = await response.json();
      localStorage.setItem("hollandResult", JSON.stringify(data));
      navigate("/holland-result");
      return;
    }

    if (mode === "disc") {
      const answersPayload = Object.entries(answers).map(([id, key]) => {
        const q = questions.find((item) => item.id === Number(id));
        if (!q) return null;
        const valueKey = `value_${key.toLowerCase()}` as keyof TestQuestion;
        const rawValue = q[valueKey];
        return {
          id: Number(id),
          value: Number(rawValue ?? 0),
        };
      }).filter(Boolean);
      const response = await fetch(`${API_BASE}/disc/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersPayload }),
      });
      if (!response.ok) return;
      const data = await response.json();
      localStorage.setItem("discResult", JSON.stringify(data));
      navigate("/disc-result");
    }
  };

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-wide uppercase">{title}</h1>
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
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : !started ? (
              <>
                <h2 className="text-lg font-semibold text-slate-800">
                  {summaryTitle} {questionCount} câu
                </h2>
                <div className="mt-4 space-y-2 text-slate-700">
                  <div>
                    <span className="font-semibold">Số câu hỏi:</span> {questionCount}
                  </div>
                  <div>
                    <span className="font-semibold">Thời gian:</span> 0:{String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:0
                  </div>
                  <div className="pt-2">
                    <span className="font-semibold">Yêu cầu:</span>
                    <p className="mt-1 text-sm text-slate-600">
                      {testType?.toLowerCase() === "intel"
                        ? `Bài trắc nghiệm dưới đây bao gồm ${questionCount} câu, mỗi câu có 2 đáp án [Đúng] và [Sai]. Chọn [Đúng] cho những câu chắc chắn mô tả đúng bản thân; các câu không khớp hoặc không chắc chắn chọn [Sai].`
                        : testType?.toLowerCase() === "disc"
                        ? `Bài trắc nghiệm dưới đây bao gồm ${questionCount} câu, mỗi câu có 4 tính từ mô tả các đặc điểm tính cách khác nhau. Hãy chọn mô tả chính xác và nổi trội nhất về biểu hiện tính cách của bạn.`
                        : testType?.toLowerCase() === "holland"
                        ? `Bài trắc nghiệm dưới đây bao gồm ${questionCount} câu, mỗi câu có mốc điểm từ 0 - 4 theo quy ước: 0 điểm (hoàn toàn không đúng), 1 điểm (đúng trong một số trường hợp), 2 điểm (đúng 50%), 3 điểm (đúng khoảng 80–90%), 4 điểm (hoàn toàn đúng). Hãy chọn đáp án bạn cảm thấy đúng nhất với bản thân.`
                        : `Bài trắc nghiệm dưới đây bao gồm ${questionCount} câu, mỗi câu có 2 ý A và B thể hiện một nét tính cách của bạn. Tổng điểm của mỗi câu BẮT BUỘC là 5 điểm, 5 điểm này được chia cho 2 ý A và B của mỗi câu.`}
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setStarted(true);
                      setTimeLeft(totalSeconds);
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
                  const isMbtiAnswered = Boolean(
                    testType?.toLowerCase() === "mbti" && mbtiScores[q.id] && typeof mbtiScores[q.id].a === "number"
                  );
                  const options = getOptions(q);
                  return (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="text-sm font-semibold text-slate-500">
                        Câu {q.id} / {questionCount}
                      </div>
                      {q.question && <div className="mt-2 text-base text-slate-800">{q.question}</div>}
                      {testType?.toLowerCase() === "mbti" ? (
                        <div className="mt-4 space-y-6">
                          {(["a", "b"] as const).map((key) => {
                            const label = key === "a" ? q.option_a : q.option_b;
                            const current = mbtiScores[q.id];
                            const selectedScore = current?.[key];
                            return (
                              <div key={key}>
                                <div className="text-sm font-semibold text-slate-800">
                                  {key}. {label}
                                </div>
                                <div className="mt-2 flex items-center gap-4 text-sm">
                                  <span className="text-green-600">✓ Đánh giá</span>
                                  <div className="flex flex-wrap items-center gap-4">
                                    {[0, 1, 2, 3, 4, 5].map((score) => (
                                      <label key={score} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="radio"
                                          name={`q-${q.id}-${key}`}
                                          checked={selectedScore === score}
                                          onChange={() => {
                                            const a = key === "a" ? score : 5 - score;
                                            const b = key === "b" ? score : 5 - score;
                                            setMbtiScores({ ...mbtiScores, [q.id]: { a, b } });
                                            setAnswers({ ...answers, [q.id]: "mbti" });
                                          }}
                                        />
                                        <span>{score} điểm</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {options.map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => {
                              if (testType?.toLowerCase() === "holland") {
                                const valueKey = `value_${opt.key}` as keyof TestQuestion;
                                const rawValue = q[valueKey];
                                setAnswers({ ...answers, [q.id]: String(rawValue ?? 0) });
                              } else {
                                setAnswers({ ...answers, [q.id]: opt.key });
                              }
                            }}
                            className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                              selected === opt.key
                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                : "border-slate-200 hover:border-slate-400"
                            }`}
                          >
                              <span className="block font-semibold text-slate-700">{opt.key.toUpperCase()}.</span>
                              <span className="text-slate-600">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
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
                  const isAnswered = Boolean(answers[q.id]) || (testType?.toLowerCase() === "mbti" && mbtiScores[q.id]);
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
    </div>
  );
}
