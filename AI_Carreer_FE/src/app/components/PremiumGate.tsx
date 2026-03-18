import { Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { usePremium } from "../utils/usePremium";

interface PremiumGateProps {
  title?: string;
  description?: string;
}

export function PremiumGate({
  title = "Tính năng dành cho Premium",
  description = "Bạn cần kích hoạt gói Premium để xem nội dung này.",
}: PremiumGateProps) {
  const navigate = useNavigate();
  const { activate } = usePremium();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm mb-4">
            <Lock className="size-4" />
            <span>Premium</span>
          </div>
          <h1 className="text-3xl mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                activate();
                navigate("/results");
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              Kích hoạt gói (demo)
            </button>
            <button
              onClick={() => navigate("/premium")}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              Mua gói Premium
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-orange-200 text-orange-600 hover:border-orange-300 transition-all"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
