"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dashboardApi } from "@/lib/dashboardApi";
import { useDeviceId } from "@/lib/useDeviceId";
import { useDashboardWebSocket } from "@/components/dashboard/WebSocketContext";
import { parseToUnixMs } from "@/lib/timeUtils";
import type { RecentAlert } from "@/types/dashboard";

function normaliseAlerts(list: any[]): RecentAlert[] {
  return list.map((item) => ({
    id: String(item.id ?? Math.random()),
    type: item.type ?? "movement",
    title: item.title ?? item.label ?? "Alert",
    timestamp: parseToUnixMs(item.timestamp ?? item.ts ?? item.createdAt),
    attendedAt:
      item.attendedAt != null ? parseToUnixMs(item.attendedAt) : undefined,
  }));
}

function unwrapAlerts(res: any): any[] {
  // Handle every envelope shape the backend / proxy may return
  const raw = res?.data ?? res;
  if (Array.isArray(raw)) return raw;                     // { data: [...] } or plain [...]
  if (Array.isArray(raw?.alerts)) return raw.alerts;      // { alerts: [...] }
  if (Array.isArray(raw?.items)) return raw.items;        // { items: [...] }
  if (Array.isArray(raw?.payload)) return raw.payload;    // { payload: [...] }
  if (Array.isArray(raw?.data)) return raw.data;          // { data: { data: [...] } }
  return [];
}

export function useAlerts() {
  const { deviceId, deviceIdReady } = useDeviceId();
  const {
    latestLog,
    latestAlertNew,
    latestAlertAttended,
    latestAlertDismissed,
    latestAlertUpdated,
    postAlertAction,
  } = useDashboardWebSocket();

  const [restAlerts, setRestAlerts] = useState<RecentAlert[]>([]);
  const [wsAlerts, setWsAlerts] = useState<RecentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // IDs explicitly removed this session — filtered out of every REST response
  // so attended/dismissed alerts don't snap back after the next poll.
  const removedRef = useRef(new Set<string>());

  // Merged, deduped, newest-first, max 5
  const alerts = useMemo<RecentAlert[]>(() => {
    const all = [...wsAlerts, ...restAlerts];
    const unique = Array.from(new Map(all.map((a) => [a.id, a])).values());
    return unique.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [restAlerts, wsAlerts]);

  // Ref so effects can read the latest list without stale closures
  const alertsRef = useRef<RecentAlert[]>([]);
  alertsRef.current = alerts;

  const addAlert = useCallback((alert: RecentAlert) => {
    // Skip anything we already removed this session
    if (removedRef.current.has(alert.id)) return;
    setWsAlerts((prev) => {
      if (prev.some((a) => a.id === alert.id)) return prev;
      return [alert, ...prev];
    });
  }, []);

  const removeAlertById = useCallback((id: string) => {
    removedRef.current.add(id);
    setRestAlerts((prev) => prev.filter((a) => a.id !== id));
    setWsAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const refreshRestAlerts = useCallback(async () => {
    if (!deviceId) return;
    try {
      const res = await dashboardApi.getRecentAlerts({ deviceId, limit: 20 });
      const all = normaliseAlerts(unwrapAlerts(res));

      // Filter out IDs the user has acted on this session
      const filtered = all.filter((a) => !removedRef.current.has(a.id));
      setRestAlerts(filtered);

      // Drop wsAlerts that REST now has (REST is source of truth after poll),
      // and also drop wsAlerts older than the oldest REST alert to prevent
      // synthesised entries from getting stuck.
      const restIds = new Set(filtered.map((a) => a.id));
      const oldestRestTs =
        filtered.length > 0 ? Math.min(...filtered.map((a) => a.timestamp)) : Date.now();
      setWsAlerts((prev) =>
        prev.filter((a) => !restIds.has(a.id) && a.timestamp > oldestRestTs)
      );

      setError("");
    } catch {
      setError("Failed to load alerts.");
    }
  }, [deviceId]);

  // Mount + 15 s polling
  useEffect(() => {
    if (!deviceId) {
      if (deviceIdReady) setLoading(false);
      return;
    }
    setLoading(true);
    refreshRestAlerts().finally(() => setLoading(false));
    const id = setInterval(refreshRestAlerts, 15_000);
    return () => clearInterval(id);
  }, [deviceId, deviceIdReady, refreshRestAlerts]);

  // Source B — alert.new WebSocket
  useEffect(() => {
    if (!latestAlertNew) return;
    addAlert(latestAlertNew);
  }, [latestAlertNew, addAlert]);

  // Source C — device.logs.ingested: synthesise fall / sos / moisture alerts
  useEffect(() => {
    if (!latestLog || !deviceId) return;
    const log = latestLog;
    const tsMs = parseToUnixMs(log.timestamp ?? log.ts);

    if (log.fall_alert && String(log.fall_alert) !== "0" && String(log.fall_alert) !== "false")
      addAlert({ id: `fall_${deviceId}_${tsMs}`, type: "fall", title: "Fall Detected", timestamp: tsMs });

    if (log.sos && String(log.sos) !== "0" && String(log.sos) !== "false")
      addAlert({ id: `sos_${deviceId}_${tsMs}`, type: "help_call", title: "Help Call", timestamp: tsMs });

    if (Number(log.moisture) > 25) {
      const lastUrine = alertsRef.current.find((a) => a.type === "urine");
      if (!lastUrine || Date.now() - lastUrine.timestamp >= 5 * 60 * 1000)
        addAlert({ id: `urine_${deviceId}_${tsMs}`, type: "urine", title: "High Moisture Detected", timestamp: tsMs });
    }
  }, [latestLog, deviceId, addAlert]);

  // Cross-client sync: remove from list when any client attends / dismisses
  useEffect(() => {
    if (latestAlertAttended) removeAlertById(latestAlertAttended.id);
  }, [latestAlertAttended, removeAlertById]);

  useEffect(() => {
    if (latestAlertDismissed) removeAlertById(latestAlertDismissed.id);
  }, [latestAlertDismissed, removeAlertById]);

  useEffect(() => {
    if (!latestAlertUpdated) return;
    const { status, id } = latestAlertUpdated;
    if (status === "attended" || status === "dismissed" || status === "false_alarm")
      removeAlertById(id);
  }, [latestAlertUpdated, removeAlertById]);

  // Actions
  const handleAttend = useCallback(
    async (alertId: string) => {
      removeAlertById(alertId); // optimistic
      try {
        await dashboardApi.attendAlert(alertId);
        postAlertAction("alert.attended", alertId);
        await refreshRestAlerts();
      } catch {
        // On failure remove from removedRef so REST can restore it
        removedRef.current.delete(alertId);
        await refreshRestAlerts();
      }
    },
    [removeAlertById, refreshRestAlerts, postAlertAction]
  );

  const handleFalseAlarm = useCallback(
    async (alertId: string) => {
      removeAlertById(alertId); // optimistic
      try {
        await Promise.all([
          dashboardApi.markFalseAlarm(alertId),
          dashboardApi.dismissAlert(alertId),
        ]);
        postAlertAction("alert.dismissed", alertId);
        await refreshRestAlerts();
      } catch {
        removedRef.current.delete(alertId);
        await refreshRestAlerts();
      }
    },
    [removeAlertById, refreshRestAlerts, postAlertAction]
  );

  return { alerts, loading, error, handleAttend, handleFalseAlarm, refreshRestAlerts };
}
