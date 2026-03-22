"use client";

import { useEffect, useState } from "react";
import { Activity, Droplets, AlertTriangle, Server, Loader2 } from "lucide-react";
import { dashboardApi } from "@/lib/dashboardApi";

// Mapping event types to UI styles
const getAlertTheme = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("fall")) return { Icon: AlertTriangle, iconBg: "bg-red-100", iconColor: "text-red-500" };
  if (t.includes("urine") || t.includes("moisture")) return { Icon: Droplets, iconBg: "bg-sky-100", iconColor: "text-sky-600" };
  if (t.includes("connect") || t.includes("system")) return { Icon: Server, iconBg: "bg-gray-100", iconColor: "text-gray-500" };
  return { Icon: Activity, iconBg: "bg-teal-100", iconColor: "text-teal-600" }; // default (movement)
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAlerts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await dashboardApi.getTimelineEvents({ limit: 3 });
      const events = Array.isArray(res.payload) ? res.payload : [];
      // Optionally filter to only high-priority alerts here if limit applies generally
      setAlerts(events.slice(0, 3));
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setError("Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <section className="depth-card p-6 relative overflow-hidden flex flex-col min-h-[160px]">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xl font-bold text-[var(--text)]">Recent Alerts</h3>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-[1rem]">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {error && !loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[1rem]">
           <p className="text-sm font-bold text-red-500">{error}</p>
           <button onClick={fetchAlerts} className="mt-2 text-xs font-semibold text-blue-500 hover:underline">Retry</button>
        </div>
      )}

      {alerts.length === 0 && !loading && !error && (
         <div className="flex-1 flex flex-col items-center justify-center text-gray-400 pt-2 pb-4">
            <AlertTriangle className="w-6 h-6 opacity-20 mb-2" />
            <p className="text-sm font-bold">No active alerts</p>
         </div>
      )}

      <div className="space-y-3 relative z-10">
        {alerts.map((a, idx) => {
          const theme = getAlertTheme(a.type || "Alert");
          // Format time distance or time
          const timeStr = a.timestamp 
            ? new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : "Just now";

          return (
            <div
              key={a.id || idx}
              className="w-full py-3 px-5 rounded-2xl font-bold flex items-center justify-between group text-base bg-bg-card shadow-m text-foreground"
            >
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${theme.iconBg} ${theme.iconColor} shrink-0`}>
                  <theme.Icon className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <span>{a.type || "Activity"}</span>
              </div>
              <span className="text-[var(--text-muted)] font-semibold text-sm">{timeStr}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
