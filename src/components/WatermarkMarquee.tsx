"use client";

import { useEffect, useRef } from "react";

const ROWS = [
  { text: "MONITOR · ALERT · ANALYSE · RECORD", dir: "left", seconds: 35 },
  { text: "SOTERCARE", dir: "right", seconds: 28 },
  { text: "CAMERA-FREE", dir: "left", seconds: 38 },
  { text: "CARE HOME READY", dir: "right", seconds: 32 },
] as const;

// At 18rem one character of this heavy font is about 118px wide.
const CHAR_PX = 118;
// The row speeds were tuned on desktop, where a row travelled about 720px per loop.
const TUNED_PX = 720;

// Faint sliding words behind the hero and the footer.
// Each row is its own GPU layer. At 18rem the text is very wide, so a row holds only enough
// copies to cover the widest screen; more copies made each layer tens of thousands of pixels
// wide and left phones unable to draw the page while scrolling. The rows also stop sliding
// while they are off screen.
export default function WatermarkMarquee() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      root.dataset.paused = entry.isIntersecting ? "false" : "true";
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="group absolute inset-0 z-[1] flex flex-col justify-between py-4 md:py-8 overflow-hidden select-none pointer-events-none"
    >
      {ROWS.map((row) => {
        // One copy of the long row already spans a wide screen; the short words need two.
        const copies = row.text.length > 20 ? 1 : 2;
        const repeated = Array(copies).fill(`${row.text} · `).join("");
        // The row slides exactly one copy-block per loop, so the loop is seamless. Scale the
        // duration by that distance to keep the speed the rows were tuned for.
        const seconds = (row.seconds * repeated.length * CHAR_PX) / TUNED_PX;
        return (
          <div key={row.text} className="overflow-hidden py-1 sm:py-2">
            <div
              className="flex w-max whitespace-nowrap will-change-transform group-data-[paused=true]:[animation-play-state:paused]"
              style={{ animation: `marquee-${row.dir} ${seconds}s linear infinite` }}
            >
              <span className="text-[18rem] font-black tracking-tighter leading-[0.8] text-black/[0.03]">
                {repeated}
              </span>
              <span className="text-[18rem] font-black tracking-tighter leading-[0.8] text-black/[0.03]">
                {repeated}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
