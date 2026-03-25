import { Link } from "react-router";

export function IntelTest() {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        {/* <div className="w-full mb-8">
          <img src="/test-intel.png" alt="Kiểm tra đa trí thông minh" className="w-full rounded-lg" />
        </div> */}

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          BÀI KIỂM TRA <span className="text-orange-500">ĐA TRÍ THÔNG MINH</span>
        </h1>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          <div>
            <div className="bg-[#7cc251] text-white text-center py-3 rounded-md mb-6">
              Lưu ý: Bạn chỉ được làm bài test này <span className="text-red-200">3 tháng 1 lần</span>
            </div>
            <div className="flex justify-center mb-6">
              <Link
                to="/test/intel"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-md"
              >
                Bắt đầu
              </Link>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <img src="/test-intel.png" alt="Đa trí thông minh" className="w-full" />
            </div>
          </div>

          <div className="text-slate-700 leading-relaxed text-[15px]">
            <p className="mb-4">
              Trắc nghiệm đa trí thông minh MI (Multiple Intelligences) là phương pháp đánh giá trí thông minh nổi trội
              của mỗi người, dựa trên lý thuyết đa trí thông minh (Theory of Multiple Intelligences) nghiên cứu bởi giáo
              sư tâm lý học Howard Gardner.
            </p>
            <p className="mb-4">
              Theo lý thuyết này, Howard Gardner đã phản bác quan niệm truyền thống về khái niệm thông minh, từng được
              thống nhất và đánh giá bởi bài kiểm tra IQ.
            </p>
            <p className="mb-4">
              Lý thuyết “đa thông minh” cho rằng, mỗi cá nhân hầu như đều đạt đến một mức độ nào đó ở từng “phạm trù” trong
              hệ thống các dạng thông minh. Mức độ này thấp hay cao thể hiện hạn chế hay ưu thế của cá nhân đó trong lĩnh
              vực này.
            </p>
            <p className="mb-4 font-semibold">Lưu ý:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Bạn nên trả lời một cách trung thực nhất với bản thân mình, chọn câu trả lời nảy sinh ngay sau khi đọc câu
                hỏi.
              </li>
              <li>
                Thực hiện bài test trong trạng thái tâm lý bình ổn nhất. Khi quá vui, buồn, hay bực bội sẽ không đảm bảo
                độ chính xác.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
