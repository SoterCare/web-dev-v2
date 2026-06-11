"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Droplets, AlertTriangle, Phone, Loader2, History, RotateCcw } from "lucide-react";
import { dashboardApi } from "@/lib/dashboardApi";
import { useDashboardWebSocket } from "@/components/dashboard/WebSocketContext";
import { parseToUnixMs, relativeTime } from "@/lib/timeUtils";

interface DismissedItem {
  id: string;
  type: string;
  title: string;
  timestamp: number;
}

const getTheme = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("fall")) return { Icon: AlertTriangle, iconBg: "bg-[#FF9D93]", iconColor: "text-red-900" };
  if (t.includes("help") || t.includes("sos") || t.includes("help_call")) return { Icon: Phone, iconBg: "bg-[#FED7AA]", iconColor: "text-orange-900" };
  if (t.includes("urine") || t.includes("moisture")) return { Icon: Droplets, iconBg: "bg-[#91D7E4]", iconColor: "text-blue-900" };
  return { Icon: Activity, iconBg: "bg-[#42dfdf]", iconColor: "text-cyan-950" };
};

function unwrap(res: any): any[] {
  const raw = res?.data ?? res;
  const data = raw?.data ?? raw;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function RecycleBinPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { latestAlertDismissed } = useDashboardWebSocket();

  const [items, setItems] = useState<DismissedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await dashboardApi.getDismissedAlerts();
      const list = unwrap(res);
      setItems(
        list.map((item: any) => ({
          id: String(item.id),
          type: item.type ?? "movement",
          title: item.title ?? "Dismissed Alert",
          timestamp: parseToUnixMs(item.timestamp ?? item.time ?? item.createdAt),
        }))
      );
    } catch {
      setError("Failed to load dismissed alerts.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on every route entry
  useEffect(() => {
    fetchItems();
  }, [pathname]);

  // Re-fetch when any client dismisses an alert (new item may have appeared)
  useEffect(() => {
    if (latestAlertDismissed) fetchItems();
  }, [latestAlertDismissed]);

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    try {
      await dashboardApi.restoreAlert(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.push("/dashboard/timeline");
    } catch {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="depth-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-6 h-6 text-[var(--text-muted)]" />
          <h2 className="text-2xl font-bold text-[var(--text)]">Recycle Bin</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-red-500 gap-2">
            <p className="text-sm font-bold">{error}</p>
            <button onClick={fetchItems} className="text-xs font-semibold text-blue-500 hover:underline">Retry</button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400">
            <History className="w-10 h-10 opacity-20 mb-3" />
            <p className="text-sm font-bold">Recycle bin is empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const theme = getTheme(item.type);
              const isRestoring = restoringId === item.id;
              return (
                <div key={item.id} className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50/60 border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${theme.iconBg} ${theme.iconColor}`}>
                      {isRestoring
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <theme.Icon className="w-4 h-4" strokeWidth={2.5} />
                      }
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#4A4A4A] font-semibold text-[15px]">{item.title}</span>
                      <span className="text-[var(--text-muted)] text-xs font-medium">{relativeTime(item.timestamp)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRestore(item.id)}
                    disabled={isRestoring}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#42dfdf] border border-[#42dfdf]/30 hover:bg-[#42dfdf]/10 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restore
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
