import { ResultsFooterCta } from "../components/ResultsFooterCta";

export function UsageGuide() {
  return (
    <section className="bg-white min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            HƯỚNG DẪN <span className="text-orange-500">SỬ DỤNG</span>
          </h1>
        </div>

        <div className="mt-10 flex justify-center">
          <img
            src="/guide-usage.jpg"
            alt="Hướng dẫn sử dụng Hành Trang Số"
            className="w-full max-w-4xl rounded-lg border border-slate-200 shadow-sm"
          />
        </div>

        
      </div>
    </section>
  );
}
