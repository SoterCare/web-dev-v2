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
import type { RecentAlert } from "@/types/dashboard";

const SOCKET_URL = "https://unlikely-caryn-sotercare-873e6112.koyeb.app/realtime";
const STORAGE_KEY = "sotercare_deviceId";
const BC_CHANNEL = "sotercare_alerts";

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

export interface AlertUpdatedPayload {
  id: string;
  status: string;
  deviceId: string;
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
  deviceId: string | null;
  postAlertAction: (type: "alert.attended" | "alert.dismissed", id: string) => void;
}

const AlertEventsContext = createContext<AlertEventsContextValue>({
  latestAlertNew: null,
  latestAlertAttended: null,
  latestAlertDismissed: null,
  latestAlertUpdated: null,
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
      const storedId = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (storedId) socket.emit("subscribe", { deviceId: storedId });
    });

    // High-frequency vitals + synthesise alert events from log flags
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

        // Synthesise alert events — written to AlertEventsContext only when flags are set
        const device = data?.device_id ?? deviceIdRef.current ?? "";
        const tsMs = parseToUnixMs(log.timestamp ?? log.ts);

        if (log.fall_alert && String(log.fall_alert) !== "0" && String(log.fall_alert) !== "false") {
          if (active) setLatestAlertNew({ id: `fall_${device}_${tsMs}`, type: "fall", title: "Fall Detected", timestamp: tsMs });
        } else if (log.sos && String(log.sos) !== "0" && String(log.sos) !== "false") {
          if (active) setLatestAlertNew({ id: `sos_${device}_${tsMs}`, type: "help_call", title: "Help Call", timestamp: tsMs });
        } else if (Number(log.moisture) > 25) {
          const now = Date.now();
          if (now - lastUrineAlertTs.current >= 5 * 60 * 1000) {
            lastUrineAlertTs.current = now;
            if (active) setLatestAlertNew({ id: `urine_${device}_${tsMs}`, type: "urine", title: "High Moisture Detected", timestamp: tsMs });
          }
        }
      } catch (e) {
        console.error("[Socket.IO] Parsing error:", e);
      }
    };

    socket.on("vitals_update", handleLogsIngested);
    socket.on("device.logs.ingested", handleLogsIngested);

    socket.on("alert.new", (data: any) => {
      if (!active) return;
      const tsMs = parseToUnixMs(data.timestamp ?? data.ts);
      setLatestAlertNew({
        id: data.id || `ws_${data.deviceId}_${tsMs}`,
        type: data.type || "movement",
        title: data.title || "Alert",
        timestamp: tsMs,
      });
    });

    socket.on("alert.attended", (data: AlertAttendedPayload) => {
      if (!active) return;
      setLatestAlertAttended({
        ...data,
        attendedAt: data.attendedAt != null ? parseToUnixMs(data.attendedAt) : undefined,
      });
    });

    socket.on("alert.dismissed", (data: AlertDismissedPayload) => {
      if (!active) return;
      setLatestAlertDismissed(data);
    });

    socket.on("alert.updated", (data: AlertUpdatedPayload) => {
      if (!active) return;
      setLatestAlertUpdated(data);
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
      bcRef.current?.postMessage({ type, id, deviceId: deviceIdRef.current });
    },
    [] // deviceIdRef is a ref, always up to date, no dep needed
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
      deviceId,
      postAlertAction,
    }),
    [latestAlertNew, latestAlertAttended, latestAlertDismissed, latestAlertUpdated, deviceId, postAlertAction]
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
