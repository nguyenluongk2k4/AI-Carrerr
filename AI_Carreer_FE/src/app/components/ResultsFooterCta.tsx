import { useState } from "react";
import { Link } from "react-router";

export function ResultsDetailModalTrigger({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  const handleViewDetail = () => {
    if (isLoggedIn) return;
    setOpen(true);
  };

  return (
    <div className="mt-10 text-center">
      <button
        onClick={handleViewDetail}
        className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-orange-500 text-white font-semibold"
      >
        Xem chi tiết kết quả của bạn
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-slate-700">Xem kết quả bài Test</div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <div className="text-sm text-slate-600 mb-4">
              Vui lòng <span className="text-orange-500 font-semibold">đăng nhập tại đây</span> để lưu kết quả và chia sẻ kết quả bài Test
            </div>
            <div className="text-center text-xs text-slate-400 mb-4">Hoặc điền thông tin bên dưới để nhận kết quả qua email</div>
            <div className="space-y-3">
              <input className="w-full border rounded-full px-4 py-2" placeholder="Họ và tên bạn" />
              <input className="w-full border rounded-full px-4 py-2" placeholder="Email của bạn" />
              <input className="w-full border rounded-full px-4 py-2" placeholder="Số điện thoại của bạn" />
            </div>
            <div className="mt-5 flex justify-center">
              <button className="px-10 py-2 rounded-full bg-orange-500 text-white font-semibold">GỬI</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ResultsFooterCta() {
  return (
    <div className="mt-12">
      <div className="text-center">
        <div className="text-orange-500 font-semibold text-lg">THAM GIA QUY TRÌNH HƯỚNG NGHIỆP TOÀN DIỆN ĐỂ ĐƯỢC:</div>
        <div className="text-orange-500 italic text-2xl">Khám phá bản thân cho riêng bạn</div>
        <div className="mt-4 text-slate-800 font-semibold">Còn chần chừ gì nữa</div>
        <div className="text-slate-800 font-semibold">Hãy tham gia quy trình để được:</div>
      </div>

      <div className="mt-8 grid md:grid-cols-4 gap-6 items-start">
        <div className="text-center">
          <div className="mx-auto h-36 w-36 rounded-full overflow-hidden bg-slate-100 border">
            <img src="/test-disc.jpg" alt="Tư vấn" className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 text-orange-600 font-semibold">Tư vấn Hướng nghiệp Toàn diện</div>
          <button className="mt-3 px-5 py-2 rounded-full border border-orange-400 text-orange-500">
            Đăng ký tư vấn
          </button>
        </div>

        <div className="text-center">
          <div className="mx-auto h-36 w-36 rounded-full overflow-hidden bg-slate-100 border">
            <img src="/test-intel.png" alt="Ngành nghề" className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 text-orange-600 font-semibold">Gợi ý Ngành nghề Phù hợp nhất</div>
        </div>

        <div className="text-center">
          <div className="mx-auto h-36 w-36 rounded-full overflow-hidden bg-slate-100 border">
            <img src="/test-hollend.png" alt="Trường học" className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 text-orange-600 font-semibold">Tư vấn Trường học Phù hợp nhất</div>
        </div>

        <div className="text-center">
          <div className="mx-auto h-36 w-36 rounded-full overflow-hidden bg-slate-100 border">
            <img src="/test-mbti.jpg" alt="Tham gia" className="h-full w-full object-cover" />
          </div>
          <button className="mt-4 px-6 py-2 rounded-full bg-orange-500 text-white font-semibold">Tham gia ngay</button>
        </div>
      </div>

      <div className="mt-12">
        <div className="text-center text-orange-500 font-semibold mb-6">BÀI TEST HƯỚNG NGHIỆP KHÁC</div>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/intel-test" className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <img src="/test-intel.png" alt="Đa trí thông minh" className="w-full rounded-lg" />
            <div className="mt-3 text-orange-500 font-semibold">Kiểm tra Đa trí thông minh</div>
            <div className="text-slate-600 text-sm">Khám phá bản thân. Bạn sở hữu trí thông minh nào?</div>
          </Link>
          <Link to="/holland-test" className="border rounded-xl p-5 shadow-sm hover:shadow-md transition">
            <img src="/test-hollend.png" alt="Holland" className="w-full rounded-lg" />
            <div className="mt-3 text-orange-500 font-semibold">Kiểm tra Mật mã Holland</div>
            <div className="text-slate-600 text-sm">Gợi ý nhóm nghề phù hợp theo RIASEC.</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
