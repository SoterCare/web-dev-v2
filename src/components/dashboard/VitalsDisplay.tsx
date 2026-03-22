"use client";

import { useEffect, useState } from "react";
import { Thermometer, Home, Droplets, Activity, Loader2 } from "lucide-react";
import { dashboardApi } from "@/lib/dashboardApi";
import { useDashboardWebSocket } from "./WebSocketContext";

export default function VitalsDisplay() {
  const { vitals: wsVitals, isConnected } = useDashboardWebSocket();
  const [initialVitals, setInitialVitals] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch fallback/initial vitals on mount
    dashboardApi
      .getLatestVitals()
      .then((data) => {
        setInitialVitals(data.payload || data);
      })
      .catch((err) => console.error("Failed to load initial vitals:", err))
      .finally(() => setLoading(false));
  }, []);

  // Use WebSocket data if available, otherwise use initial API data, otherwise fallback to dashes
  const currentData = { ...initialVitals, ...wsVitals };

  const vitals = [
    { 
      title: "Body Temp", 
      value: currentData.skinTemp !== undefined ? Number(currentData.skinTemp).toFixed(1) : "--", 
      unit: "°C", 
      Icon: Thermometer, 
      accent: "text-amber-500", 
      iconBg: "bg-amber-50" 
    },
    { 
      title: "Room Temp", 
      value: currentData.roomTemp !== undefined ? Number(currentData.roomTemp).toFixed(1) : "--", 
      unit: "°C", 
      Icon: Home, 
      accent: "text-orange-400", 
      iconBg: "bg-orange-50" 
    },
    { 
      title: "Moisture",  
      value: currentData.moisture !== undefined ? currentData.moisture : "--",    
      unit: "%",  
      Icon: Droplets, 
      accent: "text-sky-400", 
      iconBg: "bg-sky-50" 
    },
    { 
      title: "Gait Analysis", 
      value: currentData.gaitLabel || "--", 
      unit: "", 
      Icon: Activity, 
      accent: "text-[var(--text-muted)]", 
      iconBg: "bg-[var(--bg-panel)]" 
    },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-[var(--text)]">Live Statistics</h2>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              Connecting...
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((v) => (
          <div key={v.title} className="depth-card p-6 flex flex-col gap-4 relative overflow-hidden">
             {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                   <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
             )}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${v.iconBg} ${v.accent}`}>
              <v.Icon className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className={`text-4xl font-bold tracking-tight ${v.accent} transition-all duration-300`}>
                {v.value}<span className="text-xl font-semibold text-[var(--text-muted)] ml-1">{v.unit}</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] font-semibold mt-1">{v.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
