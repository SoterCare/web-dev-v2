"use client";

import { useEffect, useState } from "react";
import { Activity, Droplets, AlertTriangle, Phone, ChevronDown, CheckCircle, XCircle, Loader2, Trash2 } from "lucide-react";
import { useAlerts } from "@/lib/useAlerts";
import { relativeTime } from "@/lib/timeUtils";
import type { RecentAlert } from "@/types/dashboard";

const getAlertTheme = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("fall")) return { Icon: AlertTriangle, iconBg: "bg-[#FF9D93]", iconColor: "text-red-900" };
  if (t.includes("help") || t.includes("sos") || t.includes("help_call")) return { Icon: Phone, iconBg: "bg-[#FED7AA]", iconColor: "text-orange-900" };
  if (t.includes("urine") || t.includes("moisture")) return { Icon: Droplets, iconBg: "bg-[#91D7E4]", iconColor: "text-blue-900" };
  return { Icon: Activity, iconBg: "bg-[#42dfdf]", iconColor: "text-cyan-950" };
};

function AlertCard({ alert, onAttend, onFalse }: {
  alert: RecentAlert;
  onAttend: (id: string) => Promise<void>;
  onFalse: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeStr, setTimeStr] = useState(() => relativeTime(alert.timestamp));
  const theme = getAlertTheme(alert.type);

  useEffect(() => {
    const id = setInterval(() => setTimeStr(relativeTime(alert.timestamp)), 30_000);
    return () => clearInterval(id);
  }, [alert.timestamp]);

  const run = async (action: () => Promise<void>) => {
    setLoading(true);
    try { await action(); } finally { setLoading(false); }
  };

  return (
    <div
      onClick={() => !loading && setExpanded((v) => !v)}
      className={`w-full flex flex-col px-5 py-4 rounded-2xl bg-bg-card shadow-m text-foreground cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-200 ${loading ? "opacity-60 pointer-events-none" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.iconBg} ${theme.iconColor} shrink-0`}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <theme.Icon className="w-5 h-5" strokeWidth={2.5} />}
          </div>
          <div className="flex flex-col">
            <span className="text-[#4A4A4A] font-semibold text-[15px]">{alert.title}</span>
            <span className="text-[var(--text-muted)] font-medium text-xs">{timeStr}</span>
          </div>
        </div>
        {!expanded && <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>

      {expanded && (
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); run(() => onAttend(alert.id)); }}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-bold bg-[#42dfdf] text-cyan-950 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" /> Attended
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); run(() => onFalse(alert.id)); }}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" /> False Alarm
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); run(() => onFalse(alert.id)); }}
            disabled={loading}
            className="flex-none p-2 rounded-xl bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 hover:shadow-sm disabled:opacity-50"
            title="Dismiss to Recycle Bin"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function AlertsPanel() {
  const { alerts, loading, error, handleAttend, handleFalseAlarm, refreshRestAlerts } = useAlerts();

  return (
    <section className="depth-card p-6 relative flex flex-col min-h-[160px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[var(--text)]">Recent Alerts</h3>
        <button
          onClick={refreshRestAlerts}
          className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading && alerts.length === 0 && (
        <div className="absolute inset-x-6 top-[88px] bottom-6 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {error && alerts.length === 0 && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <p className="text-sm font-bold text-red-500 mb-2">{error}</p>
          <button onClick={refreshRestAlerts} className="text-xs font-semibold text-blue-500 hover:underline">Retry</button>
        </div>
      )}

      {alerts.length === 0 && !loading && !error && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 pt-2 pb-4">
          <AlertTriangle className="w-6 h-6 opacity-20 mb-2" />
          <p className="text-sm font-bold">No active alerts</p>
        </div>
      )}

      <div className="space-y-3 slim-scroll overflow-y-auto max-h-[260px] pr-2 pt-1 pb-1">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onAttend={handleAttend}
            onFalse={handleFalseAlarm}
          />
        ))}
      </div>
    </section>
  );
}
