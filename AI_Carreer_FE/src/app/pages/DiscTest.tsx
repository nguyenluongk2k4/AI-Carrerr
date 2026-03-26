import { Link } from "react-router";

export function DiscTest() {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="text-center text-sm font-semibold text-slate-700 mb-6">
          HIỂU MÌNH - HIỂU NGƯỜI, PHÁT TRIỂN NGHỀ NGHIỆP ĐÚNG ĐẮN VÀ PHÙ HỢP NHẤT
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          <div>
            <div className="bg-[#7cc251] text-white text-center py-3 rounded-md mb-6">
              Lưu ý: Bạn chỉ được làm bài test này <span className="text-red-200">3 tháng 1 lần</span>
            </div>
            <div className="flex justify-center mb-6">
              <Link
                to="/test/disc"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-3 rounded-md text-lg"
              >
                Bắt đầu
              </Link>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <img src="/test-disc.jpg" alt="D.I.S.C" className="w-full" />
            </div>
          </div>

          <div className="text-slate-800 leading-relaxed text-[15px]">
            <p className="mb-3">
              <span className="font-semibold">DISC</span> là công cụ đánh giá cá nhân hàng đầu được sử dụng bởi hơn 1
              triệu người mỗi năm để cải thiện năng suất làm việc, phương thức làm việc nhóm cũng như là sự giao tiếp ứng
              xử của mọi người.
            </p>
            <p className="mb-3">
              Nếu tham gia vào công cụ đánh giá cá nhân DISC, bạn sẽ được yêu cầu hoàn thành một loạt câu hỏi để từ đó tạo
              ra một báo cáo chi tiết về cá tính và hành vi của bạn.
            </p>
            <p className="mb-3">
              Mô hình DISC cung cấp một ngôn ngữ chung mà mọi người có thể sử dụng để hiểu rõ hơn về bản thân mình và điều
              chỉnh hành vi của mình với người khác (trong môi trường làm việc nhóm, trong kinh doanh, trong đời sống...)
            </p>
            <p className="mb-3">
              Hiện tại các nền tảng tuyển dụng phổ biến như Jobstreet, Vietnamwork, Vieclam24h, Timviecnhanh,... đều sử
              dụng bài kiểm tra tính cách DISC này trong công tác phỏng vấn, ứng viên và đánh giá sự phù hợp.
            </p>
            <p className="mb-3">
              Bốn nhóm tính cách hành vi trong DISC sẽ có những đặc trưng riêng phù hợp từng ngành nghề khác nhau. Nếu bạn
              hiểu được tính cách của bản thân mình và lựa chọn đúng công việc phù hợp thì bạn sẽ có nhiều cơ hội để phát
              triển và thành công.
            </p>
            <p className="mb-3">
              Cùng Hành Trang Số khám phá từng đặc trưng tính cách của bản thân nhé!
            </p>
            <p className="mb-2 font-semibold">Lưu ý:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Thực hiện bài test trong trạng thái tâm lý bình ổn nhất. Khi quá vui, buồn hay bực bội sẽ không đảm bảo
                độ chính xác của bài test.
              </li>
              <li>
                Suy nghĩ thật kỹ và trả lời như chính con người thật của bạn. Đừng chọn câu trả lời mà bạn muốn mình trở
                thành. Không nên để yếu tố bên ngoài tác động đến câu trả lời.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
