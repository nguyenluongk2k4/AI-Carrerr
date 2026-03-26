import { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useAuth } from "../utils/useAuth";
import { ResultsDetailModalTrigger, ResultsFooterCta } from "../components/ResultsFooterCta";
import { saveResult } from "../utils/saveResult";

type DiscScoreItem = {
  key: string;
  name: string;
  score: number;
  max_score: number;
  percent: number;
};

type DiscResult = {
  scores: DiscScoreItem[];
  top_code: string;
};

export function DiscResult() {
  const { user } = useAuth();
  const [result, setResult] = useState<DiscResult | null>(null);
  const [desc, setDesc] = useState("");
  const [descStatus, setDescStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

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
    const raw = localStorage.getItem("discResult");
    if (!raw) return;
    try {
      setResult(JSON.parse(raw));
    } catch {
      setResult(null);
    }
  }, []);

  useEffect(() => {
    if (!result) return;
    const run = async () => {
      setDescStatus("loading");
      try {
        const response = await fetch(`${API_BASE}/disc/describe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scores: result.scores, top_code: result.top_code }),
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
    const totalScore = result.scores.reduce((sum, item) => sum + item.score, 0);
    const categories = result.scores.map((item) => item.key);
    const values = result.scores.map((item) => (totalScore > 0 ? (item.score / totalScore) * 100 : 0));
    return { categories, values };
  }, [result]);

  const chartOptions = useMemo(() => {
    const colorMap: Record<string, string> = {
      C: "#ef4444",
      I: "#16a34a",
      S: "#2563eb",
      D: "#f59e0b",
    };
    const seriesData = chartData.categories.map((key, idx) => ({
      name: key,
      y: chartData.values[idx],
      color: colorMap[key] ?? "#94a3b8",
    }));
    return {
      chart: { type: "pie", backgroundColor: "transparent", height: 320 },
      title: { text: "" },
      tooltip: { pointFormat: "{point.percentage:.1f}%" },
      plotOptions: {
        pie: {
          innerSize: "55%",
          dataLabels: { enabled: false },
        },
      },
      series: [
        {
          type: "pie",
          data: seriesData,
        },
      ],
    } as Highcharts.Options;
  }, [chartData]);

  const topScore = useMemo(() => {
    if (!result || result.scores.length === 0) return null;
    const sorted = [...result.scores].sort((a, b) => b.percent - a.percent);
    return sorted[0];
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4">Chưa có kết quả DISC. Vui lòng nộp bài trước.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="bg-orange-200 text-slate-800 px-6 py-3 font-semibold">
            Bài kiểm tra D.I.S.C 24 câu
          </div>
          <div className="p-6">
            <div className="text-center text-2xl font-semibold mb-2">KẾT QUẢ BÀI TEST D.I.S.C</div>
            <div className="text-center text-slate-500 mb-6">
              {topScore ? `Nhóm người ${topScore.name} (${topScore.key})` : `Tổ hợp: ${result.top_code}`}
            </div>

            <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
              <div className="flex justify-center">
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.scores.map((item) => {
                  const colorMap: Record<string, string> = {
                    C: "#ef4444",
                    I: "#16a34a",
                    S: "#2563eb",
                    D: "#f59e0b",
                  };
                  const border = colorMap[item.key] ?? "#cbd5f5";
                  const totalScore = result.scores.reduce((sum, s) => sum + s.score, 0);
                  const percent = totalScore > 0 ? (item.score / totalScore) * 100 : 0;
                  return (
                    <div key={item.key} className="border rounded-md overflow-hidden" style={{ borderColor: border }}>
                      <div className="text-center text-white font-bold py-3" style={{ backgroundColor: border }}>
                        {item.key}
                      </div>
                      <div className="p-3 text-center text-sm text-slate-700">
                        {item.name}
                      </div>
                      <div className="text-center text-2xl font-semibold text-slate-700 pb-4">
                        {percent.toFixed(2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {user?.isPremium && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={async () => {
                    if (!result) return;
                    try {
                      setSaveStatus("saving");
                      await saveResult(user.username, "disc", result);
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
          <div className="text-lg font-semibold mb-4">Xếp hạng điểm mạnh</div>
          <div className="space-y-3">
            {result.scores.map((item) => (
              <div key={item.key} className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-2">
                <div className="text-slate-700">{item.name}</div>
                <div className="text-slate-600">{item.percent}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="text-lg font-semibold mb-3">Giải thích & gợi ý</div>
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

        <ResultsFooterCta />
      </div>
    </div>
  );
}
