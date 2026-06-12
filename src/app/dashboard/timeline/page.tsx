"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Activity, AlertTriangle, Droplets, Phone, Server, Loader2, Filter } from "lucide-react";
import { dashboardApi } from "@/lib/dashboardApi";
import { useDeviceId } from "@/lib/useDeviceId";
import { useDashboardWebSocket } from "@/components/dashboard/WebSocketContext";
import { parseToUnixMs, toTimeStr } from "@/lib/timeUtils";

type Period = "day" | "month";
type FilterType = "all" | "movement" | "fall" | "urine";

const getEventTheme = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("fall")) return { bg: "bg-[#fee2e2]", text: "text-[#b91c1c]", dot: "bg-[#f87171]", Icon: AlertTriangle };
  if (t.includes("help") || t.includes("sos") || t.includes("help_call")) return { bg: "bg-[#ffedd5]", text: "text-[#9a3412]", dot: "bg-[#fb923c]", Icon: Phone };
  if (t.includes("urine") || t.includes("moisture")) return { bg: "bg-[#dbeafe]", text: "text-[#1e40af]", dot: "bg-[#93c5fd]", Icon: Droplets };
  if (t.includes("connect") || t.includes("system")) return { bg: "bg-[#f3f4f6]", text: "text-[#374151]", dot: "bg-[#9ca3af]", Icon: Server };
  return { bg: "bg-[#ccfbf1]", text: "text-[#0f766e]", dot: "bg-[#2dd4bf]", Icon: Activity };
};

export default function TimelinePage() {
  const pathname = usePathname();
  const { deviceId, deviceIdReady } = useDeviceId();
  const { latestAlertAttended, latestAlertUpdated } = useDashboardWebSocket();

  const [period, setPeriod] = useState<Period>("day");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    if (!deviceId) { setLoading(false); return; }
    setLoading(true);
    setError("");
    try {
      const res = await dashboardApi.getTimelineEvents({ deviceId, period, date: selectedDate, filter });
      const raw = res?.data ?? res;
      const result = raw?.data ?? raw;
      let list: any[] = [];
      if (Array.isArray(result)) list = result;
      else if (Array.isArray(result?.events)) list = result.events;
      else if (Array.isArray(result?.items)) list = result.items;
      setEvents(list.map((e: any) => ({ ...e, timestamp: parseToUnixMs(e.timestamp ?? e.ts ?? e.time) })));
    } catch {
      setError("Failed to load timeline.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on every route entry (pathname change) and filter/period/date changes
  useEffect(() => {
    if (deviceId) fetchEvents();
    else if (deviceIdReady) setLoading(false);
  }, [pathname, deviceId, deviceIdReady, period, selectedDate, filter]);

  // Re-fetch when any client attends an alert
  useEffect(() => { if (latestAlertAttended) fetchEvents(); }, [latestAlertAttended]);
  useEffect(() => {
    if (latestAlertUpdated?.status === "attended") fetchEvents();
  }, [latestAlertUpdated]);

  const FILTERS: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "movement", label: "Movement" },
    { value: "fall", label: "Fall" },
    { value: "urine", label: "Urine" },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="depth-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-[var(--text)]">Timeline</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Period */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              {(["day", "month"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${period === p ? "bg-[var(--text)] text-[var(--bg-body)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Date */}
            <input
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-gray-50 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[#42dfdf]"
            />

            {/* Filter */}
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-1 py-1">
              <Filter className="w-4 h-4 text-gray-400 ml-1 shrink-0" />
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filter === f.value ? "bg-[#42dfdf] text-cyan-950" : "text-gray-500 hover:text-gray-800"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline list */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[240px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[240px] text-red-500 gap-2">
            <p className="text-sm font-bold">{error}</p>
            <button onClick={fetchEvents} className="text-xs font-semibold text-blue-500 hover:underline">Retry</button>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[240px] text-gray-400">
            <Activity className="w-10 h-10 opacity-20 mb-3" />
            <p className="text-sm font-bold">No attended alerts for this period</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bg-gray-200" style={{ left: 23, top: 24, bottom: 24, width: 2 }} />
            <div className="flex flex-col gap-0 overflow-y-auto max-h-[600px] pr-2 slim-scroll overscroll-contain">
              {events.map((ev, idx) => {
                const displayType = ev.label || ev.type || "Activity";
                const theme = getEventTheme(ev.type || displayType);
                return (
                  <div key={ev.id || idx}>
                    <div className="flex items-center gap-4 relative z-10">
                      <div
                        className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow ${theme.dot}`}
                        style={{ border: "3px solid var(--bg-card)" }}
                      >
                        <theme.Icon className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className={`flex-1 flex items-center justify-between px-5 py-3.5 rounded-2xl ${theme.bg} ${theme.text}`}>
                        <span className="font-bold text-[15px]">{displayType}</span>
                        <span className="text-sm font-semibold opacity-60 ml-4 whitespace-nowrap">{toTimeStr(ev.timestamp)}</span>
                      </div>
                    </div>
                    {idx < events.length - 1 && <div className="h-3" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
