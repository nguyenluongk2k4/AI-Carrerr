import { CheckCircle2, Crown, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { usePremium } from "../utils/usePremium";

const premiumFeatures = [
  "Kết quả ngành phù hợp đầy đủ và có giải thích chi tiết",
  "Danh sách trường phù hợp kèm điểm chuẩn và học phí",
  "Dự đoán khả năng trúng tuyển theo ngành",
  "Lộ trình hành động 6–12–24 tháng",
  "AI Advisor tư vấn theo dữ liệu cá nhân",
];

export function Premium() {
  const navigate = useNavigate();
  const { activate } = usePremium();

  const handleActivate = () => {
    activate();
    navigate("/results");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
            <Crown className="size-4" />
            <span>Nâng cấp Premium</span>
          </div>
          <h1 className="text-4xl mt-4">Mở khóa kết quả đầy đủ</h1>
          <p className="text-xl text-gray-600 mt-2">
            Xem phân tích chi tiết và lộ trình hành động cá nhân hóa.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Sparkles className="size-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl">Gói Premium</h2>
              <p className="text-gray-600 text-sm">Bản demo: kích hoạt ngay</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {premiumFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-3 text-gray-700">
                <CheckCircle2 className="size-5 text-orange-600 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleActivate}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              <Crown className="size-5" />
              Kích hoạt gói (demo)
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-orange-200 text-orange-600 hover:border-orange-300 transition-all"
            >
              Quay lại trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
