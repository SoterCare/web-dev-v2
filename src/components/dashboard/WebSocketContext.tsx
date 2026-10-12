"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { parseToUnixMs } from "@/lib/timeUtils";
import {
  parseAlertNew,
  parseAlertUpdated,
  shouldSynthesize,
  synthesizeAlertFromLog,
} from "@/lib/alertEvents";
import type { RecentAlert } from "@/types/dashboard";

const SOCKET_URL = "https://unlikely-caryn-sotercare-873e6112.koyeb.app/realtime";
const STORAGE_KEY = "sotercare_deviceId";
const BC_CHANNEL = "sotercare_alerts";

// AR-12: the backend emits alert.new for every persisted live alert, so alerts are
// no longer synthesised from device.logs.ingested. NEXT_PUBLIC_ALERT_SYNTHESIS=true
// restores the old client-side synthesis (rollback only; it creates `urine_` ids
// that never exist server-side and cannot be attended).
const SYNTHESIZE_ALERTS = shouldSynthesize(process.env.NEXT_PUBLIC_ALERT_SYNTHESIS);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VitalsPayload {
  skinTemp?: number;
  roomTemp?: number;
  moisture?: number | string;
  gaitLabel?: string;
  timestamp?: number;
  device_id?: string;
  [key: string]: any;
}

export interface AlertAttendedPayload {
  id: string;
  deviceId: string;
  attendedAt?: number;
}

export interface AlertDismissedPayload {
  id: string;
  deviceId: string;
}

/** Canonical alert state change (contracts/v1/alert_updated.schema.json). */
export interface AlertUpdatedPayload {
  id: string;
  status: string;
  deviceId: string;
  at?: number;
  actorUserId?: number | null;
}

// ─── Context A: Vitals — changes on every device log (high frequency) ─────────
// Only VitalsDisplay subscribes to this. AlertsPanel is NOT a consumer.

interface VitalsContextValue {
  vitals: VitalsPayload | null;
  isConnected: boolean;
  error: string | null;
}

const VitalsContext = createContext<VitalsContextValue>({
  vitals: null,
  isConnected: false,
  error: null,
});

// ─── Context B: Alert Events — changes only on actual alert activity ───────────
// AlertsPanel, useAlerts, timeline pages, useDeviceId all consume this.
// Vitals ticks DO NOT cause this context to update.

interface AlertEventsContextValue {
  latestAlertNew: RecentAlert | null;
  latestAlertAttended: AlertAttendedPayload | null;
  latestAlertDismissed: AlertDismissedPayload | null;
  latestAlertUpdated: AlertUpdatedPayload | null;
  /** Increments on every socket connect/reconnect; consumers refetch REST to catch missed events. */
  connectionEpoch: number;
  deviceId: string | null;
  postAlertAction: (type: "alert.attended" | "alert.dismissed", id: string) => void;
}

