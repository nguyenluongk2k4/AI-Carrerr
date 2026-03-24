import { Link } from "react-router";
import { Sparkles, Brain, TrendingUp, School, Map, MessageSquare, Target, Award, DollarSign, LogIn } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../utils/useAuth";

export function LandingNew() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl mb-6 text-blue-700">
                Hành Trang Số – Chọn đúng ngành, học đúng trường
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Hành Trang Số giúp bạn định hướng nghề nghiệp bằng dữ liệu và AI. 
                Nhận gợi ý cá nhân hóa về ngành học, trường phù hợp, học phí và lộ trình học tập rõ ràng.
              </p>
              <div className="flex gap-4">
                {user ? (
                  <Link
                    to="/assessment"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all"
                  >
                    <Sparkles className="size-5" />
                    <span>Bắt đầu cùng Hành Trang Số</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all"
                  >
                    <LogIn className="size-5" />
                    <span>Đăng nhập để trải nghiệm</span>
                  </Link>
                )}
                <Link
                  to="/results"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-blue-200 text-blue-600 rounded-xl hover:border-blue-300 transition-all"
                >
                  <span>Xem demo</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1553893304-448dd3e66fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHN0dWRlbnQlMjB1bml2ZXJzaXR5JTIwY2FtcHVzfGVufDF8fHx8MTc3MzQ4MzcxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Students on campus"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Award className="size-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">98%</div>
                    <div className="text-sm text-gray-600">Tỷ lệ ghép trường thành công</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Hành Trang Số hoạt động thế nào?</h2>
            <p className="text-xl text-gray-600">
              Ba bước đơn giản để có lộ trình học tập phù hợp nhất
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Brain className="size-8 text-blue-600" />
              </div>
              <h3 className="text-2xl mb-4">1. Khám phá bản thân</h3>
              <p className="text-gray-600">
                Làm bài đánh giá tính cách, sở thích và năng lực để hiểu rõ điểm mạnh của bạn.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="size-8 text-orange-600" />
              </div>
              <h3 className="text-2xl mb-4">2. Nhận gợi ý từ AI</h3>
              <p className="text-gray-600">
                AI của Hành Trang Số phân tích dữ liệu và gợi ý ngành/trường phù hợp nhất.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Map className="size-8 text-blue-600" />
              </div>
              <h3 className="text-2xl mb-4">3. Theo lộ trình cá nhân</h3>
              <p className="text-gray-600">
                Nhận kế hoạch học tập – tài chính – thi cử rõ ràng cho mục tiêu của bạn.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Hành Trang Số hỗ trợ toàn diện</h2>
            <p className="text-xl text-gray-600">
              Những gì bạn cần để ra quyết định đúng đắn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: "Đánh giá tính cách", desc: "Hiểu rõ điểm mạnh bản thân", color: "blue" },
              { icon: School, title: "Gợi ý trường phù hợp", desc: "Chọn trường theo năng lực & mục tiêu", color: "orange" },
              { icon: DollarSign, title: "Kế hoạch tài chính", desc: "Dự trù học phí rõ ràng", color: "blue" },
              { icon: MessageSquare, title: "Tư vấn AI 24/7", desc: "Hỏi nhanh – đáp gọn", color: "orange" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white p-6 rounded-xl shadow-md border-2 border-${feature.color}-100`}
              >
                <feature.icon className={`size-10 text-${feature.color}-600 mb-4`} />
                <h4 className="text-lg mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-white mb-6">Hành Trang Số sẵn sàng đồng hành cùng bạn</h2>
          <p className="text-xl text-white/90 mb-8">
            Bắt đầu ngay để có lộ trình học tập và nghề nghiệp phù hợp nhất
          </p>
          {user ? (
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-400 text-white rounded-xl hover:bg-orange-500 hover:shadow-2xl transition-all"
            >
              <Sparkles className="size-5" />
              <span>Bắt đầu cùng Hành Trang Số</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-400 text-white rounded-xl hover:bg-orange-500 hover:shadow-2xl transition-all"
            >
              <LogIn className="size-5" />
              <span>Đăng nhập để bắt đầu</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
