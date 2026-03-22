"use client";

import { useEffect, useState } from "react";
import { Activity, Droplets, AlertTriangle, Server, Loader2 } from "lucide-react";
import { dashboardApi } from "@/lib/dashboardApi";

// Mapping event types to UI styles
const getEventTheme = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("fall")) return { Icon: AlertTriangle, nodeBg: "bg-[#f87171]", pillBg: "bg-[#fee2e2]", pillText: "text-[#b91c1c]" };
  if (t.includes("urine") || t.includes("moisture")) return { Icon: Droplets, nodeBg: "bg-[#93c5fd]", pillBg: "bg-[#dbeafe]", pillText: "text-[#1e40af]" };
  if (t.includes("connect") || t.includes("system")) return { Icon: Server, nodeBg: "bg-[#9ca3af]", pillBg: "bg-[#f3f4f6]", pillText: "text-[#374151]" };
  return { Icon: Activity, nodeBg: "bg-[#2dd4bf]", pillBg: "bg-[#ccfbf1]", pillText: "text-[#0f766e]" }; // default (movement)
};

export default function ActivityTimeline() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await dashboardApi.getTimelineEvents();
      setEvents(Array.isArray(res.payload) ? res.payload : []);
    } catch (err) {
      console.error("Failed to load timeline events:", err);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <section className="flex-1 flex flex-col relative">
      <div className="depth-card p-6 flex-1 flex flex-col relative overflow-hidden">
        <h3 className="text-xl font-bold text-[var(--text)] mb-5">Activity Timeline</h3>

        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-[1rem]">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[1rem]">
            <p className="text-sm font-bold text-red-500">{error}</p>
            <button onClick={fetchEvents} className="mt-2 text-xs font-semibold text-blue-500 hover:underline">Retry</button>
          </div>
        )}

        {events.length === 0 && !loading && !error ? (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Activity className="w-8 h-8 opacity-20 mb-3" />
              <p className="text-sm font-bold">No recent activities</p>
           </div>
        ) : (
          <div className="relative flex-1 flex flex-col">
            <div
              className="absolute bg-gray-200"
              style={{ left: 22, top: 24, bottom: 24, width: 2 }}
            />
            <div className="flex flex-col gap-0 overflow-y-auto flex-1 min-h-[300px] pr-1 slim-scroll overscroll-contain">
              {events.map((ev, idx) => {
                const theme = getEventTheme(ev.type || "Event");
                const timeStr = ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently";
                
                return (
                  <div key={ev.id || idx}>
                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow ${theme.nodeBg}`}
                        style={{ border: "3px solid var(--bg-card)" }}
                      >
                        <theme.Icon className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div
                        className={`flex-1 flex items-center justify-between px-5 py-3.5 rounded-2xl ${theme.pillBg} ${theme.pillText}`}
                      >
                        <span className="font-bold text-[15px]">{ev.type || "Activity"}</span>
                        <span className="text-sm font-semibold opacity-60 ml-4 whitespace-nowrap">{timeStr}</span>
                      </div>
                    </div>
                    {ev.sub ? (
                      <div className="pl-16 py-3 flex flex-col gap-1">
                        {Array.isArray(ev.sub) ? ev.sub.map((txt: string, i: number) => (
                          <p key={i} className="text-[11px] font-semibold text-[var(--text-muted)] text-center">
                            {txt}
                          </p>
                        )) : (
                          <p className="text-[11px] font-semibold text-[var(--text-muted)] text-center">{ev.sub}</p>
                        )}
                      </div>
                    ) : (
                      idx < events.length - 1 && <div className="h-3" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
