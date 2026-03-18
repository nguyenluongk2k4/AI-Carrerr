export type QuizOption = {
  key: string;
  label: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: QuizOption[];
};

export type Subject = {
  key: string;
  label: string;
};

export type Combo = {
  code: string;
  subjects: string[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "🎯 Câu 1/5 — Bạn thích làm việc với điều gì nhất?",
    options: [
      { key: "A", label: "💻 Máy tính, code, giải thuật" },
      { key: "B", label: "🗣️ Con người, giao tiếp, kinh doanh" },
      { key: "C", label: "🩺 Sức khỏe, chăm sóc người khác" },
      { key: "D", label: "🎨 Nghệ thuật, thiết kế, sáng tạo" },
    ],
  },
  {
    id: 2,
    question: "📚 Câu 2/5 — Môn học bạn tự tin nhất là gì?",
    options: [
      { key: "A", label: "📐 Toán / Lý / Tin" },
      { key: "B", label: "✍️ Văn / Anh / Sử - Địa" },
      { key: "C", label: "🔬 Hóa / Sinh" },
      { key: "D", label: "🖌️ Vẽ / Mỹ thuật" },
    ],
  },
  {
    id: 3,
    question: "📊 Câu 3/5 — Điểm thi THPT dự kiến (tổng 3 môn)?",
    options: [
      { key: "A", label: "⭐ Trên 27 điểm" },
      { key: "B", label: "✅ 24–27 điểm" },
      { key: "C", label: "👍 20–24 điểm" },
      { key: "D", label: "🌱 Dưới 20 điểm" },
    ],
  },
  {
    id: 4,
    question: "💰 Câu 4/5 — Ngân sách học phí mỗi năm gia đình hỗ trợ được?",
    options: [
      { key: "A", label: "💚 Dưới 25 triệu VNĐ/năm" },
      { key: "B", label: "💛 25–40 triệu VNĐ/năm" },
      { key: "C", label: "🔶 Trên 40 triệu VNĐ/năm" },
    ],
  },
  {
    id: 5,
    question: "🎯 Câu 5/5 — Sau ra trường, bạn ưu tiên điều gì nhất?",
    options: [
      { key: "A", label: "💵 Thu nhập cao ngay sau tốt nghiệp" },
      { key: "B", label: "🔭 Môi trường nghiên cứu chuyên sâu" },
      { key: "C", label: "🌏 Làm việc trong môi trường quốc tế" },
      { key: "D", label: "🖌️ Tự do sáng tạo, thể hiện bản thân" },
    ],
  },
];

export const PERSONAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 6,
    question: "🧭 Bạn chịu áp lực học tập/công việc ở mức nào?",
    options: [
      { key: "A", label: "Thấp - cần môi trường ổn định" },
      { key: "B", label: "Trung bình - cân bằng là tốt nhất" },
      { key: "C", label: "Cao - áp lực càng cao càng cố gắng" },
    ],
  },
  {
    id: 7,
    question: "🌐 Mức sẵn sàng học tiếng Anh chuyên sâu?",
    options: [
      { key: "A", label: "Chưa sẵn sàng, cần lộ trình cơ bản" },
      { key: "B", label: "Sẵn sàng học dần song song" },
      { key: "C", label: "Rất sẵn sàng, có thể học 100% tiếng Anh" },
    ],
  },
  {
    id: 8,
    question: "🤝 Bạn thích phong cách làm việc nào?",
    options: [
      { key: "A", label: "Làm việc độc lập, tự chủ" },
      { key: "B", label: "Làm việc nhóm, phối hợp" },
      { key: "C", label: "Vai trò dẫn dắt, quản lý" },
    ],
  },
  {
    id: 9,
    question: "🎯 Mục tiêu 3–5 năm tới?",
    options: [
      { key: "A", label: "Đi làm sớm, tích lũy kinh nghiệm" },
      { key: "B", label: "Học sâu/chuyên môn cao" },
      { key: "C", label: "Du học/Trải nghiệm quốc tế" },
    ],
  },
];

export const ALL_QUESTIONS: QuizQuestion[] = [
  ...QUIZ_QUESTIONS,
  ...PERSONAL_QUESTIONS,
];

export const SUBJECTS: Subject[] = [
  { key: "Toán", label: "Toán" },
  { key: "Vật lý", label: "Vật lý" },
  { key: "Hóa học", label: "Hóa học" },
  { key: "Sinh học", label: "Sinh học" },
  { key: "Ngữ văn", label: "Ngữ văn" },
  { key: "Tiếng Anh", label: "Tiếng Anh" },
  { key: "Lịch sử", label: "Lịch sử" },
  { key: "Địa lý", label: "Địa lý" },
];

export const COMBOS: Combo[] = [
  { code: "A00", subjects: ["Toán", "Vật lý", "Hóa học"] },
  { code: "A01", subjects: ["Toán", "Vật lý", "Tiếng Anh"] },
  { code: "B00", subjects: ["Toán", "Hóa học", "Sinh học"] },
  { code: "C00", subjects: ["Ngữ văn", "Lịch sử", "Địa lý"] },
  { code: "D01", subjects: ["Toán", "Ngữ văn", "Tiếng Anh"] },
  { code: "D07", subjects: ["Toán", "Hóa học", "Tiếng Anh"] },
  { code: "D14", subjects: ["Ngữ văn", "Lịch sử", "Tiếng Anh"] },
  { code: "D15", subjects: ["Ngữ văn", "Địa lý", "Tiếng Anh"] },
];

export const HABIT_OPTIONS = [
  "Tự học đều mỗi ngày",
  "Học theo nhóm",
  "Cần mentor/giám sát",
  "Thích học thực hành",
  "Thích nghiên cứu chuyên sâu",
];

export const SALARY_OPTIONS = [
  "10–15 triệu/tháng",
  "15–25 triệu/tháng",
  "25–40 triệu/tháng",
  "Trên 40 triệu/tháng",
];

export const FAMILY_OPTIONS = [
  "Tiết kiệm",
  "Trung bình",
  "Khá/Giỏi",
];

export const LOCATION_OPTIONS = [
  "Miền Bắc",
  "Miền Trung",
  "Miền Nam",
  "Quốc tế",
  "Không quan trọng",
];

export const getComboScores = (scores: Record<string, number>) => {
  return COMBOS.map((combo) => {
    const score = combo.subjects.reduce((sum, subject) => {
      return sum + (scores[subject] ?? 0);
    }, 0);
    return { ...combo, score };
  }).sort((a, b) => b.score - a.score);
};

export const getWeakSubjects = (
  scores: Record<string, number> | null,
  comboCode: string,
  count = 3
) => {
  if (!scores) return [];
  const combo = COMBOS.find((item) => item.code === comboCode);
  const pool = combo ? combo.subjects : Object.keys(scores);
  const ranked = pool
    .map((subject) => ({ subject, score: scores[subject] ?? 0 }))
    .sort((a, b) => a.score - b.score);
  return ranked.slice(0, count).map((item) => item.subject);
};
