// Assessment Data - Hành Trang Số
// New question set (21 questions + scores + combo)

// ============ QUESTION DEFINITIONS ============

export interface QuestionOption {
  key: string;
  label: string;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
  isMultiSelect?: boolean; // For Q19
}

// Part 1: Sở thích & xu hướng cá nhân (Q1-5)
export const PART1_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Bạn thường cảm thấy hứng thú với hoạt động nào nhất?",
    options: [
      { key: "A", label: "Làm việc với số liệu, phân tích logic" },
      { key: "B", label: "Sáng tạo nội dung, nghệ thuật, ý tưởng" },
      { key: "C", label: "Làm việc với con người, giao tiếp" },
      { key: "D", label: "Thực hành, trải nghiệm thực tế" },
    ],
  },
  {
    id: 2,
    question: "Bạn thích học theo cách nào nhất?",
    options: [
      { key: "A", label: "Tự học, nghiên cứu độc lập" },
      { key: "B", label: "Học qua thảo luận, làm việc nhóm" },
      { key: "C", label: "Học qua trải nghiệm thực tế" },
      { key: "D", label: "Học theo hướng dẫn rõ ràng" },
    ],
  },
  {
    id: 3,
    question: "Bạn thường đưa ra quyết định dựa trên:",
    options: [
      { key: "A", label: "Lý trí và dữ liệu" },
      { key: "B", label: "Cảm xúc và giá trị cá nhân" },
      { key: "C", label: "Ý kiến từ người khác" },
      { key: "D", label: "Trải nghiệm trước đó" },
    ],
  },
  {
    id: 4,
    question: "Bạn thích môi trường học tập/làm việc như thế nào?",
    options: [
      { key: "A", label: "Có cấu trúc rõ ràng, ổn định" },
      { key: "B", label: "Linh hoạt, sáng tạo" },
      { key: "C", label: "Năng động, nhiều tương tác" },
      { key: "D", label: "Thử thách, cạnh tranh cao" },
    ],
  },
  {
    id: 5,
    question: "Bạn quan tâm điều gì nhất khi nghĩ về tương lai?",
    options: [
      { key: "A", label: "Thu nhập và sự ổn định" },
      { key: "B", label: "Được làm điều mình thích" },
      { key: "C", label: "Được giúp đỡ và kết nối với người khác" },
      { key: "D", label: "Được thử thách và phát triển bản thân" },
    ],
  },
];

// Part 2: Học tập & Điểm mạnh cá nhân (Q6-11)
export const PART2_QUESTIONS: Question[] = [
  {
    id: 6,
    question: "Bạn học tốt nhất ở nhóm môn nào?",
    options: [
      { key: "A", label: "Toán – Lý – Hóa" },
      { key: "B", label: "Văn – Sử – Địa" },
      { key: "C", label: "Ngoại ngữ" },
      { key: "D", label: "Kết hợp nhiều môn / không rõ" },
    ],
  },
  {
    id: 7,
    question: "Khi học một kiến thức mới, bạn thường:",
    options: [
      { key: "A", label: "Hiểu nhanh và nắm bản chất" },
      { key: "B", label: "Cần thời gian luyện tập để quen" },
      { key: "C", label: "Cần hướng dẫn cụ thể từng bước" },
      { key: "D", label: "Khó tiếp thu nếu không thực hành" },
    ],
  },
  {
    id: 8,
    question: "Điểm mạnh lớn nhất của bạn trong học tập là gì?",
    options: [
      { key: "A", label: "Tư duy logic, phân tích" },
      { key: "B", label: "Ghi nhớ và tổng hợp thông tin" },
      { key: "C", label: "Trình bày, diễn đạt ý tưởng" },
      { key: "D", label: "Áp dụng kiến thức vào thực tế" },
    ],
  },
  {
    id: 9,
    question: "Bạn thường đạt kết quả tốt nhất khi:",
    options: [
      { key: "A", label: "Làm bài kiểm tra cá nhân" },
      { key: "B", label: "Làm việc nhóm" },
      { key: "C", label: "Làm dự án/thực hành" },
      { key: "D", label: "Thuyết trình / trình bày" },
    ],
  },
  {
    id: 10,
    question: "Bạn đã từng đạt thành tích nào sau đây?",
    options: [
      { key: "A", label: "Học sinh giỏi / điểm cao" },
      { key: "B", label: "Giải thưởng học thuật / thi cử" },
      { key: "C", label: "Thành tích hoạt động / CLB" },
      { key: "D", label: "Chưa có thành tích nổi bật" },
    ],
  },
  {
    id: 11,
    question: "Bạn đánh giá mức độ kỷ luật trong học tập của mình:",
    options: [
      { key: "A", label: "Rất tốt – luôn có kế hoạch rõ ràng" },
      { key: "B", label: "Khá – đôi lúc mất tập trung" },
      { key: "C", label: "Trung bình – phụ thuộc cảm hứng" },
      { key: "D", label: "Thấp – khó duy trì đều đặn" },
    ],
  },
];

