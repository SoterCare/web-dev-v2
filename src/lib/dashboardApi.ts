import { apiFetch } from "./api";

// Direct backend URL — same base the proxy and WebSocket both use
const BACKEND_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "https://unlikely-caryn-sotercare-873e6112.koyeb.app";

// Token cache so we don't hit /api/auth/token on every button click
let _token: string | null = null;
let _tokenTs = 0;

async function getBearerToken(): Promise<string> {
  // Refresh if missing or older than 4 minutes
  if (_token && Date.now() - _tokenTs < 4 * 60 * 1000) return _token;
  const r = await fetch("/api/auth/token");
  if (!r.ok) throw new Error("token_unavailable");
  const { token } = await r.json();
  _token = token;
  _tokenTs = Date.now();
  return token;
}

// Calls the Koyeb backend directly with a Bearer token — no Next.js proxy hop.
// Used for PATCH alert actions because the proxy introduces an extra round-trip
// that the backend rejects for mutation endpoints (GET/POST work fine via proxy).
async function backendPatch(path: string): Promise<Response> {
  const token = await getBearerToken();
  return fetch(`${BACKEND_BASE}${path}`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${token}` },
  });
}

export const dashboardApi = {
  getLatestVitals: () => apiFetch("/dashboard/vitals/latest").then(r => r.json()),

  getDevices: () => apiFetch("/devices").then(r => r.json()),

  getRecentAlerts: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch(`/alerts/recent${qs}`).then(r => r.json());
  },

  // Direct PATCH to backend — bypasses Next.js proxy (mobile app does the same)
  attendAlert: (id: string) =>
    backendPatch(`/alerts/${id}/attend`).then(async r => {
      if (!r.ok) throw new Error(`attend_${r.status}`);
      return r.json().catch(() => ({}));
    }),

  markFalseAlarm: (id: string) =>
    backendPatch(`/alerts/${id}/false-alarm`).then(async r => {
      if (!r.ok) throw new Error(`false_alarm_${r.status}`);
      return r.json().catch(() => ({}));
    }),

  getDismissedAlerts: () =>
    apiFetch("/timeline/dismissed").then(r => r.json()),

  restoreAlert: (id: string) =>
    apiFetch("/timeline/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).then(r => r.json()),

  getTimelineVitals: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch(`/timeline/vitals${qs}`).then(r => r.json());
  },

  getTimelineStats: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch(`/timeline/stats${qs}`).then(r => r.json());
  },

  getTimelineEvents: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch(`/timeline/events${qs}`).then(r => r.json());
  },
};
