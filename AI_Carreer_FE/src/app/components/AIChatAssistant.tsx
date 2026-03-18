import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  ALL_QUESTIONS,
  SUBJECTS,
  HABIT_OPTIONS,
  SALARY_OPTIONS,
  FAMILY_OPTIONS,
  LOCATION_OPTIONS,
  getComboScores,
} from "../data/assessment";

// ─── Preset sample answers ────────────────────────────────────────────────────

type Preset = {
  label: string;
  emoji: string;
  description: string;
  data: CollectedData;
};

// forward-declare CollectedData so presets can reference it
type CollectedData = {
  answers: Record<number, string>;
  scoresSemester1: Record<string, string>;
  scoresSemester2: Record<string, string>;
  selectedCombo: string;
  habits: string[];
  salary: string;
  familyCondition: string;
  locations: string[];
};

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = {
  text: string;
  sender: "user" | "ai";
  chips?: string[];
  multi?: boolean;
};
// quiz_1..9 → scores_intro → scores_collect → combo → habits → salary → family → location → done

type Stage =
  | { type: "quiz"; questionId: number }
  | { type: "scores_intro" }
  | { type: "scores_collect"; subjectIndex: number; semester: 1 | 2 }
  | { type: "combo" }
  | { type: "habits" }
  | { type: "salary" }
  | { type: "family" }
  | { type: "location" }
  | { type: "done" };

const QUIZ_IDS = ALL_QUESTIONS.map((q) => q.id); // [1..9]

function nextStage(current: Stage, data: CollectedData): Stage {
  if (current.type === "quiz") {
    const idx = QUIZ_IDS.indexOf(current.questionId);
    if (idx < QUIZ_IDS.length - 1) return { type: "quiz", questionId: QUIZ_IDS[idx + 1] };
    return { type: "scores_intro" };
  }
  if (current.type === "scores_intro") {
    return { type: "scores_collect", subjectIndex: 0, semester: 1 };
  }
  if (current.type === "scores_collect") {
    const { subjectIndex, semester } = current;
    if (semester === 1) return { type: "scores_collect", subjectIndex, semester: 2 };
    if (subjectIndex < SUBJECTS.length - 1)
      return { type: "scores_collect", subjectIndex: subjectIndex + 1, semester: 1 };
    return { type: "combo" };
  }
  if (current.type === "combo") return { type: "habits" };
  if (current.type === "habits") return { type: "salary" };
  if (current.type === "salary") return { type: "family" };
  if (current.type === "family") return { type: "location" };
  if (current.type === "location") return { type: "done" };
  return { type: "done" };
}

