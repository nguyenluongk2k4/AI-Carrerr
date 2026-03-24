import { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useAuth } from "../utils/useAuth";
import { ResultsDetailModalTrigger, ResultsFooterCta } from "../components/ResultsFooterCta";
import { saveResult } from "../utils/saveResult";

type MiScoreItem = {
  key: string;
  name: string;
  score: number;
  max_score: number;
  percent: number;
};

type MiResult = {
  scores: MiScoreItem[];
};

export function IntelResult() {
  const { user } = useAuth();
  const [result, setResult] = useState<MiResult | null>(null);
  const [desc, setDesc] = useState("");
  const [descStatus, setDescStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

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
    const raw = localStorage.getItem("miResult");
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
        const response = await fetch(`${API_BASE}/mi/describe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scores: result.scores }),
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
    const categories = result.scores.map((item) => item.key.toUpperCase());
    const values = result.scores.map((item) => item.percent);
    return { categories, values };
  }, [result]);

  const chartOptions = useMemo(() => {
    return {
      chart: { backgroundColor: "transparent", height: 320 },
      title: { text: "" },
      xAxis: { categories: chartData.categories },
      yAxis: { title: { text: "%" }, max: 100 },
      legend: { enabled: false },
      tooltip: { shared: true },
      series: [
        {
          type: "column",
          data: chartData.values,
          color: "#f59e0b",
          borderRadius: 6,
        },
      ],
    } as Highcharts.Options;
  }, [chartData]);

  if (!result) {
    return (
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4">Chưa có kết quả MI. Vui lòng nộp bài trước.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="bg-orange-200 text-slate-800 px-6 py-3 font-semibold">
            Bài kiểm tra đa trí thông minh 90 câu
          </div>
          <div className="p-6">
            <div className="text-center text-2xl font-semibold mb-6">KẾT QUẢ BÀI TEST ĐA TRÍ THÔNG MINH</div>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            {user?.isPremium && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={async () => {
                    if (!result) return;
                    try {
                      setSaveStatus("saving");
                      await saveResult(user.username, "intel", result);
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

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
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

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mt-8">
          <div className="text-lg font-semibold mb-3">Giải thích & gợi ý phát triển</div>
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
