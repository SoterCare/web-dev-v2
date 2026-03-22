import { apiFetch } from "./api";

export const dashboardApi = {
  getLatestVitals: () => apiFetch("/dashboard/vitals/latest").then(r => r.json()),
  
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
