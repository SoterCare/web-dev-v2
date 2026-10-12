"use client";

import { useState, useEffect, useCallback } from "react";
import { dashboardApi } from "@/lib/dashboardApi";
import { useDashboardWebSocket } from "@/components/dashboard/WebSocketContext";
import {
  acceptLiveDeviceId,
  extractDeviceIds,
  resolveSelectedDevice,
} from "@/lib/latestVitals";

const STORAGE_KEY = "sotercare_deviceId";

/**
 * Resolves the active deviceId from multiple sources (priority order):
 *  1. localStorage — instant, survives page refreshes
 *  2. GET /devices  — REST API, gateway-independent; also validates (1)
 *  3. WebSocket     — real-time events, only when gateway is online
 *
 * A cached id is dropped once GET /devices shows it no longer belongs to the
 * signed-in user (unclaimed, reassigned, or left over from another account).
 * Call `revalidate()` when the backend reports the selected device as 403/404.
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

  // null until GET /devices succeeds
  const [knownIds, setKnownIds] = useState<string[] | null>(null);
  const [revalidation, setRevalidation] = useState(0);
  const revalidate = useCallback(() => setRevalidation((n) => n + 1), []);

  // Persist helper
  const persist = (id: string | null) => {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
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
        const ids = extractDeviceIds(res);
        setKnownIds(ids);
        persist(resolveSelectedDevice(ids, localStorage.getItem(STORAGE_KEY)));
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
  }, [revalidation]);

  // Source 3: WebSocket events (updates localStorage for next refresh)
  useEffect(() => {
    if (acceptLiveDeviceId(knownIds, wsDeviceId)) persist(wsDeviceId);
  }, [wsDeviceId, knownIds]);

  return { deviceId, deviceIdReady, revalidate };
}
