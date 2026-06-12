"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { dashboardApi } from "@/lib/dashboardApi";
import { useDeviceId } from "@/lib/useDeviceId";

const TABS = ["Day", "Week", "Custom"] as const;

// SVG internal coordinate space
const SVG_W = 800;
const SVG_H = 220;
const PAD_TOP = 12;
const PAD_BOTTOM = 32;
const CHART_H = SVG_H - PAD_TOP - PAD_BOTTOM; // 176

// Rendered SVG height in pixels (consistent across SVG and y-axis labels)
const RENDER_H = 260;

export default function TemperatureStatistics() {
  const { deviceId, deviceIdReady } = useDeviceId();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Day");
  const [dataPoints, setDataPoints] = useState<{ xLabel: string; value: number }[]>([]);
  const [yAxis, setYAxis] = useState<{ label: string; minValue: number; maxValue: number; unit: string }>({
    label: "Temperature (°C)", minValue: 36, maxValue: 40, unit: "°C",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);

  const fetchChartData = async (period: string, dateOverride?: string) => {
    if (!deviceId) return;
    setLoading(true);
    setError("");
    try {
      const date = dateOverride ?? selectedDate;
      const params: Record<string, string> = {
        deviceId,
        metric: "temp",
        period: period === "Custom" ? "custom" : period === "Week" ? "week" : "day",
        date,
      };
      if (period === "Custom") {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const res = await dashboardApi.getTimelineVitals(params);

      // Unwrap various envelope shapes
      const raw = res?.data ?? res;
      let pts: any[] = [];
      if (Array.isArray(raw?.points)) pts = raw.points;
      else if (Array.isArray(raw?.vitals)) pts = raw.vitals;
      else if (Array.isArray(raw?.data)) pts = raw.data;
      else if (Array.isArray(raw)) pts = raw;

      const points = pts.map((p: any) => ({
        xLabel: p.xLabel ?? p.label ?? p.time ?? "",
        value: Number(p.value ?? p.temperature ?? p.temp ?? p.skinTemp ?? 0),
      }));

      setDataPoints(points);
      if (raw?.yAxis) setYAxis(raw.yAxis);
    } catch (err: any) {
      console.error("Failed to load timeline vitals:", err);
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deviceId) fetchChartData(activeTab);
    else if (deviceIdReady) setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, deviceId, deviceIdReady, selectedDate]);

  // Y helpers
  const yMin = yAxis.minValue;
  const yMax = yAxis.maxValue;
  const yRange = yMax - yMin || 1;

  const toY = (val: number) =>
    PAD_TOP + (1 - (val - yMin) / yRange) * CHART_H;

  // 6 evenly-spaced Y labels, top→bottom
  const yLabels = Array.from({ length: 6 }, (_, i) =>
    (yMax - (i / 5) * yRange).toFixed(1)
  );

  // Y label positions as % of rendered height so the outer div can pin them
  // Each label sits at the same visual Y as the grid line it annotates.
  // Grid lines are at 0%, 20%, 40%, 60%, 80%, 100% of the chart area.
  const yLabelYs = Array.from({ length: 6 }, (_, i) => {
    const svgY = PAD_TOP + (i / 5) * CHART_H;
    return (svgY / SVG_H) * RENDER_H; // visual pixel position
  });

  // Build SVG paths
  let curvePath = "";
  let areaPath = "";

  if (dataPoints.length === 1) {
    const y = toY(dataPoints[0].value);
    curvePath = `M0,${y} L${SVG_W},${y}`;
    areaPath = `M0,${y} L${SVG_W},${y} L${SVG_W},${SVG_H} L0,${SVG_H} Z`;
  } else if (dataPoints.length > 1) {
    const pts = dataPoints.map((d, i) => ({
      x: (i / (dataPoints.length - 1)) * SVG_W,
      y: toY(d.value),
    }));

    // Smooth monotone Bezier through points
    let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpX = ((prev.x + curr.x) / 2).toFixed(1);
      d += ` C${cpX},${prev.y.toFixed(1)} ${cpX},${curr.y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
    }
    curvePath = d;
    areaPath = `${d} L${SVG_W},${SVG_H} L0,${SVG_H} Z`;
  }

  // X labels: up to 5 evenly-spaced from actual data
  const xSlotCount = 5;
  const xLabelsToShow: string[] = dataPoints.length > 0
    ? Array.from({ length: Math.min(xSlotCount, dataPoints.length) }, (_, i) => {
        const idx = Math.round(i * (dataPoints.length - 1) / Math.max(Math.min(xSlotCount, dataPoints.length) - 1, 1));
        return dataPoints[idx]?.xLabel ?? "";
      })
    : (activeTab === "Week"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : ["00:00", "06:00", "12:00", "18:00", "24:00"]);

  return (
    <section className="relative">
      <h2 className="text-2xl font-bold text-[var(--text)] mb-5">Temperature Statistics</h2>

      {/* Controls */}
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

        {activeTab === "Custom" ? (
          <div className="flex items-center gap-2 depth-panel px-4 py-2 rounded-xl">
            <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="text-sm font-bold text-[var(--text)] bg-transparent outline-none" />
            <span className="text-[var(--text-muted)] text-sm">→</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="text-sm font-bold text-[var(--text)] bg-transparent outline-none" />
            <button onClick={() => fetchChartData("Custom")}
              className="ml-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">
              Apply
            </button>
          </div>
        ) : (
          <div className="depth-panel relative flex items-center rounded-xl overflow-hidden">
            <Calendar className="absolute left-3 w-4 h-4 text-[var(--text-muted)] pointer-events-none z-10" />
            <input type="date" value={selectedDate} max={new Date().toISOString().split("T")[0]}
              onChange={e => { if (e.target.value) setSelectedDate(e.target.value); }}
              className="pl-9 pr-4 py-2.5 text-sm font-bold text-[var(--text)] bg-transparent cursor-pointer outline-none border-none [color-scheme:light] w-40" />
          </div>
        )}
      </div>

      {/* Chart card */}
      <div className="depth-card p-6 relative overflow-hidden flex flex-col gap-4">
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

        <div className={`flex gap-3 transition-opacity duration-300 ${loading ? "opacity-30" : "opacity-100"}`}>
          {/* Y-axis labels — absolutely positioned to align with SVG grid lines */}
          <div className="relative shrink-0 w-10 pr-2" style={{ height: RENDER_H }}>
            {yLabels.map((v, i) => (
              <span
                key={v}
                className="absolute right-2 text-[11px] font-bold text-[var(--text-muted)] select-none -translate-y-1/2"
                style={{ top: yLabelYs[i] }}
              >
                {v}
              </span>
            ))}
          </div>

          <div className="flex-1 min-w-0">
            {/* SVG chart — preserveAspectRatio="none" fills the container exactly */}
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              preserveAspectRatio="none"
              className="w-full block"
              style={{ height: RENDER_H }}
            >
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines aligned with y labels */}
              {Array.from({ length: 6 }, (_, i) => {
                const gy = PAD_TOP + (i / 5) * CHART_H;
                return (
                  <line key={i} x1="0" y1={gy} x2={SVG_W} y2={gy}
                    stroke="#e5e7eb" strokeWidth="1" strokeDasharray="6,4" />
                );
              })}

              {/* Filled area */}
              {areaPath && <path d={areaPath} fill="url(#tempGrad)" />}

              {/* Curve */}
              {curvePath && (
                <path d={curvePath} fill="none" stroke="#ef4444"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              )}

              {/* Data dots — only show if ≤ 24 points (too many = cluttered) */}
              {dataPoints.length <= 24 && dataPoints.map((d, i) => {
                const x = dataPoints.length > 1 ? (i / (dataPoints.length - 1)) * SVG_W : SVG_W / 2;
                const y = toY(d.value);
                return <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#ef4444" strokeWidth="2" />;
              })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between px-1 mt-2 text-[11px] font-bold text-[var(--text-muted)] select-none">
              {xLabelsToShow.map((t, i) => <span key={i}>{t}</span>)}
            </div>

            <div className="text-[11px] font-bold text-[var(--text-muted)] mt-3 text-center tracking-widest uppercase">
              {yAxis.label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
