import { apiFetch } from "./api";

export const dashboardApi = {
  getLatestVitals: () => apiFetch("/dashboard/vitals/latest").then(r => r.json()),
  
  getDevices: () => apiFetch("/devices").then(r => r.json()),
  
  getRecentAlerts: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch(`/alerts/recent${qs}`).then(r => r.json());
  },

  attendAlert: (id: string) => 
    apiFetch(`/alerts/${id}/attend`, { method: "PATCH" }).then(r => r.json()),

  markFalseAlarm: (id: string) => 
    apiFetch(`/alerts/${id}/false-alarm`, { method: "PATCH" }).then(r => r.json()),

  getDismissedAlerts: () => 
    apiFetch("/timeline/dismissed").then(r => r.json()),

  restoreAlert: (id: string) => 
    apiFetch("/timeline/restore", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }) 
    }).then(r => r.json()),

  dismissAlert: (id: string) => 
    apiFetch("/timeline/dismiss", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }) 
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
  }
};
