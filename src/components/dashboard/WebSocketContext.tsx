"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { dashboardApi } from "@/lib/dashboardApi";

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

  // Use any to quickly adapt to Socket interface without deep prop typing overhead
  const socketRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    const connect = async () => {
      try {
        // Pre-fetch device context explicitly
        const devicesRes = await dashboardApi.getDevices().catch(() => null);
        if (devicesRes) {
          const list = Array.isArray(devicesRes.devices) ? devicesRes.devices : (Array.isArray(devicesRes.data) ? devicesRes.data : []);
          const rootDev = list[0]?.id || list[0]?.deviceId;
          if (rootDev && active) setDeviceId(rootDev);
        }

        // Fetch token securely from Next.js proxy
        const res = await fetch("/api/auth/token");
        if (!res.ok) throw new Error("Failed to authenticate Socket.IO");
        const { token } = await res.json();

        if (!active) return; // Prevent connecting if component unmounted

        // Connect directly to backend using Socket.IO conventions
        const socket = io("wss://backend.sotercare.com/realtime", {
          transports: ["websocket"],
          auth: {
            token: token
          }
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          if (!active) return;
          setIsConnected(true);
          setError(null);
          console.log("[Socket.IO] Connected successfully");
        });

        // Listen for standard event channels
        const handleVitalsUpdate = (data: any) => {
          if (!active) return;
          try {
            // Extrapolate the root device_id broadcasted by Koyeb
            if (data?.device_id) setDeviceId(data.device_id);

            // The backend emits a { logs: [...] } array instead of a direct object
            const logEntry = data?.logs && data.logs.length > 0 ? data.logs[data.logs.length - 1] : data;

            // Dispatch discrete snapshot immediately to listeners unbothered by formatting changes
            setLatestLog(logEntry);

            // Map the specific snake_case backend keys to our UI React Component keys
            const mappedPayload: VitalsPayload = {
              skinTemp: logEntry.temperature !== undefined ? logEntry.temperature : logEntry.skinTemp,
              roomTemp: logEntry.ambient_temp !== undefined ? logEntry.ambient_temp : logEntry.roomTemp,
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
          console.error("[Socket.IO] Authentication or Network Error:", err.message);
          if (active) setError("Real-time connection failed.");
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
