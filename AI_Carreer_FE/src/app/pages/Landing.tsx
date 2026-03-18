import { Link } from "react-router";
import { Sparkles, Brain, TrendingUp, School, Map, MessageSquare, Target, Award, DollarSign } from "lucide-react";
import { motion } from "motion/react";

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-6">
                <span className="text-blue-700 text-sm">Định hướng nghề nghiệp bằng AI</span>
              </div>
              <h1 className="text-5xl mb-6 text-blue-700">
                Tìm trường & ngành học phù hợp với bạn
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Khám phá con đường sự nghiệp lý tưởng với bài đánh giá AI, gợi ý cá nhân hóa
                và ghép trường thông minh dựa trên tính cách, sở thích và mục tiêu của bạn.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all"
                >
                  <Sparkles className="size-5" />
                  <span>Bắt đầu đánh giá miễn phí</span>
                </Link>
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
                    <div className="text-sm text-gray-600">Tỷ lệ ghép thành công</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Cách hoạt động</h2>
            <p className="text-xl text-gray-600">
              Ba bước đơn giản để khám phá con đường sự nghiệp lý tưởng
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
              <h3 className="text-2xl mb-4">1. Hoàn thành bài đánh giá</h3>
              <p className="text-gray-600">
                Làm bài kiểm tra tính cách, sở thích và năng lực toàn diện để hiểu rõ điểm mạnh và sở thích của bạn.
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
                AI phân tích kết quả và ghép bạn với ngành học, trường đại học phù hợp nhất với hồ sơ của bạn.
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
              <h3 className="text-2xl mb-4">3. Theo lộ trình của bạn</h3>
              <p className="text-gray-600">
                Nhận kế hoạch hành động cá nhân hóa với mốc thời gian để đạt được trường mục tiêu.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">Hướng dẫn nghề nghiệp toàn diện</h2>
            <p className="text-xl text-gray-600">
              Tất cả những gì bạn cần để đưa ra quyết định đúng đắn
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: "Kiểm tra tính cách", desc: "Hiểu rõ điểm mạnh của bạn", color: "blue" },
              { icon: School, title: "Ghép trường đại học", desc: "Tìm trường phù hợp nhất", color: "orange" },
              { icon: DollarSign, title: "Lập kế hoạch tài chính", desc: "Lên ngân sách học phí", color: "blue" },
              { icon: MessageSquare, title: "Tư vấn AI", desc: "Giải đáp ngay lập tức", color: "orange" },
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

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl text-white mb-6">Sẵn sàng tìm con đường của bạn?</h2>
          <p className="text-xl text-white/90 mb-8">
            Cùng hàng nghìn học sinh đã tìm được ngành nghề phù hợp
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-400 text-white rounded-xl hover:bg-orange-500 hover:shadow-2xl transition-all"
          >
            <Sparkles className="size-5" />
            <span>Bắt đầu hành trình ngay hôm nay</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
