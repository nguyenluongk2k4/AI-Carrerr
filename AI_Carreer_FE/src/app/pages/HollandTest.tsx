import { Link } from "react-router";

export function HollandTest() {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        {/* <div className="w-full mb-8">
          <img src="/test-hollend.png" alt="Bài test mật mã Holland" className="w-full rounded-lg" />
        </div> */}

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          LÀM BÀI <span className="text-orange-500">TEST MẬT MÃ HOLLAND</span> TRỰC TUYẾN
        </h1>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          <div>
            <div className="bg-[#7cc251] text-white text-center py-3 rounded-md mb-6">
              Lưu ý: Bạn chỉ được làm bài test này <span className="text-red-200">3 tháng 1 lần</span>
            </div>
            <div className="flex justify-center mb-6">
              <Link
                to="/test/holland"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md"
              >
                Bắt đầu
              </Link>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <img src="/test-hollend.png" alt="Mật mã Holland" className="w-full" />
            </div>
          </div>

          <div className="text-slate-700 leading-relaxed text-[15px]">
            <p className="mb-4">
              John L. Holland (1919 – 2008) là tiến sĩ tâm lý học người Mỹ. Tên tuổi Holland nổi tiếng được biết đến rộng
              rãi nhất qua nghiên cứu lý thuyết lựa chọn nghề nghiệp, gọi là Mã Holland (Holland codes). Mô hình này đã
              được sử dụng trong thực tiễn hướng nghiệp tại nhiều nước trên thế giới và được đánh giá cao.
            </p>
            <p className="mb-4">
              Theo John Holland, có 6 nhóm phù hợp với các ngành nghề khác nhau. Tạm dịch các nhóm đó là: (1) Realistic –
              nhóm Kỹ thuật, (2) Investigative – nhóm Nghiên cứu, (3) Artistic – nhóm Nghệ thuật, (4) Social – nhóm Xã
              hội, (5) Enterprising – nhóm Quản lí, (6) Conventional – nhóm Nghiệp vụ.
            </p>
            <p className="mb-4 font-semibold">Lưu ý:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Kết quả của bài test phụ thuộc rất nhiều vào tâm trạng của bạn. Nên thực hiện trong trạng thái tâm lý bình
                ổn nhất.
              </li>
              <li>
                Trả lời như chính con người thật của bạn, đừng chọn câu trả lời mà bạn muốn mình trở thành nhé. Kết quả là
                câu chuyện cá nhân của bạn, không nên để yếu tố bên ngoài tác động.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
