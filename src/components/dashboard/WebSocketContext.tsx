"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export interface VitalsPayload {
  skinTemp?: number;
  roomTemp?: number;
  moisture?: number | string;
  gaitLabel?: string;
  timestamp?: string;
  [key: string]: any;
}

interface WebSocketContextValue {
  vitals: VitalsPayload | null;
  isConnected: boolean;
  error: string | null;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  vitals: null,
  isConnected: false,
  error: null,
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [vitals, setVitals] = useState<VitalsPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use any to quickly adapt to Socket interface without deep prop typing overhead
  const socketRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    const connect = async () => {
      try {
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
            const payload = data.payload || data;
            setVitals((prev) => ({ ...(prev || {}), ...payload }));
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
    <WebSocketContext.Provider value={{ vitals, isConnected, error }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useDashboardWebSocket = () => useContext(WebSocketContext);
