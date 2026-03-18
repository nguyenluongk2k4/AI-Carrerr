import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ALL_QUESTIONS,
  PART1_QUESTIONS,
  PART2_QUESTIONS,
  PART5_QUESTIONS,
  SUBJECTS,
  getComboScores,
} from "../data/assessment";
import { useAuth } from "../utils/useAuth";

const steps = [
  { id: 1, title: "Sở thích & xu hướng" },
  { id: 2, title: "Học tập & Điểm mạnh" },
  { id: 3, title: "Điểm 2 kỳ" },
  { id: 4, title: "Tổ hợp môn" },
  { id: 5, title: "Tài chính & Kỳ vọng" },
];

export function Assessment() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/", { replace: true });
  }, [user, navigate]);

  // Load saved data from localStorage on mount
  const loadSavedData = () => {
    const saved = localStorage.getItem("assessment_progress");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.answers) setAnswers(data.answers);
        if (data.multiAnswers) setMultiAnswers(data.multiAnswers);
        if (data.scoresSemester1) setScoresSemester1(data.scoresSemester1);
        if (data.scoresSemester2) setScoresSemester2(data.scoresSemester2);
        if (data.selectedCombo) setSelectedCombo(data.selectedCombo);
        if (data.currentStep) return data.currentStep;
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    return 1;
  };

  const [currentStep, setCurrentStep] = useState(loadSavedData);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<number, string[]>>({}); // For Q19
  const [scoresSemester1, setScoresSemester1] = useState<Record<string, string>>(
    Object.fromEntries(SUBJECTS.map((subject) => [subject.key, ""]))
  );
  const [scoresSemester2, setScoresSemester2] = useState<Record<string, string>>(
    Object.fromEntries(SUBJECTS.map((subject) => [subject.key, ""]))
  );
  const [selectedCombo, setSelectedCombo] = useState("");

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("assessment_progress", JSON.stringify({
      currentStep,
      answers,
      multiAnswers,
      scoresSemester1,
      scoresSemester2,
      selectedCombo,
    }));
  }, [currentStep, answers, multiAnswers, scoresSemester1, scoresSemester2, selectedCombo]);

  // Scroll to first question when step changes
  useEffect(() => {
    // Force scroll after step change
    const scrollTimeout = setTimeout(() => {
      const element = document.getElementById(`step-${currentStep}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        console.log('Scrolled to step', currentStep);
      } else {
        console.log('Step element not found:', currentStep);
        // Fallback to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
    return () => clearTimeout(scrollTimeout);
  }, [currentStep]);

  const numericScores = useMemo(() => {
    const result: Record<string, number> = {};
    for (const subject of SUBJECTS) {
      const value1 = Number(scoresSemester1[subject.key] ?? 0);
      const value2 = Number(scoresSemester2[subject.key] ?? 0);
      const score1 = Number.isFinite(value1) ? value1 : 0;
      const score2 = Number.isFinite(value2) ? value2 : 0;
      result[subject.key] = Number(((score1 + score2) / 2).toFixed(2));
    }
    return result;
  }, [scoresSemester1, scoresSemester2]);

  const comboScores = useMemo(() => getComboScores(numericScores), [numericScores]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      const summary = [
        ...ALL_QUESTIONS.map((item) => {
          const selectedKey = answers[item.id];
          const selectedOption = item.options.find((option) => option.key === selectedKey);
          return {
            id: item.id,
            question: item.question,
            answerKey: selectedKey ?? "",
            answerLabel: selectedOption?.label ?? "",
          };
        }),
        // Handle multi-select for Q19
        {
          id: 19,
          question: "Thói quen học tập",
          answerKey: multiAnswers[19]?.join(", ") ?? "",
          answerLabel: multiAnswers[19]?.map(key => {
            const opt = PART5_QUESTIONS.find(q => q.id === 19)?.options.find(o => o.key === key);
            return opt?.label ?? key;
          }).join(", ") ?? "",
        },
        {
          id: 100,
          question: "Tổng điểm 2 kỳ gần nhất (theo môn)",
          answerKey: "",
          answerLabel: SUBJECTS.map((subject) => {
            const hk1 = scoresSemester1[subject.key] || 0;
            const hk2 = scoresSemester2[subject.key] || 0;
            return `${subject.label} (Học kỳ 1: ${hk1}, Học kỳ 2: ${hk2})`;
          }).join(", "),
        },
        {
          id: 101,
          question: "Tổ hợp môn đã chọn",
          answerKey: "",
          answerLabel: selectedCombo,
        },
      ];

      localStorage.setItem(
        "assessmentData",
        JSON.stringify({
          answers,
          multiAnswers,
          scores: numericScores,
          semesterScores: {
            semester1: scoresSemester1,
            semester2: scoresSemester2,
          },
          selectedCombo,
          summary,
        })
      );
      // Clear progress data after completing
      localStorage.removeItem("assessment_progress");
      navigate("/results");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: // Part 1: Q1-5
        return PART1_QUESTIONS.every((q) => Boolean(answers[q.id]));
      case 2: // Part 2: Q6-11
        return PART2_QUESTIONS.every((q) => Boolean(answers[q.id]));
      case 3: // Scores
        return (
          SUBJECTS.every((subject) => scoresSemester1[subject.key] !== "") &&
          SUBJECTS.every((subject) => scoresSemester2[subject.key] !== "")
        );
      case 4: // Combo
        return selectedCombo !== "";
      case 5: // Part 5: Q12-21 (Q19 is multi-select)
        return PART5_QUESTIONS.every((q) => {
          if (q.isMultiSelect) {
            return multiAnswers[q.id] && multiAnswers[q.id].length > 0;
          }
          return Boolean(answers[q.id]);
        });
      default:
        return false;
    }
  };

  const renderQuizQuestion = (questionId: number) => {
    const question = ALL_QUESTIONS.find((item) => item.id === questionId);
    if (!question) return null;
    
    // Handle multi-select for Q19
    if (question.isMultiSelect) {
      const currentAnswers = multiAnswers[questionId] || [];
      return (
        <div>
          <h2 className="text-2xl mb-2">Câu hỏi {questionId}</h2>
          <p className="text-gray-600 mb-6">{question.question}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {question.options.map((option) => {
              const isSelected = currentAnswers.includes(option.key);
              return (
                <button
                  key={option.key}
                  onClick={() => {
                    const newAnswers = isSelected
                      ? currentAnswers.filter((k) => k !== option.key)
                      : [...currentAnswers, option.key];
                    setMultiAnswers({
                      ...multiAnswers,
                      [questionId]: newAnswers,
                    });
                  }}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                      : "bg-gray-50 border-transparent hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">{option.key}</div>
                  <div className="text-sm">{option.label}</div>
                </button>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Đã chọn: {currentAnswers.length} đáp án
          </p>
        </div>
      );
    }
    
    // Single select
    const currentAnswer = answers[questionId];
    return (
      <div>
        <h2 className="text-2xl mb-2">Câu hỏi {questionId}</h2>
        <p className="text-gray-600 mb-6">{question.question}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {question.options.map((option) => (
            <button
              key={option.key}
              onClick={() =>
                setAnswers({
                  ...answers,
                  [questionId]: option.key,
                })
              }
              className={`p-4 rounded-xl text-left transition-all border-2 ${
                currentAnswer === option.key
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                  : "bg-gray-50 border-transparent hover:bg-gray-100"
              }`}
            >
              <div className="text-sm font-semibold mb-1">{option.key}</div>
              <div className="text-sm">{option.label}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Bài đánh giá hướng nghiệp</h1>
          <p className="text-xl text-gray-600">
            Đi qua các bước để đề xuất tổ hợp môn và trường phù hợp
          </p>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-blue-600 text-white scale-110"
                          : isComplete
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <span className="text-sm font-semibold">{step.id}</span>
                    </div>
                    <span className={`text-sm mt-2 ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded ${
                        isComplete ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            {/* Step 1: Part 1 - Q1 to Q5 */}
            {currentStep === 1 && (
              <div id="step-1" className="space-y-8">
                {PART1_QUESTIONS.map((q) => (
                  <div key={q.id}>{renderQuizQuestion(q.id)}</div>
                ))}
              </div>
            )}

            {/* Step 2: Part 2 - Q6 to Q11 */}
            {currentStep === 2 && (
              <div id="step-2" className="space-y-8">
                {PART2_QUESTIONS.map((q) => (
                  <div key={q.id}>{renderQuizQuestion(q.id)}</div>
                ))}
              </div>
            )}

            {/* Step 3: Scores */}
            {currentStep === 3 && (
              <div id="step-3">
                <h2 className="text-2xl mb-2">Tổng điểm 2 kỳ gần nhất</h2>
                <p className="text-gray-600 mb-6">
                  Nhập điểm Học kỳ 1 và Học kỳ 2 cho từng môn (thang 0-10).
                </p>
                <div className="space-y-4">
                  {SUBJECTS.map((subject) => (
                    <div key={subject.key} className="grid sm:grid-cols-3 gap-3 items-center">
                      <div className="text-sm text-gray-600">{subject.label}</div>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={scoresSemester1[subject.key]}
                        onChange={(event) =>
                          setScoresSemester1({
                            ...scoresSemester1,
                            [subject.key]: event.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Học kỳ 1 (0-10)"
                      />
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={scoresSemester2[subject.key]}
                        onChange={(event) =>
                          setScoresSemester2({
                            ...scoresSemester2,
                            [subject.key]: event.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Học kỳ 2 (0-10)"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Combo */}
            {currentStep === 4 && (
              <div id="step-4">
                <h2 className="text-2xl mb-2">Tổ hợp môn phù hợp</h2>
                <p className="text-gray-600 mb-6">
                  Dựa trên điểm 2 kỳ, hệ thống gợi ý tổ hợp môn nên ưu tiên.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {comboScores.map((combo, index) => (
                    <button
                      key={combo.code}
                      onClick={() => setSelectedCombo(combo.code)}
                      className={`p-5 rounded-2xl text-left border-2 transition-all ${
                        selectedCombo === combo.code
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                          : "bg-gray-50 border-transparent hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-semibold">{combo.code}</div>
                        <div className="text-sm text-orange-500">
                          {index < 3 ? "Đề xuất" : "Tham khảo"}
                        </div>
                      </div>
                      <div className="text-sm mb-2">
                        Môn: {combo.subjects.join(", ")}
                      </div>
                      <div className="text-sm">Tổng điểm: {combo.score}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Part 5 - Q12 to Q21 */}
            {currentStep === 5 && (
              <div id="step-5" className="space-y-8">
                {PART5_QUESTIONS.map((q) => (
                  <div key={q.id}>{renderQuizQuestion(q.id)}</div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="size-5" />
            <span>Quay lại</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{currentStep === steps.length ? "Xem kết quả" : "Tiếp tục"}</span>
            {currentStep === steps.length ? (
              <Sparkles className="size-5" />
            ) : (
              <ChevronRight className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
