import { Link } from "react-router";

export function MbtiTest() {
  return (
    <div className="bg-white min-h-screen w-full">
      {/* Breadcrumb section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm flex items-center gap-2">
        <Link to="/" className="text-gray-500 hover:text-amber-500 transition-colors">Trang chủ</Link>
        <span className="text-gray-400">/</span>
        <span className="text-amber-500 font-medium">Hệ thống bài test</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1e3a8a] mb-8 lg:mb-12 text-center sm:text-left uppercase">
          LÀM BÀI TEST TÍNH CÁCH - MBTI TRỰC TUYẾN
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left Side */}
          <div className="lg:w-[40%] flex flex-col gap-5">
            <div className="bg-[#10b981] text-white p-4 rounded-md text-center text-lg shadow-sm">
              Lưu ý : Bạn chỉ được làm bài test này 3 tháng 1 lần
            </div>
            
            <Link 
              to="/test/mbti" 
              className="bg-[#f59e0b] hover:bg-[#d97706] text-white text-xl font-bold py-4 px-8 rounded-md text-center transition-colors shadow-sm block w-full uppercase"
            >
              Bắt đầu
            </Link>

            <div className="mt-4 flex justify-center w-full">
              {/* This assumes the user image test-mbti.jpg is used as a fallback or decorative reference. 
                  Given the request says "from this image", I will use the image itself to represent the bottom left grid. */}
              <img 
                src="/test-mbti.jpg" 
                alt="Các nhóm tính cách MBTI" 
                className="w-full max-w-sm h-auto object-contain rounded-lg shadow-sm border border-gray-100"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:w-[60%] text-gray-700 leading-relaxed text-[17px]">
            <p className="mb-5">
              <span className="font-bold">MBTI</span> là cách viết ngắn gọn của Chỉ số phân loại Myers-Briggs (Myers-Briggs Type Indication), là một phương pháp sử dụng các câu hỏi trắc nghiệm tâm lý để tìm hiểu tâm lý, tính cách cũng như cách con người nhận thức thế giới xung quanh, đưa ra quyết định cho một vấn đề...
            </p>
            <p className="mb-5">
              Phương pháp kiểm kê tính cách này khởi nguồn từ các lý thuyết phân loại trong cuốn Psychological Types của Carl Gustav Jung xuất bản năm 1921 và được phát triển bởi Katharine Cook Briggs cùng con gái của bà, Isabel Briggs Myers, từ khoảng Chiến tranh thế giới thứ hai. Các câu hỏi tâm lý ban đầu đã phát triển thành Chỉ số phân loại Myers-Briggs và được công bố vào năm 1962.
            </p>
            <p className="mb-8">
              <span className="font-bold">MBTI</span> trả lời cho câu hỏi tại sao mỗi người trên thế giới đều có cá tính khác nhau, không ai giống ai và sự khác biệt tự nhiên của mỗi người.
            </p>

            <h3 className="text-[17px] font-bold text-gray-900 mb-4 mt-8">
              Lưu ý: MBTI là bài trắc nghiệm tâm lý nên để thực hiện nó một cách chính xác, hiệu quả nhất bạn nên:
            </h3>
            <ul className="list-disc pl-6 space-y-4 text-gray-700">
              <li>
                <span className="font-bold text-gray-900">Kết quả của bài test phụ thuộc rất nhiều vào tâm trạng của bạn.</span> Bạn nên thực hiện nó trong một trạng thái tâm lý bình ổn nhất. Còn khi bạn đang quá vui, buồn, hay bực bội thì sẽ không đảm bảo được độ chính xác của bài test.
              </li>
              <li>
                <span className="font-bold text-gray-900">Trả lời như chính con người thật của bạn</span>, đừng chọn câu trả lời mà bạn muốn mình trở thành nhé. Kết quả của trắc nghiệm hoàn toàn là câu chuyện cá nhân của bạn, không nên để yếu tố bên ngoài tác động đến câu trả lời.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
