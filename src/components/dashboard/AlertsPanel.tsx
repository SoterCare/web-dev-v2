"use client";

import { Activity, Droplets, AlertTriangle, ChevronRight } from "lucide-react";

const alerts = [
  { id: 1, type: "Movement Detected", time: "1m ago",  Icon: Activity,      iconBg: "bg-teal-100",   iconColor: "text-teal-600"  },
  { id: 2, type: "Urine Detected",    time: "2m ago",  Icon: Droplets,      iconBg: "bg-sky-100",    iconColor: "text-sky-600"   },
  { id: 3, type: "Fall Detected",     time: "2m ago",  Icon: AlertTriangle, iconBg: "bg-red-100",    iconColor: "text-red-500"   },
];

export default function AlertsPanel() {
  return (
    <section className="depth-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[var(--text)]">Recent Alerts</h3>
      </div>

      <div className="space-y-3">
        {alerts.map(a => (
          <div
            key={a.id}
            className="w-full py-3 px-5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-between group text-base bg-bg-card shadow-m text-foreground hover:bg-white"
          >
            <div className="flex items-center gap-4">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${a.iconBg} ${a.iconColor} shrink-0`}>
                <a.Icon className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span>{a.type}</span>
            </div>
            <span className="text-[var(--text-muted)] font-semibold">{a.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
