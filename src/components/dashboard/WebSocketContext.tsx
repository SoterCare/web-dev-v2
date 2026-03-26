"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export interface VitalsPayload {
  skinTemp?: number;
  roomTemp?: number;
  moisture?: number | string;
  gaitLabel?: string;
  timestamp?: string;
  device_id?: string;
  [key: string]: any;
}

interface WebSocketContextValue {
  vitals: VitalsPayload | null;
  latestLog: any | null;
  isConnected: boolean;
  error: string | null;
  /** deviceId received over WebSocket — useful for real-time components only.
   *  For REST data components, use the useDeviceId() hook instead. */
  deviceId: string | null;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  vitals: null,
  latestLog: null,
  isConnected: false,
  error: null,
  deviceId: null,
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [vitals, setVitals] = useState<VitalsPayload | null>(null);
  const [latestLog, setLatestLog] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const socketRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    const connect = async () => {
      try {
        const res = await fetch("/api/auth/token");
        if (!res.ok) throw new Error("Failed to authenticate Socket.IO");
        const { token } = await res.json();

        if (!active) return;

        const socket = io("wss://backend.sotercare.com/realtime", {
          transports: ["websocket"],
          auth: { token },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          if (!active) return;
          setIsConnected(true);
          setError(null);
          console.log("[Socket.IO] Connected successfully");
        });

        const handleVitalsUpdate = (data: any) => {
          if (!active) return;
          try {
            if (data?.device_id) setDeviceId(data.device_id);

            const logEntry =
              data?.logs && data.logs.length > 0
                ? data.logs[data.logs.length - 1]
                : data;

            setLatestLog(logEntry);

            const mappedPayload: VitalsPayload = {
              skinTemp:
                logEntry.temperature !== undefined
                  ? logEntry.temperature
                  : logEntry.skinTemp,
              roomTemp:
                logEntry.ambient_temp !== undefined
                  ? logEntry.ambient_temp
                  : logEntry.roomTemp,
              moisture: logEntry.moisture,
              gaitLabel: logEntry.gait_label || logEntry.gaitLabel,
              timestamp: logEntry.timestamp,
              device_id: data?.device_id,
              fall_alert: logEntry.fall_alert,
              sos: logEntry.sos,
            };

            setVitals((prev) => ({ ...(prev || {}), ...mappedPayload }));
          } catch (e) {
            console.error("[Socket.IO] Parsing error:", e);
          }
        };

        socket.on("vitals_update", handleVitalsUpdate);
        socket.on("device.logs.ingested", handleVitalsUpdate);

        socket.on("disconnect", (reason: string) => {
          if (!active) return;
          setIsConnected(false);
          console.log(`[Socket.IO] Disconnected: ${reason}`);
        });

        socket.on("connect_error", (err: any) => {
          console.error("[Socket.IO] Connection Error:", err.message);
          if (active) setError("Real-time connection failed. Historical data is still available.");
        });
      } catch (err: any) {
        if (active) setError(err.message || "Failed to initialize Socket.IO");
      }
    };

    connect();

    return () => {
      active = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ vitals, latestLog, isConnected, error, deviceId }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useDashboardWebSocket = () => useContext(WebSocketContext);