// Part 3: Điểm học kỳ (handled by form input, not questions)

// Part 4: Tổ hợp môn (handled by auto-calculation)

// Part 5: Tài chính & Kỳ vọng (Q12-21)
export const PART5_QUESTIONS: Question[] = [
  {
    id: 12,
    question: "Mức học phí gia đình sẵn sàng chi trả mỗi năm?",
    options: [
      { key: "A", label: "Dưới 20 triệu" },
      { key: "B", label: "20 – 50 triệu" },
      { key: "C", label: "50 – 100 triệu" },
      { key: "D", label: "Trên 100 triệu" },
    ],
  },
  {
    id: 13,
    question: "Gia đình bạn có sẵn sàng hỗ trợ chi phí học tập dài hạn (4–5 năm) không?",
    options: [
      { key: "A", label: "Có thể hỗ trợ hoàn toàn" },
      { key: "B", label: "Hỗ trợ một phần" },
      { key: "C", label: "Cần tự chủ phần lớn" },
      { key: "D", label: "Gặp khó khăn về tài chính" },
    ],
  },
  {
    id: 14,
    question: "Bạn có sẵn sàng học xa nhà (chi phí sinh hoạt cao hơn)?",
    options: [
      { key: "A", label: "Sẵn sàng" },
      { key: "B", label: "Cân nhắc tùy điều kiện" },
      { key: "C", label: "Không muốn" },
    ],
  },
  {
    id: 15,
    question: "Bạn mong muốn học tập/làm việc ở khu vực nào?",
    options: [
      { key: "A", label: "Miền Bắc" },
      { key: "B", label: "Miền Trung" },
      { key: "C", label: "Miền Nam" },
      { key: "D", label: "Quốc tế" },
      { key: "E", label: "Không quan trọng" },
    ],
  },
  {
    id: 16,
    question: "Khi chọn ngành/trường, bạn ưu tiên yếu tố nào hơn?",
    options: [
      { key: "A", label: "Phù hợp đam mê" },
      { key: "B", label: "Chi phí hợp lý" },
      { key: "C", label: "Cơ hội việc làm" },
      { key: "D", label: "Thu nhập tương lai" },
    ],
  },
  {
    id: 17,
    question: "Khi đối mặt với khối lượng học tập/công việc lớn, bạn thường phản ứng như thế nào?",
    options: [
      { key: "A", label: "Dễ bị quá tải, cần môi trường nhẹ nhàng" },
      { key: "B", label: "Xử lý ổn nếu có sự cân bằng" },
      { key: "C", label: "Càng áp lực càng có động lực" },
    ],
  },
  {
    id: 18,
    question: "Bạn cảm thấy mình sẵn sàng học tập bằng tiếng Anh ở mức độ nào?",
    options: [
      { key: "A", label: "Chưa sẵn sàng, cần bắt đầu từ nền tảng cơ bản" },
      { key: "B", label: "Có thể học song song, từng bước nâng cao" },
      { key: "C", label: "Rất sẵn sàng, có thể học hoàn toàn bằng tiếng Anh" },
    ],
  },
  {
    id: 19,
    question: "Thói quen học tập của bạn là gì? (Có thể chọn nhiều)",
    isMultiSelect: true,
    options: [
      { key: "A", label: "Tự học đều mỗi ngày" },
      { key: "B", label: "Học theo nhóm" },
      { key: "C", label: "Cần người hướng dẫn/mentor" },
      { key: "D", label: "Thích học qua thực hành" },
      { key: "E", label: "Thích nghiên cứu chuyên sâu" },
    ],
  },
  {
    id: 20,
    question: "Mức lương mong muốn sau khi ra trường của bạn là bao nhiêu?",
    options: [
      { key: "A", label: "Dưới 8 triệu/tháng" },
      { key: "B", label: "8 – 15 triệu/tháng" },
      { key: "C", label: "15 – 25 triệu/tháng" },
      { key: "D", label: "Trên 25 triệu/tháng" },
    ],
  },
  {
    id: 21,
    question: "Bạn sẵn sàng đánh đổi điều gì để đạt được mức thu nhập mong muốn?",
    options: [
      { key: "A", label: "Thời gian học tập dài hơn" },
      { key: "B", label: "Áp lực công việc cao" },
      { key: "C", label: "Làm việc xa nhà" },
      { key: "D", label: "Không muốn đánh đổi nhiều" },
    ],
  },
];

