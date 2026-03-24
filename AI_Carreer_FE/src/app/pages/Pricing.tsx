import { ResultsFooterCta } from "../components/ResultsFooterCta";

const plans = [
  {
    title: "6 tháng",
    monthly: "200.000đ/tháng",
    original: "1,200,000đ",
    price: "790,000đ",
    note: "Phí một lần cho 6 tháng sử dụng không giới hạn. Sẽ không tự động gia hạn",
  },
  {
    title: "1 năm",
    monthly: "200.000đ/tháng",
    original: "2,400,000đ",
    price: "1,190,000đ",
    note: "Phí một lần cho 1 năm sử dụng không giới hạn. Sẽ không tự động gia hạn",
  },
  {
    title: "2 năm",
    monthly: "200.000đ/tháng",
    original: "4,800,000đ",
    price: "1,890,000đ",
    note: "Phí một lần cho 2 năm sử dụng không giới hạn. Sẽ không tự động gia hạn",
  },
];

export function Pricing() {
  return (
    <section className="bg-white min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            GÓI CƯỚC <span className="text-orange-500">SỬ DỤNG</span>
          </h1>
          <p className="mt-3 text-orange-500 text-sm">
            Để tham gia quy trình Hướng nghiệp toàn diện, bạn có thể tham khảo các gói tài trợ dưới đây!
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-transform duration-200 hover:scale-[1.1]"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url(/pricing-bg.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="relative z-10 px-6 py-10 min-h-[360px] text-center text-white flex flex-col">
                <div className="text-sm opacity-90">{plan.title}</div>
                <div className="mt-1 text-xs opacity-90">{plan.monthly}</div>
                <div className="mt-2 text-sm line-through opacity-80">{plan.original}</div>
                <div className="mt-3 text-3xl font-bold">{plan.price}</div>
                <button className="mt-5 w-full rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900">
                  MUA NGAY
                </button>
                <p className="mt-4 text-[11px] leading-relaxed opacity-90">{plan.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-300 text-sm text-center">
              <thead className="bg-[#1f3b5b] text-white">
                <tr>
                  <th className="p-3 border border-slate-300">Giá gói cước/user (đơn vị đồng)</th>
                  <th className="p-3 border border-slate-300">
                    <div className="text-xs uppercase">Chưa đăng nhập</div>
                    <div className="mt-2 inline-flex items-center justify-center rounded-sm bg-white px-3 py-1 text-sm font-bold text-slate-900">
                      0
                    </div>
                  </th>
                  <th className="p-3 border border-slate-300">
                    <div className="text-xs uppercase">Gói 6 tháng</div>
                    <div className="mt-2 inline-flex items-center justify-center rounded-sm bg-white px-3 py-1 text-sm font-bold text-slate-900">
                      790.000
                    </div>
                  </th>
                  <th className="p-3 border border-slate-300">
                    <div className="text-xs uppercase">Gói 1 năm</div>
                    <div className="mt-2 inline-flex items-center justify-center rounded-sm bg-white px-3 py-1 text-sm font-bold text-slate-900">
                      1.190.000
                    </div>
                  </th>
                  <th className="p-3 border border-slate-300">
                    <div className="text-xs uppercase">Gói 2 năm</div>
                    <div className="mt-2 inline-flex items-center justify-center rounded-sm bg-white px-3 py-1 text-sm font-bold text-slate-900">
                      1.890.000
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {[
                  { label: "Bài Test hướng nghiệp toàn diện", values: ["✔", "✔", "✔", "✔"] },
                  { label: "Kết quả bài test", values: ["✔", "✔", "✔", "✔"] },
                  { label: "Thông tin các đơn vị đào tạo", values: ["✘", "✔", "✔", "✔"] },
                  { label: "Kết quả trường đại học phù hợp", values: ["✘", "✔", "✔", "✔"] },
                  { label: "Lộ trình học cá nhân hóa", values: ["✘", "✔", "✔", "✔"] },
                  { label: "Theo dõi tiến độ", values: ["✘", "✔", "✔", "✔"] },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="p-3 border border-slate-300 text-left">{row.label}</td>
                    {row.values.map((val, idx) => (
                      <td key={idx} className="p-3 border border-slate-300">
                        <span
                          className={`text-lg font-bold ${val === "✔" ? "text-green-600" : "text-red-500"}`}
                        >
                          {val}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-3 border border-slate-300 text-left text-red-500 font-semibold">Lưu ý</td>
                  <td className="p-3 border border-slate-300 text-red-500">Gói cần đăng nhập</td>
                  <td className="p-3 border border-slate-300 text-red-500">Gói tài trợ tham gia hướng nghiệp toàn diện</td>
                  <td className="p-3 border border-slate-300 text-red-500">Gói tài trợ tham gia hướng nghiệp toàn diện</td>
                  <td className="p-3 border border-slate-300 text-red-500">Gói tài trợ tham gia hướng nghiệp toàn diện</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        
      </div>
    </section>
  );
}
