import { Link } from "react-router";
import { Award } from "lucide-react";

const introSteps = [
  "Quy trình giúp can thiệp sớm trong việc định hướng nghề nghiệp cho học sinh",
  "Quy trình cá nhân hóa cao đến từng người dùng",
  "Luôn theo sát và hỗ trợ liên tục tới người dùng",
  "Cung cấp đầy đủ thông tin chính thống, trọng tâm hỗ trợ việc chọn ngành nghề và chọn trường",
  "Tư vấn hỗ trợ Hướng nghiệp Toàn diện",
];

const guideCards = [
  {
    title: "Giới Thiệu",
    desc:
      "Hệ thống Online giúp học sinh có thể lựa chọn chính xác nghề nghiệp phù hợp với bản thân trong tương lai.",
  },
  {
    title: "Quy Trình Hướng Nghiệp",
    desc:
      "Hệ thống Nova Eguide được xây dựng theo một vòng tròn logic. Tham gia làm bài Test sẽ trả về kết quả phù hợp.",
  },
  {
    title: "Sự Khác Biệt Tạo Nên Điều Đặc Biệt",
    desc:
      "Hệ thống hướng nghiệp Nova Eguide triển khai đồng hành cùng Bộ GD&ĐT trên toàn quốc.",
  },
];

const systemCards = [
  {
    title: "Hệ Thống Test",
    desc:
      "Bao gồm 2 hệ thống test gợi ý nghề nghiệp và Hệ thống Test năng lực với hơn 1000 bài test ở 10 lĩnh vực khác.",
    cta: "Test ngay",
  },
  {
    title: "Nhóm ngành nghề",
    desc: "65 nhóm ngành nghề với gần 300 tài liệu mô tả cụ thể theo quy chuẩn hóa.",
    cta: "Tìm hiểu",
  },
  {
    title: "Hệ thống Đơn vị đào tạo",
    desc: "Thông tin chính thống từ các đơn vị đào tạo Đại học, Cao đẳng theo quy chuẩn của Bộ GD&ĐT.",
    cta: "Tìm hiểu",
  },
  {
    title: "Hệ thống Khóa học kĩ năng",
    desc:
      "Tổng hợp những khóa học rèn luyện tư duy, kỹ năng, định hướng để khơi dậy niềm tin và ước mơ.",
    cta: "Tham gia",
  },
  {
    title: "Danh mục gương sáng Người nổi tiếng",
    desc: "Tổng hợp những câu chuyện về tấm gương vượt khó và người nổi tiếng trong nước và thế giới.",
    cta: "Tìm hiểu",
  },
  {
    title: "Hệ thống thông tin Doanh nghiệp",
    desc: "Thông tin cơ bản về doanh nghiệp, trải nghiệm mô hình doanh nghiệp ở mức cơ bản nhất.",
    cta: "Tìm hiểu",
  },
  {
    title: "Xu hướng Ngành nghề",
    desc: "Tổng hợp thông tin về xu hướng ngành nghề trong tương lai.",
    cta: "Tìm hiểu",
  },
  {
    title: "Bảng lộ trình Phát triển",
    desc:
      "Học viên tự xây lộ trình phát triển theo khung quy chuẩn Nova Eguide và theo dõi kế hoạch hành động.",
    cta: "Tìm hiểu",
  },
];

const journeyImages = [
  "/landing-journey-1.jpg",
  "/landing-journey-2.jpg",
  "/landing-journey-3.jpg",
  "/landing-journey-4.jpg",
];

const fullProcessCards = [
  {
    title: "Quy trình hướng nghiệp",
    desc:
      "Quy trình Hướng nghiệp Hành Trang Số gồm 8 bước, giúp học viên có đầy đủ thông tin để tự tin lựa chọn ngành nghề và trường phù hợp.",
    cta: "Test để tham gia",
    image: "/anh5.png",
  },
  {
    title: "Khám phá bản thân",
    desc:
      "Khám phá bản thân qua hệ thống bài Test siêu việt. Chia sẻ đến bạn bè và nhiều điều thú vị đang chờ.",
    cta: "Khám phá",
    image: "/footer2.jpg",
  },
  {
    title: "Nâng cao năng lực",
    desc:
      "Hệ thống tài liệu và khóa học hỗ trợ bạn. Một câu nói cũng có thể thay đổi cuộc đời.",
    cta: "Khám phá",
    image: "/footer3.jpg",
  },
];

