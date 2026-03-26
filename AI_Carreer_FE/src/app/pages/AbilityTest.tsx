import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

const SUBJECTS = [
  { key: "dialy", label: "Địa lý" },
  { key: "hoahoc", label: "Hóa học" },
  { key: "tinhoc", label: "Tin học" },
  { key: "history", label: "Lịch sử" },
  { key: "biology", label: "Sinh học" },
  { key: "literature", label: "Văn học" },
  { key: "general", label: "Kiến thức tổng hợp" },
  { key: "culture", label: "Văn hóa - Nghệ thuật" },
  { key: "iq", label: "Test IQ" },
];

const TOP_20 = [
  { rank: 1, name: "Vũ Dũng", field: "Test IQ", score: 20, time: "0'38" },
  { rank: 2, name: "Lê Hải", field: "Hóa học", score: 20, time: "0'38" },
  { rank: 3, name: "Vũ Xuân Trường", field: "Hóa học", score: 20, time: "0'39" },
  { rank: 4, name: "Dương", field: "Kiến thức tổng hợp", score: 20, time: "0'53" },
  { rank: 5, name: "Xuân", field: "Địa lý", score: 20, time: "0'49" },
  { rank: 6, name: "Trang", field: "Test IQ", score: 20, time: "9'14" },
  { rank: 7, name: "Đàm Hồng", field: "Test IQ", score: 19, time: "1'07" },
  { rank: 8, name: "Nguyễn Thị Thu Nhân", field: "Hóa học", score: 19, time: "3'51" },
  { rank: 9, name: "Cynthia Esmeralda", field: "Test IQ", score: 19, time: "7'17" },
  { rank: 10, name: "Vũ Thị Mai", field: "Văn hóa - Nghệ thuật", score: 19, time: "7'21" },
  { rank: 11, name: "Phạm Nguyễn Bích", field: "Văn học", score: 19, time: "7'30" },
  { rank: 12, name: "Nhung", field: "Kiến thức tổng hợp", score: 18, time: "1'27" },
  { rank: 13, name: "Đinh Hải", field: "Hóa học", score: 18, time: "4'04" },
  { rank: 14, name: "Bùi Anh Quốc", field: "Hóa học", score: 18, time: "4'10" },
  { rank: 15, name: "Đoàn Ngọc", field: "Hóa học", score: 18, time: "5'00" },
  { rank: 16, name: "Tráng", field: "Hóa học", score: 18, time: "5'01" },
  { rank: 17, name: "Nghĩa Trương Đăng", field: "Tin học", score: 18, time: "6'01" },
  { rank: 18, name: "Hoàn Đặng Nghị Địch", field: "Địa lý", score: 18, time: "8'20" },
  { rank: 19, name: "Vũ Thu", field: "Lịch sử", score: 18, time: "9'11" },
  { rank: 20, name: "Vinh khổng", field: "Test IQ", score: 18, time: "9'49" },
];

export function AbilityTest() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("dialy");

  const subjectLabel = useMemo(() => {
    return SUBJECTS.find((item) => item.key === subject)?.label ?? "";
  }, [subject]);

  const left = TOP_20.filter((item) => item.rank <= 10);
  const right = TOP_20.filter((item) => item.rank > 10);

  const handleStart = () => {
    if (!subject) return;
    navigate(`/ability/test/${subject}`);
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="pt-6 text-center">
          <h1 className="text-3xl font-bold tracking-wide text-slate-800">
            LÀM BÀI <span className="text-orange-500">TEST</span> NĂNG LỰC
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            HỌC TRỰC TUYẾN E-LEARNING: CHỦ ĐỘNG - THUẬN TIỆN - THỰC TIỄN
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 md:flex-row md:justify-center">
          <div className="w-full md:w-[420px]">
            <select
              className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {SUBJECTS.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleStart}
            className="rounded-md bg-orange-500 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
          >
            Chuyên mục
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <img
            src="/test-nang-luc.png"
            alt="Kiến thức 10 lĩnh vực"
            className="mx-auto w-full max-w-3xl rounded-lg object-cover"
          />
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6">
            <img src="/cup1.png" alt="Cup" className="h-16 w-16 object-contain" />
            <div>
              <p className="text-lg font-semibold text-slate-700">Bảng xếp hạng</p>
              <p className="text-2xl font-bold text-slate-800">TOP 20</p>
            </div>
            <img src="/cup2.png" alt="Award" className="h-16 w-16 object-contain" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[left, right].map((group, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              <div className="grid grid-cols-7 bg-orange-200 text-xs font-semibold text-slate-700">
                <div className="px-2 py-2 text-center">Ảnh</div>
                <div className="px-2 py-2 text-center">Hạng</div>
                <div className="col-span-2 px-2 py-2 text-center">Họ tên</div>
                <div className="px-2 py-2 text-center">Lĩnh vực</div>
                <div className="px-2 py-2 text-center">Điểm</div>
                <div className="px-2 py-2 text-center">Thời gian</div>
              </div>
              {group.map((item, rowIndex) => (
                <div
                  key={item.rank}
                  className={`grid grid-cols-7 items-center text-xs ${
                    rowIndex % 2 === 0 ? "bg-amber-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-center px-2 py-2">
                    <div className="h-6 w-6 rounded-full bg-slate-200" />
                  </div>
                  <div className="px-2 py-2 text-center font-semibold">
                    {item.rank}
                  </div>
                  <div className="col-span-2 px-2 py-2 text-center">
                    {item.name}
                  </div>
                  <div className="px-2 py-2 text-center">{item.field}</div>
                  <div className="px-2 py-2 text-center">{item.score}</div>
                  <div className="px-2 py-2 text-center">{item.time}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          Bạn đang chọn: <span className="font-semibold text-slate-700">{subjectLabel}</span>
        </div>
      </div>
    </div>
  );
}
