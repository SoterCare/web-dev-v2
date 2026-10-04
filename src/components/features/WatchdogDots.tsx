import { RESIDENTS } from "@/components/features/scenarios";

// Decorative preview of AI watching every resident: each circle gives off a soft light-blue
// wave, and when something is spotted the matching circle reacts. Initials are made up.
const WatchdogDots = () => (
  <div aria-hidden="true" className="mx-auto w-full max-w-[260px]">
    <div className="grid grid-cols-4 gap-3">
      {RESIDENTS.map((r, i) => (
        <span
          key={r.name}
          data-dot={i}
          className={`relative flex aspect-square items-center justify-center rounded-full bg-[#a0cbdb]/35 text-sm font-bold text-[#3d7e93] ${
            r.status === "Offline" ? "opacity-40" : ""
          }`}
        >
          {r.status !== "Offline" && (
            <span
              data-dot-wave
              style={{ animationDelay: `${((i * 7) % 12) * 0.27}s` }}
              className="pointer-events-none absolute inset-0 animate-watch-ripple rounded-full bg-[#a0cbdb] motion-reduce:animate-none"
            />
          )}
          <span className="relative">{r.name[0]}</span>
        </span>
      ))}
    </div>
    <div className="mt-4 flex h-8 items-center justify-center">
      <span
        data-watch-chip
        className="rounded-full bg-black/5 px-4 py-1.5 text-xs font-bold text-text-muted opacity-0"
      >
        Caregiver alerted
      </span>
    </div>
  </div>
);

export default WatchdogDots;
