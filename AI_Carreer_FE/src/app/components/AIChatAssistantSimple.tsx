import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../utils/useAuth";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

type Message = {
  sender: "user" | "ai";
  text: string;
  bullets?: string[];
};

export function AIChatAssistantSimple() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Chào bạn, mình là trợ lý tư vấn hướng nghiệp. Bạn cứ chia sẻ điều bạn đang băn khoăn nhé.",
      bullets: [
        "Bạn quan tâm ngành/trường nào (nếu có)",
        "Điểm mạnh/yếu và mức tài chính gia đình",
        "Mình sẽ gợi ý ngắn gọn, dễ hiểu",
      ],
    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const pushMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");
    pushMessage({ sender: "user", text: trimmed });
    setLoading(true);

    const history = messages.slice(-6).map((m) => ({
      role: m.sender,
      content: m.text,
    }));

    try {
      const response = await fetch(`${API_BASE}/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history, username: user?.username }),
      });
      if (!response.ok) throw new Error("failed");
      const data = (await response.json()) as { bullets?: string[]; answer?: string };
      const bullets =
        data.bullets && data.bullets.length > 0
          ? data.bullets
          : (data.answer || "").split("\n").map((l) => l.replace(/^-\\s*/, "").trim()).filter(Boolean);
      pushMessage({
        sender: "ai",
        text: (data.answer ?? "").trim(),
        bullets,
      });
    } catch {
      pushMessage({
        sender: "ai",
        text: "Xin lỗi, mình chưa trả lời được lúc này.",
        bullets: ["Bạn thử hỏi lại sau vài giây nhé."],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 bg-white rounded-2xl rounded-br-none shadow-xl border border-blue-100 px-4 py-3 max-w-[220px] cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <p className="text-sm font-medium text-blue-700">Tư vấn tuyển sinh miễn phí!</p>
              <p className="text-xs text-gray-500 mt-0.5">Chat ngay để được hỗ trợ</p>
              <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-white" />
            </motion.div>

            <button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 bg-white rounded-full shadow-2xl hover:shadow-blue-200 border-2 border-blue-100 hover:border-blue-300 transition-all flex items-center justify-center overflow-hidden"
            >
              <img src="/logo.png" alt="HATASO" className="w-12 h-12 object-contain" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-96 h-[620px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-blue-100"
          >
            <div className="bg-blue-600 p-4 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="/logo.png" alt="HATASO" className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">HATASO</h3>
                    <p className="text-xs text-white/70">Tư vấn hướng nghiệp nhanh gọn</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg">
                  <X className="size-5" />
                </button>
              </div>
            </div>

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
                    {msg.bullets && msg.bullets.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {msg.bullets.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="text-xs text-slate-500">Đang trả lời...</div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
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
