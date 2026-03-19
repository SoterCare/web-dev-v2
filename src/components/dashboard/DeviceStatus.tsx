"use client";

import { Smartphone, Box } from "lucide-react";

const devices = [
  { id: 1, name: "Thigh Band",  Icon: Smartphone, status: "Online" },
  { id: 2, name: "Edge Unit",   Icon: Box,        status: "Online" },
];

export default function DeviceStatus() {
  return (
    <section className="depth-card p-6">
      <h3 className="text-xl font-bold text-[var(--text)] mb-6">Device Status</h3>
      <div className="space-y-3">
        {devices.map(d => (
          <div key={d.id} className="depth-panel flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] shadow-m flex items-center justify-center text-[var(--text-muted)]">
                <d.Icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-[var(--text)]">{d.name}</span>
            </div>
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 tracking-wide">
              {d.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