function botMessageForStage(stage: Stage, data: CollectedData): Message {
  if (stage.type === "quiz") {
    const q = ALL_QUESTIONS.find((item) => item.id === stage.questionId)!;
    return {
      text: q.question,
      sender: "ai",
      chips: q.options.map((o) => o.label),
    };
  }
  if (stage.type === "scores_intro") {
    return {
      text: "Gõ 'oke' để bắt đầu hỏi điểm nhé! 👇",
      sender: "ai",
    };
  }
  if (stage.type === "scores_collect") {
    const subject = SUBJECTS[stage.subjectIndex];
    return {
      text: `Điểm ${subject.label} — Học kỳ ${stage.semester}?`,
      sender: "ai",
    };
  }
  if (stage.type === "combo") {
    const scores: Record<string, number> = {};
    for (const s of SUBJECTS) {
      const v1 = parseFloat(data.scoresSemester1[s.key] || "0") || 0;
      const v2 = parseFloat(data.scoresSemester2[s.key] || "0") || 0;
      scores[s.key] = (v1 + v2) / 2;
    }
    const ranked = getComboScores(scores).slice(0, 4);
    const chips = ranked.map((c) => `${c.code} (${c.subjects.join(", ")})`);
    return {
      text: "Dựa trên điểm của bạn, đây là các tổ hợp môn phù hợp nhất 🎯 Bạn chọn tổ hợp nào?",
      sender: "ai",
      chips,
    };
  }
  if (stage.type === "habits") {
    return {
      text: "Bạn có thói quen học tập như thế nào? (có thể chọn nhiều hoặc tự nhập)",
      sender: "ai",
      chips: HABIT_OPTIONS,
      multi: true,
    };
  }
  if (stage.type === "salary") {
    return {
      text: "Mức lương bạn mong muốn sau khi ra trường là bao nhiêu?",
      sender: "ai",
      chips: SALARY_OPTIONS,
    };
  }
  if (stage.type === "family") {
    return {
      text: "Điều kiện kinh tế gia đình bạn như thế nào?",
      sender: "ai",
      chips: FAMILY_OPTIONS,
    };
  }
  if (stage.type === "location") {
    return {
      text: "Bạn muốn học ở khu vực nào? (có thể chọn nhiều)",
      sender: "ai",
      chips: LOCATION_OPTIONS,
      multi: true,
    };
  }
  return {
    text: "✅ Mình đã thu thập đủ thông tin rồi! Đang phân tích và chuyển sang kết quả cho bạn...",
    sender: "ai",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AIChatAssistant() {
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const [stage, setStage] = useState<Stage>({ type: "quiz", questionId: 1 });
  const [data, setData] = useState<CollectedData>({
    answers: {},
    scoresSemester1: Object.fromEntries(SUBJECTS.map((s) => [s.key, ""])),
    scoresSemester2: Object.fromEntries(SUBJECTS.map((s) => [s.key, ""])),
    selectedCombo: "",
    habits: [],
    salary: "",
    familyCondition: "",
    locations: [],
  });

  // pending multi-select buffer
  const [multiBuffer, setMultiBuffer] = useState<string[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Xin chào! 👋 Mình là trợ lý hướng nghiệp AI. Mình sẽ hỏi bạn một số câu để gợi ý ngành học và trường phù hợp nhất. Bắt đầu nhé?",
      sender: "ai",
      chips: ["Bắt đầu thôi! 🚀"],
    },
  ]);

  // started flag — first message is greeting, not a stage question
  const [started, setStarted] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pushMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const isMultiStage = (s: Stage) =>
    s.type === "habits" || s.type === "location";

  // ── Process a user answer and advance stage ──
  const processAnswer = (text: string, updatedData?: CollectedData) => {
    const d = updatedData ?? data;

    if (!started) {
      setStarted(true);
      const firstStage: Stage = { type: "quiz", questionId: 1 };
      setStage(firstStage);
      pushMessage(botMessageForStage(firstStage, d));
      return;
    }

    let newData = { ...d };

    // Apply answer to current stage
    if (stage.type === "quiz") {
      const q = ALL_QUESTIONS.find((item) => item.id === stage.questionId)!;
      // match chip label → key, or use text directly
      const matched = q.options.find(
        (o) => o.label === text || o.key === text.toUpperCase()
      );
      newData = {
        ...newData,
        answers: { ...newData.answers, [stage.questionId]: matched?.key ?? text },
      };
    } else if (stage.type === "scores_collect") {
      const subject = SUBJECTS[stage.subjectIndex];
      const val = text.replace(",", ".");
      if (stage.semester === 1) {
        newData = { ...newData, scoresSemester1: { ...newData.scoresSemester1, [subject.key]: val } };
      } else {
        newData = { ...newData, scoresSemester2: { ...newData.scoresSemester2, [subject.key]: val } };
      }
    } else if (stage.type === "combo") {
      // extract code from "A00 (Toán, Vật lý, Hóa học)" or plain "A00"
      const code = text.split(" ")[0];
      newData = { ...newData, selectedCombo: code };
    } else if (stage.type === "habits") {
      newData = { ...newData, habits: multiBuffer.length > 0 ? multiBuffer : [text] };
    } else if (stage.type === "salary") {
      newData = { ...newData, salary: text };
    } else if (stage.type === "family") {
      newData = { ...newData, familyCondition: text };
    } else if (stage.type === "location") {
      newData = { ...newData, locations: multiBuffer.length > 0 ? multiBuffer : [text] };
    }

    setData(newData);
    setMultiBuffer([]);

    const next = nextStage(stage, newData);
    setStage(next);

    if (next.type === "done") {
      pushMessage(botMessageForStage(next, newData));
      setTimeout(() => submitData(newData), 1200);
    } else {
      pushMessage(botMessageForStage(next, newData));
    }
  };

  const submitData = (d: CollectedData) => {
    const numericScores: Record<string, number> = {};
    for (const s of SUBJECTS) {
      const v1 = parseFloat(d.scoresSemester1[s.key] || "0") || 0;
      const v2 = parseFloat(d.scoresSemester2[s.key] || "0") || 0;
      numericScores[s.key] = parseFloat(((v1 + v2) / 2).toFixed(2));
    }

    const summary = [
      ...ALL_QUESTIONS.map((item) => {
        const selectedKey = d.answers[item.id];
        const selectedOption = item.options.find((o) => o.key === selectedKey);
        return {
          id: item.id,
          question: item.question,
          answerKey: selectedKey ?? "",
          answerLabel: selectedOption?.label ?? selectedKey ?? "",
        };
      }),
      { id: 100, question: "Tổng điểm 2 kỳ gần nhất (theo môn)", answerKey: "", answerLabel: SUBJECTS.map((s) => `${s.label} (HK1: ${d.scoresSemester1[s.key] || 0}, HK2: ${d.scoresSemester2[s.key] || 0})`).join(", ") },
      { id: 101, question: "Tổ hợp môn đã chọn", answerKey: "", answerLabel: d.selectedCombo },
      { id: 102, question: "Thói quen học tập", answerKey: "", answerLabel: d.habits.join(", ") },
      { id: 103, question: "Mức lương mong muốn", answerKey: "", answerLabel: d.salary },
      { id: 104, question: "Điều kiện gia đình", answerKey: "", answerLabel: d.familyCondition },
      { id: 105, question: "Địa điểm mong muốn", answerKey: "", answerLabel: d.locations.join(", ") },
    ];

    localStorage.setItem("assessmentData", JSON.stringify({
      answers: d.answers,
      scores: numericScores,
      semesterScores: { semester1: d.scoresSemester1, semester2: d.scoresSemester2 },
      selectedCombo: d.selectedCombo,
      habits: d.habits,
      salary: d.salary,
      familyCondition: d.familyCondition,
      locations: d.locations,
      summary,
    }));

    navigate("/results");
  };

  // ── Handle chip click ──
  const handleChip = (chip: string) => {
    const isMulti = isMultiStage(stage);
    if (isMulti) {
      // toggle in buffer
      setMultiBuffer((prev) =>
        prev.includes(chip) ? prev.filter((v) => v !== chip) : [...prev, chip]
      );
      return;
    }
    // single select → immediate answer
    pushMessage({ text: chip, sender: "user" });
    processAnswer(chip);
  };

  // ── Confirm multi-select ──
  const confirmMulti = () => {
    if (multiBuffer.length === 0) return;
    const label = multiBuffer.join(", ");
    pushMessage({ text: label, sender: "user" });
    processAnswer(label);
  };

  // ── Handle free text send ──
  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");

    if (isMultiStage(stage)) {
      // add to buffer
      setMultiBuffer((prev) =>
        prev.includes(trimmed) ? prev : [...prev, trimmed]
      );
      pushMessage({ text: trimmed, sender: "user" });
      return;
    }

    pushMessage({ text: trimmed, sender: "user" });
    processAnswer(trimmed);
  };

  // ── Apply preset (skip all questions, submit directly) ──
  const applyPreset = (preset: Preset) => {
    pushMessage({ text: `${preset.emoji} Dùng ${preset.label}`, sender: "user" });
    pushMessage({
      text: `Đã chọn bộ mẫu "${preset.label}" — ${preset.description}. Đang xử lý...`,
      sender: "ai",
    });
    setStarted(true);
    setStage({ type: "done" });
    setTimeout(() => submitData(preset.data), 800);
  };

  const lastMessage = messages[messages.length - 1];
  const showChips = lastMessage?.sender === "ai" && lastMessage.chips && stage.type !== "done";
  const isMulti = isMultiStage(stage);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all z-50 flex items-center justify-center"
          >
            <MessageSquare className="size-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-96 h-[620px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-blue-100"
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5" />
                  <div>
                    <h3 className="font-semibold text-sm">Cố vấn Hướng nghiệp AI</h3>
                    <p className="text-xs text-white/70">Thu thập thông tin để gợi ý ngành học</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg">
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-blue-50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white border border-blue-100 text-gray-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Chips for latest AI message */}
              {showChips && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 pl-1"
                >
                  {lastMessage.chips!.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChip(chip)}
                      className={`px-3 py-1.5 rounded-full text-xs border-2 transition-all ${
                        multiBuffer.includes(chip)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-blue-200 text-blue-700 hover:border-blue-400"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                  {isMulti && multiBuffer.length > 0 && (
                    <button
                      onClick={confirmMulti}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-600 transition-all"
                    >
                      Xác nhận <ChevronRight className="size-3" />
                    </button>
                  )}
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
              {isMulti && multiBuffer.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {multiBuffer.map((v) => (
                    <span key={v} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {v}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    stage.type === "scores_collect"
                      ? "Nhập điểm (0–10)..."
                      : isMulti
                      ? "Thêm tùy chỉnh..."
                      : "Nhập câu trả lời..."
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