// Combine all questions
export const ALL_QUESTIONS: Question[] = [
  ...PART1_QUESTIONS,
  ...PART2_QUESTIONS,
  ...PART5_QUESTIONS,
];

// ============ SUBJECTS & SCORES ============

export interface Subject {
  key: string;
  label: string;
}

export const SUBJECTS: Subject[] = [
  { key: "math", label: "Toán" },
  { key: "physics", label: "Vật lý" },
  { key: "chemistry", label: "Hóa học" },
  { key: "literature", label: "Ngữ văn" },
  { key: "biology", label: "Sinh học" },
  { key: "history", label: "Lịch sử" },
  { key: "geography", label: "Địa lý" },
  { key: "english", label: "Tiếng Anh" },
  { key: "french", label: "Tiếng Pháp" },
  { key: "civic_edu", label: "GDCD" },
];

// ============ COMBO CALCULATION ============

export interface Combo {
  code: string;
  subjects: string[];
  score: number;
}

export function getComboScores(scores: Record<string, number>): Combo[] {
  const combos: Record<string, string[]> = {
    A00: ["math", "physics", "chemistry"],
    A01: ["math", "physics", "english"],
    B00: ["math", "chemistry", "biology"],
    C00: ["literature", "history", "geography"],
    D01: ["math", "literature", "english"],
    D07: ["math", "chemistry", "english"],
    D14: ["literature", "history", "english"],
    D15: ["literature", "geography", "english"],
  };

  const results: Combo[] = [];

  for (const [code, comboSubjects] of Object.entries(combos)) {
    const total = comboSubjects.reduce((sum, subj) => sum + (scores[subj] || 0), 0);
    results.push({
      code,
      subjects: comboSubjects.map((s) => {
        const subj = SUBJECTS.find((sub) => sub.key === s);
        return subj ? subj.label : s;
      }),
      score: Number(total.toFixed(2)),
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results;
}

// ============ PRESET OPTIONS ============

export const HABIT_OPTIONS = [
  "Tự học đều mỗi ngày",
  "Học theo nhóm",
  "Cần người hướng dẫn/mentor",
  "Thích học qua thực hành",
  "Thích nghiên cứu chuyên sâu",
];

export const SALARY_OPTIONS = [
  "Dưới 8 triệu/tháng",
  "8 – 15 triệu/tháng",
  "15 – 25 triệu/tháng",
  "Trên 25 triệu/tháng",
];

export const FAMILY_OPTIONS = [
  "Có thể hỗ trợ hoàn toàn",
  "Hỗ trợ một phần",
  "Cần tự chủ phần lớn",
  "Gặp khó khăn về tài chính",
];

export const LOCATION_OPTIONS = [
  "Miền Bắc",
  "Miền Trung",
  "Miền Nam",
  "Quốc tế",
  "Không quan trọng",
];

// ============ WEAK SUBJECTS CALCULATION ============

export function getWeakSubjects(scores: Record<string, number> | null | undefined, threshold: number = 7.0): string[] {
  if (!scores) return [];
  
  const subjectLabels: Record<string, string> = {
    math: "Toán",
    physics: "Vật lý",
    chemistry: "Hóa học",
    literature: "Ngữ văn",
    biology: "Sinh học",
    history: "Lịch sử",
    geography: "Địa lý",
    english: "Tiếng Anh",
    french: "Tiếng Pháp",
    civic_edu: "GDCD",
  };

  return Object.entries(scores)
    .filter(([_, score]) => score < threshold)
    .map(([key]) => subjectLabels[key] || key)
    .sort((a, b) => (scores[a] || 0) - (scores[b] || 0));
}

// ============ LEGACY EXPORTS (for compatibility) ============

export const QUIZ_QUESTIONS = ALL_QUESTIONS;
export const PERSONAL_QUESTIONS = PART5_QUESTIONS;
