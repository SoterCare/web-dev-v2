"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

const TABS = ["Day", "Month", "Custom"] as const;

export default function TemperatureStatistics() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Day");

  const curve = "M0,200 C80,195 130,155 200,150 C260,145 280,210 320,210 C360,210 400,30 460,30 C520,30 575,175 625,180 C680,185 745,55 800,50";

  return (
    <section>
      <h2 className="text-2xl font-bold text-[var(--text)] mb-5">Temperature Statistics</h2>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="depth-panel flex items-center p-1 gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab
                  ? "depth-card text-[var(--text)] shadow-m"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button className="depth-panel flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--text)] hover:shadow-m transition-all">
          <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
          19/03/2026
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
      </div>

      {/* Chart */}
      <div className="depth-card p-6">
        <div className="flex gap-3">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between text-[11px] font-bold text-[var(--text-muted)] pb-6 pr-2 text-right select-none">
            {["90","85","70","56","60","55"].map(v => <span key={v}>{v}</span>)}
          </div>

          <div className="flex-1 relative">
            <svg viewBox="0 0 800 260" className="w-full h-auto overflow-visible" style={{ height: 280 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid */}
              {[50,100,150,200].map(y => (
                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6,4" />
              ))}

              {/* Filled area */}
              <path d={`${curve} L800,260 L0,260 Z`} fill="url(#tempGrad)" />

              {/* Line */}
              <path d={curve} fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between px-1 mt-2 text-[11px] font-bold text-[var(--text-muted)] select-none">
              {["00:00","06:00","12:00","18:00","24:00"].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>

        {/* Y label */}
        <p className="text-[11px] font-bold text-[var(--text-muted)] mt-2 text-center tracking-widest uppercase">
          Heart Rate (bpm)
        </p>
      </div>
    </section>
  );
}
