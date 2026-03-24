import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { PremiumGate } from "../components/PremiumGate";
import { usePremium } from "../utils/usePremium";

type SelectedSchool = {
  program: string;
  school: string;
  school_name: string;
  major: string;
};

type TutorItem = {
  type: string;
  content: string;
};

type TutorRecommendation = {
  subject: string;
  tutor: string;
  items: TutorItem[];
};

type RoadmapResponse = {
  roadmap: string[];
  courses: TutorRecommendation[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export function Roadmap() {
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState<SelectedSchool | null>(null);
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [courses, setCourses] = useState<TutorRecommendation[]>([]);

  const schoolLabel = useMemo(() => {
    if (!selectedSchool) return "";
    return selectedSchool.school_name || selectedSchool.school || selectedSchool.program;
  }, [selectedSchool]);

  useEffect(() => {
    const rawSchool = localStorage.getItem("selectedSchool");
    const rawWeak = localStorage.getItem("weakSubjects");
    if (rawSchool) {
      try {
        setSelectedSchool(JSON.parse(rawSchool) as SelectedSchool);
      } catch {
        setSelectedSchool(null);
      }
    }
    if (rawWeak) {
      try {
        setWeakSubjects(JSON.parse(rawWeak) as string[]);
      } catch {
        setWeakSubjects([]);
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedSchool || !isPremium) return;
    const controller = new AbortController();

    const run = async () => {
      setStatus("loading");
      setError("");
      try {
        const response = await fetch(`${API_BASE}/roadmap/school`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            program: selectedSchool.program,
            school: selectedSchool.school,
            major: selectedSchool.major,
            weak_subjects: weakSubjects,
          }),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = (await response.json()) as RoadmapResponse;
        setRoadmap(data.roadmap ?? []);
        setCourses(data.courses ?? []);
        setStatus("success");
      } catch (err) {
        if (controller.signal.aborted) return;
        setStatus("error");
        setError("Không thể tải roadmap. Vui lòng thử lại.");
      }
    };

    run();
    return () => controller.abort();
  }, [selectedSchool, weakSubjects, isPremium]);

  if (!isPremium) {
    return (
      <PremiumGate
        title="Lộ trình hành động cá nhân hóa"
        description="Kích hoạt Premium để xem roadmap 6–12–24 tháng và theo dõi tiến độ."
      />
    );
  }

  if (!selectedSchool) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl mb-4">Chưa chọn trường</h1>
          <p className="text-gray-600 mb-6">
            Vui lòng chọn một trường trong kết quả để tạo roadmap.
          </p>
          <button
            onClick={() => navigate("/results")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Quay lại Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-3">Roadmap cho {schoolLabel}</h1>
          <p className="text-gray-600">
            Lộ trình học tập và gợi ý khóa học theo dữ liệu Chroma.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-8 mb-10"
        >
          <h2 className="text-2xl mb-4">Lộ trình học tập</h2>
          {status === "loading" ? (
            <div className="space-y-3">
              <div className="h-3 w-11/12 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-3 w-10/12 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-3 w-9/12 bg-gray-200 rounded-full animate-pulse" />
            </div>
          ) : status === "error" ? (
            <div className="text-red-600">{error}</div>
          ) : roadmap.length === 0 ? (
            <div className="text-gray-600">Chưa có dữ liệu roadmap cho trường này.</div>
          ) : (
            <ul className="space-y-3 text-gray-700">
              {roadmap.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-orange-100 p-8"
        >
          <h2 className="text-2xl mb-4">Gợi ý khóa học theo môn yếu</h2>
          {status === "loading" ? (
            <div className="space-y-3">
              <div className="h-3 w-11/12 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-3 w-10/12 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-3 w-9/12 bg-gray-200 rounded-full animate-pulse" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-gray-600">
              Chưa có dữ liệu khóa học phù hợp hoặc chưa xác định môn yếu.
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course, index) => (
                <div key={`${course.subject}-${index}`} className="border-2 border-gray-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-semibold">{course.subject}</div>
                    <div className="text-sm text-blue-600">{course.tutor}</div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    {course.items.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        • {item.content}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
