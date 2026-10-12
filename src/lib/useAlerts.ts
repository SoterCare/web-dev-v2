"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dashboardApi } from "@/lib/dashboardApi";
import { useDeviceId } from "@/lib/useDeviceId";
import { useDashboardWebSocket } from "@/components/dashboard/WebSocketContext";
import {
  alertUpdateAction,
  applyAlertRemoved,
  belongsToDevice,
  normaliseRestAlerts,
  reconcileRecent,
  unwrapAlerts,
  visibleAlerts,
} from "@/lib/alertEvents";
import type { RecentAlert } from "@/types/dashboard";

const MAX_VISIBLE = 5;

export function useAlerts() {
  const { deviceId, deviceIdReady } = useDeviceId();
  const {
    latestAlertNew,
    latestAlertAttended,
    latestAlertDismissed,
    latestAlertUpdated,
    connectionEpoch,
    postAlertAction,
  } = useDashboardWebSocket();

  const [restAlerts, setRestAlerts] = useState<RecentAlert[]>([]);
  const [wsAlerts, setWsAlerts] = useState<RecentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // IDs explicitly removed this session — filtered out of every REST response
  // so attended/dismissed alerts don't snap back after the next poll.
  const removedRef = useRef(new Set<string>());

  // Only the latest REST request may write state (poll and reconnect can overlap).
  const requestSeq = useRef(0);

  // Merged, deduped, severity-first then newest-first, THEN capped: a fall is
  // never hidden behind newer moisture alerts (AR-12).
  const alerts = useMemo<RecentAlert[]>(
    () => visibleAlerts(wsAlerts, restAlerts, MAX_VISIBLE),
    [restAlerts, wsAlerts],
  );

  // Ref so effects can read the latest list without stale closures
  const alertsRef = useRef<RecentAlert[]>([]);
  alertsRef.current = alerts;

  const addAlert = useCallback((alert: RecentAlert) => {
    // Skip anything we already removed this session, or another device's alert
    if (removedRef.current.has(alert.id)) return;
    if (!belongsToDevice(alert, deviceId)) return;
    setWsAlerts((prev) => {
      if (prev.some((a) => a.id === alert.id)) return prev;
      return [{ ...alert, receivedAt: alert.receivedAt ?? Date.now() }, ...prev];
    });
  }, [deviceId]);

  // Idempotent: legacy alert.attended/dismissed and canonical alert.updated may
  // both arrive for the same action.
  const removeAlertById = useCallback((id: string) => {
    removedRef.current.add(id);
    setRestAlerts((prev) => applyAlertRemoved(prev, id));
    setWsAlerts((prev) => applyAlertRemoved(prev, id));
  }, []);

  // GET /alerts/recent is the durable source: mount, 15 s poll, socket (re)connect.
  const refreshRestAlerts = useCallback(async () => {
    if (!deviceId) return;
    const seq = ++requestSeq.current;
    const startedAt = Date.now();
    try {
      const res = await dashboardApi.getRecentAlerts({ deviceId, limit: 20 });
      if (seq !== requestSeq.current) return; // a newer request owns the state
      const fetched = normaliseRestAlerts(unwrapAlerts(res));
      const removed = removedRef.current;
      setRestAlerts(reconcileRecent(fetched, [], removed, startedAt).rest);
      setWsAlerts((prev) => reconcileRecent(fetched, prev, removed, startedAt).ws);
      setError("");
    } catch {
      if (seq === requestSeq.current) setError("Failed to load alerts.");
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

  // Reconnect reconciliation: events emitted while the socket was down are not
  // replayed, so refetch the durable list on every (re)connect.
  useEffect(() => {
    if (connectionEpoch > 0 && deviceId) refreshRestAlerts();
  }, [connectionEpoch, deviceId, refreshRestAlerts]);

  // Source B — alert.new WebSocket
  useEffect(() => {
    if (!latestAlertNew) return;
    addAlert(latestAlertNew);
  }, [latestAlertNew, addAlert]);

  // Cross-client sync: remove from list when any client attends / dismisses
  useEffect(() => {
    if (latestAlertAttended) removeAlertById(latestAlertAttended.id);
  }, [latestAlertAttended, removeAlertById]);

  useEffect(() => {
    if (latestAlertDismissed) removeAlertById(latestAlertDismissed.id);
  }, [latestAlertDismissed, removeAlertById]);

  useEffect(() => {
    if (!latestAlertUpdated) return;
    // attended / false_alarm / dismissed remove; other (incl. unknown) statuses are ignored
    if (alertUpdateAction(latestAlertUpdated) === "remove") {
      removeAlertById(latestAlertUpdated.id);
    } else if (latestAlertUpdated.status === "restored") {
      // Restored elsewhere: stop hiding it locally and let REST bring it back.
      removedRef.current.delete(latestAlertUpdated.id);
      refreshRestAlerts();
    }
  }, [latestAlertUpdated, removeAlertById, refreshRestAlerts]);

  // Actions — optimistic only; 15 s poll is the background sync.
  // On failure: immediate rollback (re-add to wsAlerts) so the alert reappears
  // instantly rather than waiting for the next 15 s REST poll.
  const handleAttend = useCallback(
    async (alertId: string) => {
      const snapshot = alertsRef.current.find((a) => a.id === alertId);
      removeAlertById(alertId);
      try {
        await dashboardApi.attendAlert(alertId);
        postAlertAction("alert.attended", alertId);
      } catch {
        removedRef.current.delete(alertId);
        if (snapshot) {
          setWsAlerts((prev) =>
            prev.some((a) => a.id === snapshot.id) ? prev : [{ ...snapshot, receivedAt: Date.now() }, ...prev]
          );
        }
      }
    },
    [removeAlertById, postAlertAction]
  );

  const handleFalseAlarm = useCallback(
    async (alertId: string) => {
      const snapshot = alertsRef.current.find((a) => a.id === alertId);
      removeAlertById(alertId);
      try {
        await dashboardApi.markFalseAlarm(alertId);
        postAlertAction("alert.dismissed", alertId);
      } catch {
        removedRef.current.delete(alertId);
        if (snapshot) {
          setWsAlerts((prev) =>
            prev.some((a) => a.id === snapshot.id) ? prev : [{ ...snapshot, receivedAt: Date.now() }, ...prev]
          );
        }
      }
    },
    [removeAlertById, postAlertAction]
  );

  return { alerts, loading, error, handleAttend, handleFalseAlarm, refreshRestAlerts };
}
