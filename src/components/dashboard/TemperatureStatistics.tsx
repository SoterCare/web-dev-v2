"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronDown, Loader2 } from "lucide-react";
import { dashboardApi } from "@/lib/dashboardApi";

const TABS = ["Day", "Month", "Custom"] as const;

export default function TemperatureStatistics() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Day");
  const [dataPoints, setDataPoints] = useState<{ timestamp: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChartData = async (period: string) => {
    setLoading(true);
    setError("");
    try {
      // Assuming today's date for demonstration, can be dynamic later
      const date = new Date().toISOString().split("T")[0];
      const res = await dashboardApi.getTimelineVitals({ metric: "skinTemp", period: period.toLowerCase(), date });
      
      // Expected structure: { success: true, payload: [{ timestamp, value }, ...] }
      const points = Array.isArray(res.payload) ? res.payload : [];
      setDataPoints(points);
    } catch (err: any) {
      console.error("Failed to load timeline vitals:", err);
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData(activeTab);
  }, [activeTab]);

  // Generate SVG curve
  const width = 800;
  const height = 210; // keep padding
  const yOffset = 20;

  let curve = "M0,200 L800,200"; // flat line fallback
  let yLabels = ["40", "38", "36", "34", "32", "30"];

  if (dataPoints.length > 1) {
    const values = dataPoints.map((d) => Number(d.value));
    const minVal = Math.min(...values, 30);
    const maxVal = Math.max(...values, 40);
    const range = maxVal - minVal;

    // Generate dynamic Y labels
    const step = range / 5 || 2;
    yLabels = Array.from({ length: 6 }, (_, i) => (maxVal - i * step).toFixed(1));

    curve = dataPoints
      .map((d, index) => {
        const x = (index / (dataPoints.length - 1)) * width;
        // Invert Y mapping so higher values are closer to top (0)
        let normalized = (Number(d.value) - minVal) / (range || 1);
        const y = height - (normalized * height) + yOffset;
        return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  return (
    <section className="relative">
      <h2 className="text-2xl font-bold text-[var(--text)] mb-5">Temperature Statistics</h2>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="depth-panel flex items-center p-1 gap-1">
          {TABS.map(tab => (
             <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                 activeTab === tab
                   ? "depth-card text-[var(--text)] shadow-m"
                   : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
             >
               {tab}
             </button>
          ))}
        </div>

        <button className="depth-panel flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--text)]">
          <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
          {new Date().toLocaleDateString("en-GB")}
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
      </div>

      {/* Chart */}
      <div className="depth-card p-6 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-[1rem]">
             <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[1rem]">
             <p className="text-sm font-bold text-red-500">{error}</p>
             <button onClick={() => fetchChartData(activeTab)} className="mt-2 text-xs font-semibold text-blue-500 hover:underline">Retry</button>
          </div>
        )}

        {dataPoints.length === 0 && !loading && !error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
               <p className="text-sm font-bold text-gray-400">No data available for this period.</p>
            </div>
        )}

        <div className={`flex gap-3 transition-opacity duration-300 ${loading ? 'opacity-30' : 'opacity-100'}`}>
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between text-[11px] font-bold text-[var(--text-muted)] pb-6 pr-2 text-right select-none h-[280px]">
            {yLabels.map(v => <span key={v}>{v}</span>)}
          </div>

          <div className="flex-1 relative">
            <svg viewBox="0 0 800 260" className="w-full h-auto overflow-visible" style={{ height: 280 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid */}
              {[50,100,150,200].map(y => (
                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6,4" />
              ))}

              {/* Filled area */}
              <path d={`${curve} L800,260 L0,260 Z`} fill="url(#tempGrad)" />

              {/* Line */}
              <path d={curve} fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between px-1 mt-2 text-[11px] font-bold text-[var(--text-muted)] select-none">
              {activeTab === "Day" && ["00:00","06:00","12:00","18:00","24:00"].map(t => <span key={t}>{t}</span>)}
              {activeTab === "Month" && ["1st","7th","14th","21st","28th"].map(t => <span key={t}>{t}</span>)}
            </div>

            {/* Y label */}
            <div className="text-[11px] font-bold text-[var(--text-muted)] mt-4 text-center tracking-widest uppercase">
              Temperature (°C)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
