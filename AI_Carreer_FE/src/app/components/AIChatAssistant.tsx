import { useState } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const sampleQuestions = [
  "Sự khác biệt giữa Khoa học Máy tính và Kỹ thuật Phần mềm là gì?",
  "Làm thế nào để cải thiện điểm thi đại học?",
  "Có những học bổng nào dành cho ngành CNTT?",
  "Cho tôi biết về yêu cầu tuyển sinh của ĐHBK Hà Nội",
];

const mockResponses: Record<string, string> = {
  default: "Tôi là cố vấn nghề nghiệp AI của bạn! Tôi có thể giúp bạn với các câu hỏi về ngành học, trường đại học, yêu cầu tuyển sinh, luyện thi và lập kế hoạch sự nghiệp. Bạn muốn biết gì?",
  cs: "Khoa học Máy tính tập trung vào nền tảng lý thuyết của tính toán, thuật toán và toán học, trong khi Kỹ thuật Phần mềm nhấn mạnh phát triển phần mềm thực tế, quản lý dự án và thực hành công nghiệp. Cả hai đều là lựa chọn tuyệt vời cho sự nghiệp công nghệ!",
  sat: "Để cải thiện điểm thi: 1) Làm đề thi thử thường xuyên, 2) Tập trung vào điểm yếu, 3) Học chiến thuật làm bài, 4) Học 1-2 tiếng mỗi ngày, và 5) Tham gia nhóm học hoặc tìm gia sư.",
  scholarship: "Có rất nhiều học bổng ngành CNTT! Hãy tìm hiểu: học bổng Google, Microsoft, học bổng của các trường đại học, và chương trình hỗ trợ từ các công ty công nghệ trong nước. Nộp hồ sơ sớm nhé!",
  mit: "Các trường top thường yêu cầu: điểm thi cao, chương trình học STEM mạnh, kinh nghiệm nghiên cứu/dự án, hoạt động ngoại khóa và bài luận thuyết phục. Hãy xây dựng hồ sơ toàn diện từ sớm.",
};

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "ai" }>>([
    { text: "Xin chào! Tôi là Cố vấn Nghề nghiệp AI. Tôi có thể giúp gì cho bạn hôm nay?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);

    // Simple keyword-based responses
    let response = mockResponses.default;
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("computer science") || lowerInput.includes("software engineering")) {
      response = mockResponses.cs;
    } else if (lowerInput.includes("sat") || lowerInput.includes("score")) {
      response = mockResponses.sat;
    } else if (lowerInput.includes("scholarship")) {
      response = mockResponses.scholarship;
    } else if (lowerInput.includes("mit")) {
      response = mockResponses.mit;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: response, sender: "ai" }]);
    }, 500);

    setInput("");
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Floating Button */}
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

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-blue-100"
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-6" />
                  <div>
                    <h3 className="font-semibold">Cố vấn Nghề nghiệp AI</h3>
                    <p className="text-xs text-white/80">Trực tuyến</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-50">
              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white border border-blue-100 text-gray-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 border-t border-gray-100">
                <p className="text-xs text-gray-600 mb-2">Câu hỏi gợi ý:</p>
                <div className="space-y-1">
                  {sampleQuestions.slice(0, 2).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(q)}
                      className="w-full text-left text-xs p-2 bg-orange-50 hover:bg-orange-100 rounded-lg transition-all text-orange-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Hỏi tôi bất cứ điều gì..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSend}
                  className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:shadow-lg transition-all"
                >
                  <Send className="size-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