export function LandingNew() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 leading-tight">
                Hành Trang Số – Chọn ngành, chọn trường, định hướng tương lai
              </h1>
              <p className="mt-5 text-lg text-slate-600">
                Hành Trang Số giúp bạn định hướng nghề nghiệp bằng dữ liệu và AI. Nhận gợi ý cá nhân
                hóa về ngành học, trường phù hợp, học phí và lộ trình học tập rõ ràng.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-xl transition-all"
                >
                  Bắt đầu cùng Hành Trang Số
                </Link>
                <Link
                  to="/results"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-white border-2 border-blue-200 text-blue-600 rounded-xl hover:border-blue-300 transition-all"
                >
                  Xem demo
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1553893304-448dd3e66fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHN0dWRlbnQlMjB1bml2ZXJzaXR5JTIwY2FtcHVzfGVufDF8fHx8MTc3MzQ4MzcxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Hành Trang Số"
                className="rounded-2xl shadow-2xl w-full max-w-[560px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Award className="size-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">98%</div>
                    <div className="text-sm text-slate-600">Tỷ lệ ghép trường thành công</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 items-center">
            
            <div className="flex justify-center">
              <img
                src="/landing-intro2.png"
                alt="Giới thiệu Hành Trang Số"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div id="introduce">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row introduce text-center grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="col-sm-4">
                <div className="col text-center flex flex-col h-full">
                  {/* Line and Diamond Icon */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex-1 h-[2px] bg-slate-300"></div>
                    <div className="ronate relative w-16 h-16 flex items-center justify-center mx-4 flex-shrink-0">
                      <div className="absolute w-12 h-12 border-2 border-slate-400 transform rotate-45"></div>
                      <img alt="Giới Thiệu" src="/introduce-icon-1.png" className="h-6 object-contain relative z-10" />
                    </div>
                    <div className="flex-1 h-[2px] bg-slate-300"></div>
                  </div>
                  <h4 className="text-base font-semibold text-orange-500 h-12 flex items-center justify-center">Giới Thiệu</h4>
                  <p className="mt-4 text-sm text-slate-600 flex-grow">
                    Hành Trang Số là nền tảng hướng nghiệp số giúp học sinh lựa chọn ngành nghề phù hợp dựa trên hệ thống bài test và phân tích dữ liệu. Thông qua đó, học sinh hiểu rõ năng lực, sở thích và định hướng phát triển, từ đó xây dựng kế hoạch học tập và nghề nghiệp phù hợp với bản thân.
                  </p>
                  <div className="text-center intro mt-6 h-10 flex items-center justify-center">
                    <a className="button inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-700 hover:text-white transition-all" href="gioi-thieu.html">
                      Tìm hiểu
                    </a>
                  </div>
                  <div className="bong text-center mt-6 flex justify-center h-12">
                    <img alt="" src="/bong.png" className="h-full object-contain" />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="col-sm-4">
                <div className="col text-center flex flex-col h-full">
                  {/* Line and Diamond Icon */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex-1 h-[2px] bg-slate-300"></div>
                    <div className="ronate relative w-16 h-16 flex items-center justify-center mx-4 flex-shrink-0">
                      <div className="absolute w-12 h-12 border-2 border-slate-400 transform rotate-45"></div>
                      <img alt="Quy Trình Hướng Nghiệp" src="/introduce-icon-2.png" className="h-6 object-contain relative z-10" />
                    </div>
                    <div className="flex-1 h-[2px] bg-slate-300"></div>
                  </div>
                  <h4 className="text-base font-semibold text-orange-500 h-12 flex items-center justify-center">Quy Trình Hướng Nghiệp</h4>
                  <p className="mt-4 text-sm text-slate-600 flex-grow">
                    Hành Trang Số được xây dựng theo quy trình 5 bước liên tục. Học sinh bắt đầu bằng bài test đánh giá năng lực và sở thích, sau đó hệ thống phân tích dữ liệu để đưa ra gợi ý ngành học, trường đào tạo và lộ trình phát triển phù hợp.
                  </p>
                  <div className="text-center intro mt-6 h-10 flex items-center justify-center">
                    <a className="button inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-700 hover:text-white transition-all" href="html/process.html">
                      Tìm hiểu
                    </a>
                  </div>
                  <div className="bong mt-6 flex justify-center h-12">
                    <img alt="" src="/bong.png" className="h-full object-contain" />
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="col-sm-4">
                <div className="col text-center flex flex-col h-full">
                  {/* Line and Diamond Icon */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex-1 h-[2px] bg-slate-300"></div>
                    <div className="ronate relative w-16 h-16 flex items-center justify-center mx-4 flex-shrink-0">
                      <div className="absolute w-12 h-12 border-2 border-slate-400 transform rotate-45"></div>
                      <img alt="Sự Khác Biệt" src="/introduce-icon-3.png" className="h-6 object-contain relative z-10" />
                    </div>
                    <div className="flex-1 h-[2px] bg-slate-300"></div>
                  </div>
                  <h4 className="text-base font-semibold text-orange-500 h-12 flex items-center justify-center">Sự Khác Biệt<br />Tạo Nên Giá Trị</h4>
                  <p className="mt-4 text-sm text-slate-600 flex-grow">
                    Hành Trang Số không chỉ dừng lại ở một bài test, mà là hệ thống hướng nghiệp liên tục, được cá nhân hóa cho từng học sinh. Nền tảng cung cấp thông tin đầy đủ, gợi ý rõ ràng và đồng hành cùng học sinh trong suốt quá trình định hướng và phát triển.
                  </p>
                  <div className="text-center intro mt-6 h-10 flex items-center justify-center">
                    <a className="button inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-700 hover:text-white transition-all" href="html/difference.html">
                      Tìm hiểu
                    </a>
                  </div>
                  <div className="bong mt-6 flex justify-center h-12">
                    <img alt="" src="/bong.png" className="h-full object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">QUY TRÌNH HƯỚNG NGHIỆP TOÀN DIỆN</h1>
            <div className="mt-2 h-[2px] w-40 mx-auto bg-orange-500" />
          </div>
          <p className="mt-4 text-sm text-slate-700 text-center max-w-4xl mx-auto">
            Hành Trang Số mang đến trải nghiệm hướng nghiệp toàn diện thông qua hệ thống bài test đánh giá năng lực, sở thích và dữ liệu ngành nghề, trường học. Dựa trên đó, nền tảng phân tích và gợi ý lộ trình phát triển cá nhân hóa, giúp học sinh hiểu rõ bản thân và tự tin lựa chọn ngành học, trường đào tạo phù hợp với định hướng tương lai.
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col h-full group">
              <div className="text-center">
                {/* Line and Diamond Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                  <div className="ronate relative w-16 h-16 flex items-center justify-center mx-4 flex-shrink-0">
                    <div className="absolute w-12 h-12 border-2 border-slate-400 group-hover:border-orange-500 transform rotate-45 transition-colors"></div>
                    <svg className="w-6 h-6 text-slate-700 group-hover:text-orange-500 transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                  </div>
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                </div>
                <h4 className="text-base font-semibold text-slate-700 group-hover:text-orange-500 transition-colors">Hệ thống bài test tính cách & sở thích</h4>
              </div>
              <p className="mt-4 text-sm text-slate-600 flex-grow">
                Đánh giá tính cách, sở thích và xu hướng cá nhân, giúp học sinh hiểu rõ bản thân và định hướng nghề nghiệp phù hợp.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col h-full group">
              <div className="text-center">
                {/* Line and Diamond Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                  <div className="ronate relative w-16 h-16 flex items-center justify-center mx-4 flex-shrink-0">
                    <div className="absolute w-12 h-12 border-2 border-slate-400 group-hover:border-orange-500 transform rotate-45 transition-colors"></div>
                    <svg className="w-6 h-6 text-slate-700 group-hover:text-orange-500 transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                  </div>
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                </div>
                <h4 className="text-base font-semibold text-slate-700 group-hover:text-orange-500 transition-colors">Hệ thống bài test năng lực & học tập</h4>
              </div>
              <p className="mt-4 text-sm text-slate-600 flex-grow">
                Phân tích năng lực học tập và thế mạnh cá nhân, từ đó xác định các lĩnh vực và ngành học phù hợp.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col h-full group">
              <div className="text-center">
                {/* Line and Diamond Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                  <div className="ronate relative w-16 h-16 flex items-center justify-center mx-4 flex-shrink-0">
                    <div className="absolute w-12 h-12 border-2 border-slate-400 group-hover:border-orange-500 transform rotate-45 transition-colors"></div>
                    <svg className="w-6 h-6 text-slate-700 group-hover:text-orange-500 transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                  </div>
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                </div>
                <h4 className="text-base font-semibold text-slate-700 group-hover:text-orange-500 transition-colors">Thông tin tài chính & kỳ vọng</h4>
              </div>
              <p className="mt-4 text-sm text-slate-600 flex-grow">
                Thu thập dữ liệu về điều kiện tài chính và mong muốn cá nhân, giúp đưa ra lựa chọn phù hợp với hoàn cảnh thực tế.
              </p>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col h-full group">
              <div className="text-center">
                {/* Line and Diamond Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                  <div className="ronate relative w-16 h-16 flex items-center justify-center mx-4 flex-shrink-0">
                    <div className="absolute w-12 h-12 border-2 border-slate-400 group-hover:border-orange-500 transform rotate-45 transition-colors"></div>
                    <svg className="w-6 h-6 text-slate-700 group-hover:text-orange-500 transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                </div>
                <h4 className="text-base font-semibold text-slate-700 group-hover:text-orange-500 transition-colors">Gợi ý ngành nghề</h4>
              </div>
              <p className="mt-4 text-sm text-slate-600 flex-grow">
                Dựa trên dữ liệu phân tích, hệ thống đề xuất các nhóm ngành phù hợp với năng lực, sở thích và xu hướng phát triển.
              </p>
            </div>

            {/* Card 5 */}
            <div className="flex flex-col h-full group">
              <div className="text-center">
                {/* Line and Diamond Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                  <div className="ronate relative w-16 h-16 flex items-center justify-center mx-4 flex-shrink-0">
                    <div className="absolute w-12 h-12 border-2 border-slate-400 group-hover:border-orange-500 transform rotate-45 transition-colors"></div>
                    <svg className="w-6 h-6 text-slate-700 group-hover:text-orange-500 transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                    </svg>
                  </div>
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                </div>
                <h4 className="text-base font-semibold text-slate-700 group-hover:text-orange-500 transition-colors">Gợi ý trường đào tạo</h4>
              </div>
              <p className="mt-4 text-sm text-slate-600 flex-grow">
                Cung cấp danh sách trường phù hợp theo ngành học, năng lực và điều kiện tài chính của từng học sinh.
              </p>
            </div>

            {/* Card 6 */}
            <div className="flex flex-col h-full group">
              <div className="text-center">
                {/* Line and Diamond Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                  <div className="ronate relative w-16 h-16 flex items-center justify-center mx-4 flex-shrink-0">
                    <div className="absolute w-12 h-12 border-2 border-slate-400 group-hover:border-orange-500 transform rotate-45 transition-colors"></div>
                    <svg className="w-6 h-6 text-slate-700 group-hover:text-orange-500 transition-colors relative z-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                    </svg>
                  </div>
                  <div className="flex-1 h-[2px] bg-slate-300 group-hover:bg-orange-500 transition-colors"></div>
                </div>
                <h4 className="text-base font-semibold text-slate-700 group-hover:text-orange-500 transition-colors">Lộ trình phát triển</h4>
              </div>
              <p className="mt-4 text-sm text-slate-600 flex-grow">
                Xây dựng lộ trình học tập và phát triển cá nhân rõ ràng, giúp học sinh chủ động định hướng tương lai.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800">QUY TRÌNH HƯỚNG NGHIỆP TOÀN DIỆN</h2>
            <div className="mt-2 h-[2px] w-40 mx-auto bg-orange-500" />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {fullProcessCards.map((card) => (
              <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-[180px] object-contain"
                />
                <h3 className="mt-4 text-orange-500 font-semibold text-sm uppercase">{card.title}</h3>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">{card.desc}</p>
                <div className="mt-4">
                  <Link
                    to="/assessment"
                    className="inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-700 hover:text-white"
                  >
                    {card.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
