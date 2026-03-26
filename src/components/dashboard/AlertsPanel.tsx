"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Activity, Droplets, AlertTriangle, Phone, ChevronDown, CheckCircle, XCircle, Loader2, Trash2, History, RotateCcw } from "lucide-react";
import { dashboardApi } from "@/lib/dashboardApi";
import { useDashboardWebSocket } from "./WebSocketContext";
import { useDeviceId } from "@/lib/useDeviceId";

// Define the exact Alert interface based on the mobile app documentation
interface AlertRecord {
  id: string;
  type: string;
  title: string;
  timestamp: string | number;
}

// Map types to exact official visual requirements
const getAlertTheme = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("fall")) {
    return { Icon: AlertTriangle, iconBg: "bg-[#FF9D93]", iconColor: "text-red-900" };
  }
  if (t.includes("help") || t.includes("sos") || t.includes("help_call")) {
    return { Icon: Phone, iconBg: "bg-[#FED7AA]", iconColor: "text-orange-900" };
  }
  if (t.includes("urine") || t.includes("moisture")) {
    return { Icon: Droplets, iconBg: "bg-[#91D7E4]", iconColor: "text-blue-900" };
  }
  // Default: movement / routine
  return { Icon: Activity, iconBg: "bg-[#42dfdf]", iconColor: "text-cyan-950" };
};

