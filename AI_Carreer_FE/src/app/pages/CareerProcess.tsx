import { ResultsFooterCta } from "../components/ResultsFooterCta";

export function CareerProcess() {
  return (
    <section className="bg-white min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            QUY TRÌNH <span className="text-orange-500">HƯỚNG NGHIỆP</span>
          </h1>
          <p className="mt-4 text-slate-700 leading-relaxed">
            Quy trình Hướng nghiệp Hành Trang Số gồm 5 bước, giúp học viên có{" "}
            <span className="font-semibold">ĐẦY ĐỦ</span> dữ liệu và định hướng rõ ràng để tự tin
            đưa ra quyết định lựa chọn ngành nghề và trường đào tạo phù hợp với năng lực, sở thích
            của bản thân.
          </p>
          <p className="mt-4 text-slate-700 leading-relaxed">
            Thông qua hệ thống bài test, phân tích dữ liệu và các gợi ý chuyên sâu, học viên không
            chỉ hiểu rõ chính mình mà còn được trang bị những kiến thức, kỹ năng và định hướng phát
            triển cần thiết, từ đó hình thành tư duy chủ động, trưởng thành và có trách nhiệm với
            tương lai của bản thân, gia đình và xã hội.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-800 px-6 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Đăng nhập để tham gia
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 items-start">
          <div className="flex justify-center">
            <img
              src="/process-students.png"
              alt="Học viên tham gia hướng nghiệp"
              className="w-full max-w-[520px] object-contain"
            />
          </div>
          <div className="flex justify-center">
            <img
              src="/process-flow.png"
              alt="Sơ đồ quy trình hệ thống Hành Trang Số"
              className="w-full max-w-[520px] object-contain"
            />
          </div>
        </div>

        <div className="mt-12">
          <ResultsFooterCta />
        </div>
      </div>
    </section>
  );
}
