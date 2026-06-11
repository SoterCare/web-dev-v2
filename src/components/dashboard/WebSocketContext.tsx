"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { parseToUnixMs } from "@/lib/timeUtils";
import type { RecentAlert } from "@/types/dashboard";

const SOCKET_URL = "https://unlikely-caryn-sotercare-873e6112.koyeb.app/realtime";
const STORAGE_KEY = "sotercare_deviceId";
const BC_CHANNEL = "sotercare_alerts";

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

interface WebSocketContextValue {
  vitals: VitalsPayload | null;
  latestLog: any | null;
  latestAlertNew: RecentAlert | null;
  latestAlertAttended: AlertAttendedPayload | null;
  latestAlertDismissed: AlertDismissedPayload | null;
  latestAlertUpdated: AlertUpdatedPayload | null;
  isConnected: boolean;
  error: string | null;
  deviceId: string | null;
  postAlertAction: (type: "alert.attended" | "alert.dismissed", id: string) => void;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  vitals: null,
  latestLog: null,
  latestAlertNew: null,
  latestAlertAttended: null,
  latestAlertDismissed: null,
  latestAlertUpdated: null,
  isConnected: false,
  error: null,
  deviceId: null,
  postAlertAction: () => {},
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [vitals, setVitals] = useState<VitalsPayload | null>(null);
  const [latestLog, setLatestLog] = useState<any | null>(null);
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

  const bcRef = useRef<BroadcastChannel | null>(null);
  const socketRef = useRef<any>(null);

  // Fetch JWT once
  useEffect(() => {
    fetch("/api/auth/token")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.token && setToken(d.token))
      .catch(() => {});
  }, []);

  // BroadcastChannel — listen for cross-tab actions
  useEffect(() => {
    if (typeof window === "undefined") return;
    const bc = new BroadcastChannel(BC_CHANNEL);
    bcRef.current = bc;

    bc.onmessage = (ev) => {
      const { type, id, deviceId: dId = "" } = ev.data ?? {};
      if (type === "alert.attended")
        setLatestAlertAttended({ id, deviceId: dId });
      if (type === "alert.dismissed")
        setLatestAlertDismissed({ id, deviceId: dId });
    };

    return () => {
      bc.close();
      bcRef.current = null;
    };
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
      if (active) setDeviceId(id);
    };

    socket.on("connect", () => {
      if (!active) return;
      setIsConnected(true);
      setError(null);
      // Subscribe with whatever deviceId is known at connect time
      const storedId = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (storedId) socket.emit("subscribe", { deviceId: storedId });
    });

    // Vitals / log ingestion
    const handleLogsIngested = (data: any) => {
      if (!active) return;
      try {
        if (data?.device_id) persistDevice(data.device_id);

        const log =
          data?.logs && data.logs.length > 0
            ? data.logs[data.logs.length - 1]
            : data;

        setLatestLog(log);

        setVitals((prev) => ({
          ...(prev || {}),
          skinTemp: log.temperature ?? log.skinTemp,
          roomTemp: log.ambient_temp ?? log.roomTemp,
          moisture: log.moisture,
          gaitLabel: log.gait_label ?? log.gaitLabel,
          timestamp: parseToUnixMs(log.timestamp ?? log.ts),
          device_id: data?.device_id,
          fall_alert: log.fall_alert,
          sos: log.sos,
        }));
      } catch (e) {
        console.error("[Socket.IO] Parsing error:", e);
      }
    };

    socket.on("vitals_update", handleLogsIngested);
    socket.on("device.logs.ingested", handleLogsIngested);

    // Alert lifecycle events
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

  // Emit subscribe whenever deviceId resolves or changes (without recreating socket)
  useEffect(() => {
    if (!deviceId || !socketRef.current?.connected) return;
    socketRef.current.emit("subscribe", { deviceId });
  }, [deviceId]);

  const postAlertAction = (type: "alert.attended" | "alert.dismissed", id: string) => {
    bcRef.current?.postMessage({ type, id, deviceId });
  };

  return (
    <WebSocketContext.Provider
      value={{
        vitals,
        latestLog,
        latestAlertNew,
        latestAlertAttended,
        latestAlertDismissed,
        latestAlertUpdated,
        isConnected,
        error,
        deviceId,
        postAlertAction,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useDashboardWebSocket = () => useContext(WebSocketContext);