// Relative time formatter mimicking strict "5s ago", "12m ago" logic
function getRelativeTime(timestamp: string | number): string {
  if (!timestamp) return "Just now";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Unknown time";
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${Math.max(0, diffSec)}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

// Extracted AlertCard to safely host its own local timer and expanded state hook
function AlertCard({ alert, onAction }: { alert: AlertRecord, onAction: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [relativeTime, setRelativeTime] = useState(() => getRelativeTime(alert.timestamp));
  const theme = getAlertTheme(alert.type);

  useEffect(() => {
    // Re-run the relative timestamp calc every 30 seconds
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(alert.timestamp));
    }, 30000);
    return () => clearInterval(interval);
  }, [alert.timestamp]);

  const handleAction = async (actionType: "attend" | "false" | "dismiss") => {
    setLoading(true);
    try {
      if (actionType === "attend") {
        await dashboardApi.attendAlert(alert.id);
      } else if (actionType === "false") {
        await dashboardApi.markFalseAlarm(alert.id);
      } else {
        await dashboardApi.dismissAlert(alert.id);
      }
      onAction(alert.id);
    } catch (err) {
      console.error(`Failed to mark alert as ${actionType}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => !loading && setExpanded(!expanded)}
      className={`w-full flex flex-col px-5 py-4 rounded-2xl bg-bg-card shadow-m text-foreground cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-200 ${loading ? "opacity-60 pointer-events-none" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.iconBg} ${theme.iconColor} shrink-0`}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <theme.Icon className="w-5 h-5" strokeWidth={2.5} />}
          </div>
          <div className="flex flex-col">
            <span className="text-[#4A4A4A] font-semibold text-[15px]">{alert.title}</span>
            <span className="text-[var(--text-muted)] font-medium text-xs">{relativeTime}</span>
          </div>
        </div>
        {!expanded && <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>

      {expanded && (
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); handleAction("attend"); }}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-bold bg-[#42dfdf] text-cyan-950 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" /> Attended
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleAction("false"); }}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" /> False
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleAction("dismiss"); }}
            disabled={loading}
            className="flex-none p-2 rounded-xl bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 hover:shadow-sm disabled:opacity-50"
            title="Dismiss"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function AlertsPanel() {
  const { deviceId, deviceIdReady } = useDeviceId();
  const { latestLog } = useDashboardWebSocket();
  // EXPLICIT LOGIC: Real-time update list using Array State (Prepending Pattern)
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<AlertRecord[]>([]);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDismissed, setLoadingDismissed] = useState(false);
  const [error, setError] = useState("");

  const fetchAlerts = async () => {
    if (!deviceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Historical Data Rest Query (limit 20)
      const res = await dashboardApi.getRecentAlerts({ deviceId, limit: 20 });
      const rawEvents = Array.isArray(res) ? res : (res.data?.alerts || res.alerts || res.data || res.payload || []);

      const mapped = rawEvents.map((a: any) => ({
        id: String(a.id || Math.random()),
        type: a.type || "movement",
        title: a.title || a.label || "Activity Event",
        timestamp: a.timestamp || Date.now(),
      }));

      // Initial state sync
      setAlerts(mapped.slice(0, 20));
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setError("Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDismissed = async () => {
    setLoadingDismissed(true);
    try {
      const res = await dashboardApi.getDismissedAlerts();
      const raw = res.data?.items || res.items || res.data || [];
      const mapped = raw.map((a: any) => ({
        id: a.id,
        type: a.type || "movement",
        title: a.title || "Dismissed Alert",
        timestamp: a.time || a.timestamp || Date.now(),
      }));
      setDismissedAlerts(mapped);
    } catch (err) {
      console.error("Failed to fetch dismissed alerts:", err);
    } finally {
      setLoadingDismissed(false);
    }
  };

  useEffect(() => {
    if (deviceId) {
      fetchAlerts();
    } else if (deviceIdReady) {
      setLoading(false);
    }
  }, [deviceId, deviceIdReady]);

  useEffect(() => {
    if (showRecycleBin) {
      fetchDismissed();
    }
  }, [showRecycleBin]);

  // THE MAGIC STEP: Client-Side State Injection (Prepend Logic)
  useEffect(() => {
    // 1. Listen for pushed events (latestLog from context)
    if (!latestLog) return;

    // 2. Check for boolean flags (fall_alert or sos)
    if (latestLog.fall_alert || latestLog.sos) {

      // 3. Construct new alert object
      const newAlert: AlertRecord = {
        id: `live_${latestLog.timestamp || Date.now()}`,
        type: latestLog.fall_alert ? 'fall' : 'movement',
        title: latestLog.fall_alert ? 'Fall Detected' : 'SOS Emergency',
        timestamp: latestLog.timestamp || Date.now()
      };

      // 4. Prepend to array state and slice (Keep top 20)
      setAlerts((prev) => {
        // Simple deduplication check based on ID or Timestamp to prevent UI flickers
        if (prev.some(a => a.id === newAlert.id)) return prev;
        return [newAlert, ...prev].slice(0, 20);
      });

      console.log("[Socket.IO] Real-time alert prepended:", newAlert);
    }
  }, [latestLog]);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const restoreAlert = async (id: string) => {
    try {
      await dashboardApi.restoreAlert(id);
      // Refresh both lists
      setDismissedAlerts(prev => prev.filter(a => a.id !== id));
      fetchAlerts();
    } catch (err) {
      console.error("Failed to restore alert:", err);
    }
  };

  return (
    <section className="depth-card p-6 relative flex flex-col min-h-[160px]">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xl font-bold text-[var(--text)]">{showRecycleBin ? "Dismissed Alerts" : "Recent Alerts"}</h3>
        <button
          onClick={() => setShowRecycleBin(!showRecycleBin)}
          className={`p-2 rounded-xl transition-all ${showRecycleBin ? "bg-[#42dfdf] text-cyan-950" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          title={showRecycleBin ? "Hide Recycle Bin" : "View Recycle Bin"}
        >
          {showRecycleBin ? <History className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
        </button>
      </div>

      {showRecycleBin ? (
        <div className="flex-1 flex flex-col min-h-[200px]">
          {loadingDismissed ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
          ) : dismissedAlerts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60">
              <History className="w-8 h-8 mb-2" />
              <p className="text-sm font-bold">No dismissed alerts</p>
            </div>
          ) : (
            <div className="space-y-3 slim-scroll overflow-y-auto max-h-[240px] pr-2">
              {dismissedAlerts.map(alert => {
                const theme = getAlertTheme(alert.type);
                return (
                  <div key={alert.id} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.iconBg} ${theme.iconColor} shrink-0`}>
                        <theme.Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#6A6A6A] font-medium text-sm line-clamp-1">{alert.title}</span>
                        <span className="text-gray-400 text-[10px]">{getRelativeTime(alert.timestamp)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => restoreAlert(alert.id)}
                      className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-[#42dfdf] transition-all"
                      title="Restore"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {loading && alerts.length === 0 && (
            <div className="absolute inset-x-6 top-[88px] bottom-6 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}

          {error && alerts.length === 0 && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <p className="text-sm font-bold text-red-500 mb-2">{error}</p>
              <button onClick={fetchAlerts} className="text-xs font-semibold text-blue-500 hover:underline">Retry</button>
            </div>
          )}

          {alerts.length === 0 && !loading && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 pt-2 pb-4">
              <AlertTriangle className="w-6 h-6 opacity-20 mb-2" />
              <p className="text-sm font-bold">No active alerts</p>
            </div>
          )}

          <div className="space-y-3 relative z-10 slim-scroll overflow-y-auto max-h-[240px] pr-2 pt-1 pb-1">
            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} onAction={removeAlert} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
