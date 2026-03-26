import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../utils/useAuth";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

type ResultsPayload = {
  username: string;
  tests?: Record<string, { result: any; savedAt?: string }>;
};

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ResultsPayload | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const run = async () => {
      setStatus("loading");
      try {
        const res = await fetch(`${API_BASE}/results/${user.username}`);
        if (!res.ok) throw new Error("not_found");
        const json = (await res.json()) as ResultsPayload;
        setData(json);
        setStatus("idle");
      } catch {
        setStatus("error");
      }
    };
    run();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Hồ sơ kết quả</h1>
          <p className="text-slate-500 text-sm">Tài khoản: {user.displayName}</p>
        </div>

        {status === "loading" && <div className="text-slate-500">Đang tải dữ liệu...</div>}
        {status === "error" && (
          <div className="text-slate-600">
            Chưa có kết quả nào được lưu. Hãy làm bài test và bấm “Lưu kết quả”.
          </div>
        )}

        {data?.tests && (
          <div className="space-y-8">
            {data.tests.mbti && (
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="font-semibold text-slate-800 mb-2">MBTI</div>
                <div className="text-slate-700">
                  Loại: {data.tests.mbti.result?.mbti_type} ({data.tests.mbti.result?.group})
                </div>
                {data.tests.mbti.result?.axes && (
                  <div className="mt-4">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: { backgroundColor: "transparent", height: 260 },
                        title: { text: "" },
                        xAxis: { categories: ["I", "E", "N", "S", "T", "F", "P", "J"] },
                        yAxis: { title: { text: "%" }, max: 100 },
                        legend: { enabled: false },
                        series: (() => {
                          const values = ["I", "E", "N", "S", "T", "F", "P", "J"].map((key) => {
                            const axis = data.tests.mbti.result.axes.find(
                              (a: any) => a.left === key || a.right === key
                            );
                            if (!axis) return 0;
                            return key === axis.left ? axis.left_percent : axis.right_percent;
                          });
                          return [
                            { type: "column", color: "#7dd3fc", data: values, borderRadius: 6 },
                            { type: "spline", color: "#2563eb", data: values, marker: { radius: 4 } },
                          ];
                        })(),
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {data.tests.intel && (
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="font-semibold text-slate-800 mb-2">Đa trí thông minh</div>
                {data.tests.intel.result?.scores && (
                  <div className="mt-4">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: { backgroundColor: "transparent", height: 260 },
                        title: { text: "" },
                        xAxis: {
                          categories: data.tests.intel.result.scores.map((s: any) => s.key.toUpperCase()),
                        },
                        yAxis: { title: { text: "%" }, max: 100 },
                        legend: { enabled: false },
                        series: [
                          {
                            type: "column",
                            color: "#f59e0b",
                            data: data.tests.intel.result.scores.map((s: any) => s.percent),
                          },
                        ],
                      }}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  {(data.tests.intel.result?.scores || []).map((item: any) => (
                    <div key={item.key} className="flex items-center justify-between text-sm text-slate-700">
                      <span>{item.name}</span>
                      <span>{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.tests.holland && (
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="font-semibold text-slate-800 mb-2">Holland</div>
                <div className="text-slate-700">Mã tổ hợp: {data.tests.holland.result?.top_code}</div>
                {data.tests.holland.result?.scores && (
                  <div className="mt-4">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: { backgroundColor: "transparent", height: 240 },
                        title: { text: "" },
                        xAxis: {
                          categories: data.tests.holland.result.scores.map((s: any) => s.key),
                        },
                        yAxis: { title: { text: "%" }, max: 100 },
                        legend: { enabled: false },
                        series: [
                          {
                            type: "column",
                            color: "#38bdf8",
                            data: data.tests.holland.result.scores.map((s: any) => s.percent),
                          },
                        ],
                      }}
                    />
                  </div>
                )}
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  {(data.tests.holland.result?.scores || []).map((item: any) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span>{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.tests.disc && (
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="font-semibold text-slate-800 mb-2">DISC</div>
                <div className="text-slate-700">Tổ hợp: {data.tests.disc.result?.top_code}</div>
                {data.tests.disc.result?.scores && (
                  <div className="mt-4">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: { type: "pie", backgroundColor: "transparent", height: 260 },
                        title: { text: "" },
                        tooltip: { pointFormat: "{point.percentage:.1f}%" },
                        plotOptions: { pie: { innerSize: "55%", dataLabels: { enabled: false } } },
                        series: [
                          {
                            type: "pie",
                            data: data.tests.disc.result.scores.map((s: any) => ({
                              name: s.key,
                              y: s.percent,
                            })),
                          },
                        ],
                      }}
                    />
                  </div>
                )}
                <div className="mt-2 space-y-1 text-sm text-slate-700">
                  {(data.tests.disc.result?.scores || []).map((item: any) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span>{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.tests.ability && (
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="font-semibold text-slate-800 mb-2">Năng lực</div>
                <div className="text-slate-700">
                  Môn: {data.tests.ability.result?.subject} — Kết quả: {data.tests.ability.result?.score}/
                  {data.tests.ability.result?.total}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
