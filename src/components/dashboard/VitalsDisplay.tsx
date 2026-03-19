"use client";

import { Thermometer, Home, Droplets, Activity } from "lucide-react";

const vitals = [
  { title: "Body Temp", value: "30.4", unit: "°C", Icon: Thermometer, accent: "text-amber-500", iconBg: "bg-amber-50" },
  { title: "Room Temp", value: "30.9", unit: "°C", Icon: Home, accent: "text-orange-400", iconBg: "bg-orange-50" },
  { title: "Moisture",  value: "0",    unit: "%",  Icon: Droplets, accent: "text-sky-400", iconBg: "bg-sky-50" },
  { title: "Gait Analysis", value: "N/A", unit: "", Icon: Activity, accent: "text-[var(--text-muted)]", iconBg: "bg-[var(--bg-panel)]" },
];

export default function VitalsDisplay() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[var(--text)] mb-5">Live Statistics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((v) => (
          <div key={v.title} className="depth-card p-6 flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${v.iconBg} ${v.accent}`}>
              <v.Icon className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <div className={`text-4xl font-bold tracking-tight ${v.accent}`}>
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