const AlertEventsContext = createContext<AlertEventsContextValue>({
  latestAlertNew: null,
  latestAlertAttended: null,
  latestAlertDismissed: null,
  latestAlertUpdated: null,
  connectionEpoch: 0,
  deviceId: null,
  postAlertAction: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [vitals, setVitals] = useState<VitalsPayload | null>(null);
  const [latestAlertNew, setLatestAlertNew] = useState<RecentAlert | null>(null);
  const [latestAlertAttended, setLatestAlertAttended] = useState<AlertAttendedPayload | null>(null);
  const [latestAlertDismissed, setLatestAlertDismissed] = useState<AlertDismissedPayload | null>(null);
  const [latestAlertUpdated, setLatestAlertUpdated] = useState<AlertUpdatedPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionEpoch, setConnectionEpoch] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
  );

  // Refs so socket callbacks always see the latest values without stale closures
  const deviceIdRef = useRef(deviceId);
  const lastUrineAlertTs = useRef<number>(0); // moisture dedup

  const bcRef = useRef<BroadcastChannel | null>(null);
  const socketRef = useRef<any>(null);

  // Keep ref in sync with state
  useEffect(() => { deviceIdRef.current = deviceId; }, [deviceId]);

  // Fetch JWT once
  useEffect(() => {
    fetch("/api/auth/token")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.token && setToken(d.token))
      .catch(() => {});
  }, []);

  // BroadcastChannel — sync alert actions across browser tabs
  useEffect(() => {
    if (typeof window === "undefined") return;
    const bc = new BroadcastChannel(BC_CHANNEL);
    bcRef.current = bc;
    bc.onmessage = (ev) => {
      const { type, id, deviceId: dId = "" } = ev.data ?? {};
      if (type === "alert.attended") setLatestAlertAttended({ id, deviceId: dId });
      if (type === "alert.dismissed") setLatestAlertDismissed({ id, deviceId: dId });
    };
    return () => { bc.close(); bcRef.current = null; };
  }, []);

  // Socket.IO — recreate only when token changes
  useEffect(() => {
    if (!token) return;
    let active = true;

    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 15000,
      timeout: 10000,
    });
    socketRef.current = socket;

    const persistDevice = (id: string) => {
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id);
      deviceIdRef.current = id;
      if (active) setDeviceId(id);
    };

    socket.on("connect", () => {
      if (!active) return;
      setIsConnected(true);
      setError(null);
      setConnectionEpoch((n) => n + 1);
      const storedId = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (storedId) socket.emit("subscribe", { deviceId: storedId });
    });

    // High-frequency vitals (+ legacy alert synthesis only when the flag is on)
    const handleLogsIngested = (data: any) => {
      if (!active) return;
      try {
        if (data?.device_id) persistDevice(data.device_id);

        const log =
          data?.logs && data.logs.length > 0
            ? data.logs[data.logs.length - 1]
            : data;

        // Update vitals context (high-frequency, isolated from alert consumers)
        setVitals((prev) => ({
          ...(prev || {}),
          skinTemp: log.temperature ?? log.skinTemp,
          roomTemp: log.ambient_temp ?? log.roomTemp,
          moisture: log.moisture,
          gaitLabel: log.gait_label ?? log.gaitLabel,
          timestamp: parseToUnixMs(log.timestamp ?? log.ts),
          device_id: data?.device_id,
        }));

        if (SYNTHESIZE_ALERTS) {
          const device = data?.device_id ?? deviceIdRef.current ?? "";
          const now = Date.now();
          const out = synthesizeAlertFromLog(log ?? {}, device, lastUrineAlertTs.current, now);
          lastUrineAlertTs.current = out.lastUrineTs;
          if (out.alert && active) setLatestAlertNew({ ...out.alert, deviceId: device || undefined, receivedAt: now });
        }
      } catch (e) {
        console.error("[Socket.IO] Parsing error:", e);
      }
    };

    socket.on("vitals_update", handleLogsIngested);
    socket.on("device.logs.ingested", handleLogsIngested);

    // contracts/v1/alert_new.schema.json — payloads without an id are dropped
    // (they could never be attended); REST reconciliation still picks them up.
    socket.on("alert.new", (data: unknown) => {
      if (!active) return;
      const alert = parseAlertNew(data);
      if (alert) setLatestAlertNew({ ...alert, receivedAt: Date.now() });
    });

    // Legacy aliases (one release). Removal by id is idempotent, so receiving both
    // a legacy event and the canonical alert.updated for one action is harmless.
    socket.on("alert.attended", (data: AlertAttendedPayload) => {
      if (!active || !data?.id) return;
      setLatestAlertAttended({
        ...data,
        attendedAt: data.attendedAt != null ? parseToUnixMs(data.attendedAt) : undefined,
      });
    });

    socket.on("alert.dismissed", (data: AlertDismissedPayload) => {
      if (!active || !data?.id) return;
      setLatestAlertDismissed(data);
    });

    // Canonical state change (contracts/v1/alert_updated.schema.json).
    socket.on("alert.updated", (data: unknown) => {
      if (!active) return;
      const ev = parseAlertUpdated(data);
      if (ev) setLatestAlertUpdated(ev);
    });

    socket.on("disconnect", (reason: string) => {
      if (!active) return;
      setIsConnected(false);
      console.log(`[Socket.IO] Disconnected: ${reason}`);
    });

    socket.on("connect_error", (err: any) => {
      if (!active) return;
      console.error("[Socket.IO] Connection Error:", err.message);
      setError("Real-time connection failed. Historical data is still available.");
    });

    return () => {
      active = false;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  // Emit subscribe whenever deviceId resolves or changes
  useEffect(() => {
    if (!deviceId || !socketRef.current?.connected) return;
    socketRef.current.emit("subscribe", { deviceId });
  }, [deviceId]);

  const postAlertAction = useCallback(
    (type: "alert.attended" | "alert.dismissed", id: string) => {
      const dId = deviceIdRef.current ?? "";
      // Update local tab state immediately so the same tab reacts without waiting
      // for the backend to echo a WS event back (which may be slow or missing).
      if (type === "alert.attended") setLatestAlertAttended({ id, deviceId: dId });
      if (type === "alert.dismissed") setLatestAlertDismissed({ id, deviceId: dId });
      bcRef.current?.postMessage({ type, id, deviceId: dId });
    },
    [] // deviceIdRef is a ref; state setters are stable — no deps needed
  );

  // Memoize each context value independently so unrelated state changes
  // don't re-render the wrong consumers.
  const vitalsValue = useMemo<VitalsContextValue>(
    () => ({ vitals, isConnected, error }),
    [vitals, isConnected, error]
  );

  const alertEventsValue = useMemo<AlertEventsContextValue>(
    () => ({
      latestAlertNew,
      latestAlertAttended,
      latestAlertDismissed,
      latestAlertUpdated,
      connectionEpoch,
      deviceId,
      postAlertAction,
    }),
    [latestAlertNew, latestAlertAttended, latestAlertDismissed, latestAlertUpdated, connectionEpoch, deviceId, postAlertAction]
  );

  return (
    <VitalsContext.Provider value={vitalsValue}>
      <AlertEventsContext.Provider value={alertEventsValue}>
        {children}
      </AlertEventsContext.Provider>
    </VitalsContext.Provider>
  );
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** High-frequency vitals data. Only use in VitalsDisplay. */
export const useVitals = () => useContext(VitalsContext);

/** Alert events + deviceId. Use everywhere else (alerts, timeline, recycle bin). */
export const useDashboardWebSocket = () => useContext(AlertEventsContext);
