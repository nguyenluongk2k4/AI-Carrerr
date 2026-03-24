import { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useAuth } from "../utils/useAuth";
import { ResultsDetailModalTrigger, ResultsFooterCta } from "../components/ResultsFooterCta";
import { saveResult } from "../utils/saveResult";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

type MbtiAxisScore = {
  axis: string;
  left: string;
  right: string;
  left_score: number;
  right_score: number;
  left_percent: number;
  right_percent: number;
};

type MbtiResult = {
  mbti_type: string;
  group: string;
  axes: MbtiAxisScore[];
  totals: Record<string, number>;
};

const MBTI_GROUPS = [
  {
    title: "Analyst (NT)",
    types: ["INTJ", "INTP", "ENTJ", "ENTP"],
  },
  {
    title: "Diplomat (NF)",
    types: ["INFJ", "INFP", "ENFJ", "ENFP"],
  },
  {
    title: "Sentinel (SJ)",
    types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  },
  {
    title: "Explorer (SP)",
    types: ["ISTP", "ISFP", "ESTP", "ESP"],
  },
];

export function MbtiResult() {
  const { user } = useAuth();
  const [result, setResult] = useState<MbtiResult | null>(null);
  const [desc, setDesc] = useState("");
  const [descStatus, setDescStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const formatDesc = (text: string) => {
    const cleaned = text
      .replace(/^\s*(chào bạn|xin chào|hello|hi)\b[:,]?\s*/i, "")
      .replace(/\r/g, "")
      .trim();
    return cleaned
      .split("\n")
      .map((line) => line.trim().replace(/\*\*/g, ""))
      .filter(Boolean)
      .map((line) => {
        const numeric = line.match(/^\d+\.\s*/);
        if (numeric) return `• ${line.replace(/^\d+\.\s*/, "")}`;
        if (line.startsWith("- ")) return `• ${line.slice(2)}`;
        return line;
      });
  };

  useEffect(() => {
    const raw = localStorage.getItem("mbtiResult");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as MbtiResult;
        setResult(parsed);
        return;
      } catch {
        setResult(null);
      }
    }
  }, []);

  const displayType = useMemo(() => {
    if (!result) return "";
    return result.mbti_type === "ESFP" ? "ESP" : result.mbti_type;
  }, [result]);

  useEffect(() => {
    if (!result) return;
    const run = async () => {
      setDescStatus("loading");
      try {
        const response = await fetch(`${API_BASE}/mbti/describe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mbti_type: result.mbti_type }),
        });
        if (!response.ok) throw new Error("failed");
        const data = (await response.json()) as { description?: string };
        setDesc(data.description ?? "");
        setDescStatus("done");
      } catch {
        setDescStatus("error");
      }
    };
    run();
  }, [result]);

  const chartData = useMemo(() => {
    if (!result) return { categories: [], values: [] as number[] };
    const order = ["I", "E", "N", "S", "T", "F", "P", "J"];
    const axisMap = new Map<string, { left: string; right: string; left_percent: number; right_percent: number }>();
    for (const axis of result.axes) {
      axisMap.set(axis.left, axis);
      axisMap.set(axis.right, axis);
    }
    const values = order.map((key) => {
      const axis = axisMap.get(key);
      if (!axis) return 0;
      return key === axis.left ? axis.left_percent : axis.right_percent;
    });
    return { categories: order, values };
  }, [result]);

  const chartOptions = useMemo(() => {
    return {
      chart: { backgroundColor: "transparent", height: 320 },
      title: { text: "" },
      xAxis: { categories: chartData.categories, lineColor: "#e5e7eb", tickColor: "#e5e7eb" },
      yAxis: { title: { text: "" }, gridLineColor: "#f1f5f9" },
      legend: { enabled: false },
      tooltip: { shared: true },
      series: [
        {
          type: "column",
          data: chartData.values,
          color: "#7dd3fc",
          borderRadius: 6,
        },
        {
          type: "spline",
          data: chartData.values,
          color: "#2563eb",
          marker: { symbol: "circle", radius: 4 },
        },
      ],
    } as Highcharts.Options;
  }, [chartData]);

  if (!result) {
    return (
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4">Chưa có kết quả MBTI. Vui lòng nộp bài trước.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="bg-orange-200 text-slate-800 px-6 py-3 font-semibold">
            Bài kiểm tra tính cách 32 câu
          </div>
          <div className="p-6">
            <div className="text-center text-2xl font-semibold mb-2">KẾT QUẢ BÀI TEST TÍNH CÁCH MBTI</div>
            <div className="text-center text-slate-500 mb-6">Bạn thuộc nhóm tính cách {displayType}</div>

            <div className="bg-slate-700 text-white text-2xl font-semibold text-center py-4 mb-6">CHÚC MỪNG</div>

            <HighchartsReact highcharts={Highcharts} options={chartOptions} />

            {user?.isPremium && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={async () => {
                    if (!result) return;
                    try {
                      setSaveStatus("saving");
                      await saveResult(user.username, "mbti", result);
                      setSaveStatus("saved");
                    } catch {
                      setSaveStatus("error");
                    }
                  }}
                  className="rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white"
                >
                  Lưu kết quả
                </button>
                {saveStatus === "saved" && <span className="text-sm text-green-600">Đã lưu</span>}
                {saveStatus === "error" && <span className="text-sm text-red-500">Lưu thất bại</span>}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">
          <div className="text-lg font-semibold mb-3">Mô tả nhóm {displayType}</div>
          {descStatus === "loading" && <div className="text-slate-500">Đang tạo mô tả...</div>}
          {descStatus === "error" && <div className="text-red-500">Không lấy được mô tả.</div>}
          {descStatus === "done" && (
            <div className="text-slate-700 space-y-3">
              {formatDesc(desc).map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          )}
        </div>

        <ResultsDetailModalTrigger isLoggedIn={Boolean(user)} />

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">
          <div className="text-lg font-semibold mb-3">Nhóm của bạn</div>
          <div className="text-slate-700">
            {result.group} – {displayType}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="text-lg font-semibold mb-4">Tất cả các nhóm tính cách MBTI</div>
          <div className="grid md:grid-cols-2 gap-4">
            {MBTI_GROUPS.map((group) => (
              <div key={group.title} className="border border-slate-200 rounded-lg p-4">
                <div className="font-semibold text-slate-800 mb-2">{group.title}</div>
                <div className="text-slate-600">{group.types.join(" · ")}</div>
              </div>
            ))}
          </div>
        </div>

        <ResultsFooterCta />
      </div>
    </div>
  );
}
