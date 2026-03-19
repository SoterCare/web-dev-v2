"use client";

import { Activity, Droplets, AlertTriangle, Server } from "lucide-react";

const events = [
  {
    id: 1, type: "Movement Detected", time: "23:45 PM",
    Icon: Activity,
    nodeBg: "bg-[#2dd4bf]",
    pillBg: "bg-[#ccfbf1]", pillText: "text-[#0f766e]",
  },
  {
    id: 2, type: "Fall Detected", time: "20:37 PM",
    Icon: AlertTriangle,
    nodeBg: "bg-[#f87171]",
    pillBg: "bg-[#fee2e2]", pillText: "text-[#b91c1c]",
    sub: ["Wrist band online · 19:15 PM", "Thigh band online · 19:15 PM"],
  },
  {
    id: 3, type: "Edge Unit Connected", time: "19:15 PM",
    Icon: Server,
    nodeBg: "bg-[#9ca3af]",
    pillBg: "bg-[#f3f4f6]", pillText: "text-[#374151]",
    sub: ["Wrist band offline · 19:14 PM", "Thigh band offline · 19:14 PM"],
  },
  {
    id: 4, type: "Edge Unit Disconnected", time: "19:14 PM",
    Icon: Server,
    nodeBg: "bg-[#9ca3af]",
    pillBg: "bg-[#f3f4f6]", pillText: "text-[#374151]",
  },
  {
    id: 5, type: "Urine Detected", time: "17:30 PM",
    Icon: Droplets,
    nodeBg: "bg-[#93c5fd]",
    pillBg: "bg-[#dbeafe]", pillText: "text-[#1e40af]",
  },
  {
    id: 6, type: "Movement Detected", time: "15:20 PM",
    Icon: Activity,
    nodeBg: "bg-[#2dd4bf]",
    pillBg: "bg-[#ccfbf1]", pillText: "text-[#0f766e]",
  },
];

export default function ActivityTimeline() {
  return (
    <section className="flex-1 flex flex-col">
      <div className="depth-card p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-[var(--text)] mb-5">Activity Timeline</h3>

        {/* Outer container with relative positioning for the line */}
        <div className="relative flex-1 flex flex-col">
          {/* Vertical connecting line — positioned behind nodes */}
          <div
            className="absolute bg-gray-200"
            style={{ left: 22, top: 24, bottom: 24, width: 2 }}
          />

          <div className="flex flex-col gap-0 overflow-y-auto flex-1 min-h-0 pr-1 slim-scroll overscroll-contain">
            {events.map((ev, idx) => (
              <div key={ev.id}>
                {/* Main row: node + pill */}
                <div className="flex items-center gap-4 relative z-10">
                  {/* Circular node */}
                  <div
                    className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow ${ev.nodeBg}`}
                    style={{ border: "3px solid var(--bg-card)" }}
                  >
                    <ev.Icon className="w-5 h-5" strokeWidth={2.5} />
                  </div>

                  {/* Event pill */}
                  <div
                    className={`flex-1 flex items-center justify-between px-5 py-3.5 rounded-2xl ${ev.pillBg} ${ev.pillText}`}
                  >
                    <span className="font-bold text-[15px]">{ev.type}</span>
                    <span className="text-sm font-semibold opacity-60 ml-4 whitespace-nowrap">{ev.time}</span>
                  </div>
                </div>

                {/* Sub-text beneath relevant rows */}
                {ev.sub ? (
                  <div className="pl-16 py-3 flex flex-col gap-1">
                    {ev.sub.map((txt, i) => (
                      <p key={i} className="text-[11px] font-semibold text-[var(--text-muted)] text-center">
                        {txt}
                      </p>
                    ))}
                  </div>
                ) : (
                  /* Spacer gap between rows without sub-text */
                  idx < events.length - 1 && <div className="h-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
