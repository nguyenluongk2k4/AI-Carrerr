import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  ALL_QUESTIONS,
  QUIZ_QUESTIONS,
  PERSONAL_QUESTIONS,
  SUBJECTS,
  HABIT_OPTIONS,
  SALARY_OPTIONS,
  FAMILY_OPTIONS,
  LOCATION_OPTIONS,
  getComboScores,
} from "../data/assessment";
import { CustomTagInput } from "../components/CustomTagInput";

const steps = [
  { id: 1, title: "Sở thích" },
  { id: 2, title: "Môn tự tin" },
  { id: 3, title: "Điểm 2 kỳ" },
  { id: 4, title: "Tổ hợp môn" },
  { id: 5, title: "Ưu tiên" },
];

export function Assessment() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scoresSemester1, setScoresSemester1] = useState<Record<string, string>>(
    Object.fromEntries(SUBJECTS.map((subject) => [subject.key, ""]))
  );
  const [scoresSemester2, setScoresSemester2] = useState<Record<string, string>>(
    Object.fromEntries(SUBJECTS.map((subject) => [subject.key, ""]))
  );
  const [selectedCombo, setSelectedCombo] = useState("");
  const [habits, setHabits] = useState<string[]>([]);
  const [salary, setSalary] = useState("");
  const [familyCondition, setFamilyCondition] = useState("");
  const [locations, setLocations] = useState<string[]>([]);

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
        {
          id: 100,
          question: "Tổng điểm 2 kỳ gần nhất (theo môn)",
          answerKey: "",
          answerLabel: SUBJECTS.map((subject) => {
            const hk1 = scoresSemester1[subject.key] || 0;
            const hk2 = scoresSemester2[subject.key] || 0;
            return `${subject.label} (HK1: ${hk1}, HK2: ${hk2})`;
          }).join(", "),
        },
        {
          id: 101,
          question: "Tổ hợp môn đã chọn",
          answerKey: "",
          answerLabel: selectedCombo,
        },
        {
          id: 102,
          question: "Thói quen học tập",
          answerKey: "",
          answerLabel: habits.join(", "),
        },
        {
          id: 103,
          question: "Mức lương mong muốn",
          answerKey: "",
          answerLabel: salary,
        },
        {
          id: 104,
          question: "Điều kiện gia đình",
          answerKey: "",
          answerLabel: familyCondition,
        },
        {
          id: 105,
          question: "Địa điểm mong muốn",
          answerKey: "",
          answerLabel: locations.join(", "),
        },
      ];

      localStorage.setItem(
        "assessmentData",
        JSON.stringify({
          answers,
          scores: numericScores,
          semesterScores: {
            semester1: scoresSemester1,
            semester2: scoresSemester2,
          },
          selectedCombo,
          habits,
          salary,
          familyCondition,
          locations,
          summary,
        })
      );
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
      case 1:
        return Boolean(answers[1]);
      case 2:
        return Boolean(answers[2]);
      case 3:
        return (
          SUBJECTS.every((subject) => scoresSemester1[subject.key] !== "") &&
          SUBJECTS.every((subject) => scoresSemester2[subject.key] !== "")
        );
      case 4:
        return selectedCombo !== "";
      case 5: {
        const stepQuestions = [3, 4, 5, ...PERSONAL_QUESTIONS.map((item) => item.id)];
        return (
          stepQuestions.every((id) => Boolean(answers[id])) &&
          habits.length > 0 &&
          salary !== "" &&
          familyCondition !== "" &&
          locations.length > 0
        );
      }
      default:
        return false;
    }
  };

  const renderQuizQuestion = (questionId: number) => {
    const question = ALL_QUESTIONS.find((item) => item.id === questionId);
    if (!question) return null;
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
            {currentStep === 1 && renderQuizQuestion(1)}
            {currentStep === 2 && renderQuizQuestion(2)}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl mb-2">Tổng điểm 2 kỳ gần nhất</h2>
                <p className="text-gray-600 mb-6">
                  Nhập điểm HK1 và HK2 cho từng môn (thang 0-10).
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
                        placeholder="HK1 (0-10)"
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
                        placeholder="HK2 (0-10)"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
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

            {currentStep === 5 && (
              <div className="space-y-8">
                {renderQuizQuestion(3)}
                {renderQuizQuestion(4)}
                {renderQuizQuestion(5)}
                {PERSONAL_QUESTIONS.map((item) => (
                  <div key={item.id}>{renderQuizQuestion(item.id)}</div>
                ))}

                <div>
                  <h3 className="text-xl mb-3">Thói quen học tập</h3>
                  <CustomTagInput
                    presets={HABIT_OPTIONS}
                    selected={habits}
                    onChange={setHabits}
                    multi
                    placeholder="Thêm thói quen khác..."
                  />
                </div>

                <div>
                  <h3 className="text-xl mb-3">Mức lương mong muốn</h3>
                  <CustomTagInput
                    presets={SALARY_OPTIONS}
                    selected={salary ? [salary] : []}
                    onChange={(vals) => setSalary(vals[vals.length - 1] ?? "")}
                    multi={false}
                    placeholder="Nhập mức lương khác..."
                  />
                </div>

                <div>
                  <h3 className="text-xl mb-3">Điều kiện gia đình</h3>
                  <CustomTagInput
                    presets={FAMILY_OPTIONS}
                    selected={familyCondition ? [familyCondition] : []}
                    onChange={(vals) => setFamilyCondition(vals[vals.length - 1] ?? "")}
                    multi={false}
                    placeholder="Mô tả điều kiện gia đình..."
                  />
                </div>

                <div>
                  <h3 className="text-xl mb-3">Địa điểm mong muốn</h3>
                  <CustomTagInput
                    presets={LOCATION_OPTIONS}
                    selected={locations}
                    onChange={setLocations}
                    multi
                    placeholder="Thêm địa điểm khác..."
                  />
                </div>
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
