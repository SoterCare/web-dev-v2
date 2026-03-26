"use client";

import { useState, useEffect } from "react";
import { dashboardApi } from "@/lib/dashboardApi";
import { useDashboardWebSocket } from "@/components/dashboard/WebSocketContext";

const STORAGE_KEY = "sotercare_deviceId";

/**
 * Resolves the active deviceId from multiple sources (priority order):
 *  1. localStorage — instant, survives page refreshes
 *  2. GET /devices  — REST API, gateway-independent
 *  3. WebSocket     — real-time events, only when gateway is online
 *
 * Once resolved from any source, the ID is stored in localStorage so
 * all future refreshes are instant and don't depend on the gateway.
 */
export function useDeviceId() {
  const { deviceId: wsDeviceId } = useDashboardWebSocket();

  // Initialise synchronously from localStorage (fast, no flicker)
  const [deviceId, setDeviceId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });

  const [deviceIdReady, setDeviceIdReady] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(STORAGE_KEY);
  });

  // Persist helper
  const persist = (id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setDeviceId(id);
    setDeviceIdReady(true);
  };

  // Source 2: REST GET /devices (gateway-independent)
  useEffect(() => {
    let active = true;
    dashboardApi
      .getDevices()
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res?.devices)
          ? res.devices
          : Array.isArray(res?.data)
          ? res.data
          : [];
        const id = list[0]?.id || list[0]?.deviceId || null;
        if (id) persist(id);
      })
      .catch(() => {
        /* REST failed — localStorage or WS will cover it */
      })
      .finally(() => {
        if (active) setDeviceIdReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  // Source 3: WebSocket events (updates localStorage for next refresh)
  useEffect(() => {
    if (wsDeviceId) persist(wsDeviceId);
  }, [wsDeviceId]);

  return { deviceId, deviceIdReady };
}
