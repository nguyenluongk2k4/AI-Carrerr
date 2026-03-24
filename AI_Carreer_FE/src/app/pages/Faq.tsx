import { Plus } from "lucide-react";

const faqs = [
  "Lĩnh vực hoạt động Hành Trang Số?",
  "Làm thế nào để sử dụng Quy trình Hướng nghiệp Hành Trang Số hiệu quả nhất?",
  "Sau khi làm test xong, tôi không vào được quy trình Hành Trang Số?",
  "Tại sao tôi không xem được các nhóm ngành nghề?",
  "Nếu là người dùng Hành Trang Số thì sẽ có những quyền lợi gì?",
  "Tôi gặp khó khăn và muốn biết cụ thể hơn về chương trình thì liên hệ ở đâu?",
];

export function Faq() {
  return (
    <section className="bg-white min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
          <div className="bg-white rounded-md shadow-sm border border-slate-200 p-8">
            <h1 className="text-3xl font-bold text-orange-500 leading-tight">
              CÂU HỎI
              <br />
              THƯỜNG GẶP
            </h1>
            <p className="mt-4 text-xs text-orange-600">
              Hành Trang Số là hệ thống hướng nghiệp online. Để thuận tiện cho việc sử dụng, người
              dùng thường quan tâm các câu hỏi như sau:
            </p>

            <div className="mt-6 space-y-3 text-sm text-orange-600">
              {faqs.map((item) => (
                <div key={item} className="flex items-center justify-between border-b border-orange-200 pb-2">
                  <span>{item}</span>
                  <Plus className="size-4" />
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-orange-500">Bạn vẫn còn thắc mắc? Gửi câu hỏi cho chúng tôi</p>
              <button
                type="button"
                className="mt-3 inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-2 text-sm font-semibold text-white"
              >
                Gửi câu hỏi
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img
              src="/faq-mark.png"
              alt="Câu hỏi thường gặp"
              className="w-full max-w-[400px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
