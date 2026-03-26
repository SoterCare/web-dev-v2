"use client";

import { useEffect, useState } from "react";
import { Activity, Clock, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { dashboardApi } from "@/lib/dashboardApi";
import { useDashboardWebSocket } from "./WebSocketContext";

export default function StatsTimeline() {
  const { deviceId } = useDashboardWebSocket();
  const [vitals, setVitals] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!deviceId) return;
    setLoading(true);
    setError("");
    try {
      const date = new Date().toISOString().split("T")[0];
      const [vitalsRes, eventsRes] = await Promise.all([
        dashboardApi.getTimelineVitals({ deviceId, metric: "temp", period: "day", date }),
        dashboardApi.getRecentAlerts({ deviceId, limit: 10 }) // Using recent alerts for the timeline view
      ]);

      const vitalsData = vitalsRes.data || vitalsRes;
      const eventsData = Array.isArray(eventsRes) ? eventsRes : (eventsRes.data?.alerts || eventsRes.alerts || eventsRes.data || []);
      
      setVitals(vitalsData);
      setTimeline(eventsData);
    } catch (err) {
      console.error("Failed to fetch timeline data:", err);
      setError("Failed to load timeline data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deviceId) {
      fetchData();
    }
  }, [deviceId]);

  const points = vitals?.points || [];
  const yAxis = vitals?.yAxis || { minValue: 35.5, maxValue: 37.5, label: "Temperature (°C)" };
  
  const getCoordinates = (index: number, value: number, width: number, height: number, total: number) => {
    if (total <= 1) return `${width / 2},${height / 2}`;
    const x = (index / (total - 1)) * width;
    const range = yAxis.maxValue - yAxis.minValue || 1;
    const y = height - ((value - yAxis.minValue) / range) * height;
    return `${x},${y}`;
  };

  const polylinePoints = points.length > 1
    ? points.map((p: any, i: number) => getCoordinates(i, p.value, 800, 200, points.length)).join(" ")
    : "";

  return (
    <div className="depth-card bg-white h-full flex flex-col xl:flex-row border border-gray-100 overflow-hidden rounded-2xl">
       {/* Left side: Temperature Chart */}
       <div className="flex-[2] p-6 md:p-8 border-b xl:border-b-0 xl:border-r border-gray-100/50 flex flex-col relative">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-2xl font-bold tracking-tight text-[var(--text)] flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                    {yAxis.label || "Temperature Trend"}
                 </h3>
                 <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
                    {loading ? "Fetching data..." : `Live aggregated data (${vitals?.period || "daily"})`}
                 </p>
              </div>
           </div>
           
           <div className="flex-1 relative w-full bg-gray-50/40 rounded-3xl border border-gray-100 p-6 flex items-end justify-center min-h-[250px]">
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                  <span className="text-xs font-bold text-gray-400">Loading metrics...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center text-red-400 gap-2">
                  <AlertCircle className="w-8 h-8" />
                  <span className="text-xs font-bold">{error}</span>
                  <button onClick={fetchData} className="text-xs text-blue-500 hover:underline">Retry</button>
                </div>
              ) : points.length > 0 ? (
                <svg viewBox="0 -20 800 240" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="800" y2="50" stroke="#f3f4f6" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="0" y1="100" x2="800" y2="100" stroke="#f3f4f6" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="0" y1="150" x2="800" y2="150" stroke="#f3f4f6" strokeWidth="2" strokeDasharray="5,5" />
                  
                  {/* The Line */}
                  {points.length > 1 && (
                    <polyline 
                      fill="none" 
                      stroke="var(--text)" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      points={polylinePoints} 
                      className="drop-shadow-lg"
                    />
                  )}
                  
                  {/* Data Points */}
                  {points.map((p: any, i: number) => {
                     const coords = getCoordinates(i, p.value, 800, 200, points.length);
                     const [cx, cy] = coords.split(",");
                     return (
                       <g key={i}>
                         <circle cx={cx} cy={cy} r="5" fill="white" stroke="var(--text)" strokeWidth="3" className="hover:r-7 transition-all cursor-pointer" />
                         <text x={cx} y={Number(cy) - 15} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#9ca3af">{p.xLabel}</text>
                         <text x={cx} y={Number(cy) + 25} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#4b5563">{p.value}°</text>
                       </g>
                     );
                  })}
                </svg>
              ) : (
                <div className="flex flex-col items-center text-gray-300 gap-2">
                  <TrendingUp className="w-12 h-12 opacity-20" />
                  <span className="text-sm font-bold opacity-40">No data for selected period</span>
                </div>
              )}
           </div>
       </div>

       {/* Right side: Activity Timeline */}
       <div className="flex-1 p-6 md:p-8 bg-gray-50/30 flex flex-col h-[500px] xl:h-auto border-l border-gray-100/50">
           <div className="mb-8 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm border border-indigo-200/50">
                 <Activity className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-xl font-bold tracking-tight text-[var(--text)]">Recent Alerts</h3>
                 <p className="text-sm font-medium text-[var(--text-muted)]">Live activity feed</p>
              </div>
           </div>
           
           <div className="relative pl-6 border-l-2 border-gray-200/60 space-y-8 mt-2 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
              {loading && timeline.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                </div>
              ) : timeline.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                  <Activity className="w-8 h-8 mb-2" />
                  <p className="text-sm font-bold">No events recorded</p>
                </div>
              ) : (
                timeline.map((event, i) => (
                  <div key={event.id || i} className="relative group hover:-translate-y-0.5 transition-transform">
                    <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125 ${event.type.toLowerCase().includes('fall') ? 'bg-red-500' : 'bg-indigo-500'}`} />
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                       <h4 className="font-bold text-[var(--text)] mb-1 text-sm">{event.title}</h4>
                       <div className="flex items-center justify-between text-xs font-bold text-gray-400 mt-2">
                         <span className="flex items-center gap-1">
                           <Clock className="w-3.5 h-3.5" />
                           {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                         <span className="uppercase text-[10px] tracking-wider opacity-60">{event.type}</span>
                       </div>
                    </div>
                  </div>
                ))
              )}
           </div>
       </div>
    </div>
  );
}
