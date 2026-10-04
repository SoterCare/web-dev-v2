import { RESIDENTS } from "@/components/features/scenarios";

// Decorative preview of AI watching over the residents. One watching circle gives off a soft
// light-blue wave. After it finishes an alert it moves on to the next resident, starts its
// wave there, and sends the alert to the caregivers. Initials are made up.
const WatchdogDots = () => (
  <div aria-hidden="true" className="mx-auto w-full max-w-[260px]">
    <div className="relative grid grid-cols-4 gap-3">
      {RESIDENTS.map((r, i) => (
        <span
          key={r.name}
          data-dot={i}
          className={`relative flex aspect-square items-center justify-center rounded-full bg-[#a0cbdb]/35 text-lg font-bold text-[#3d7e93] ${
            r.status === "Offline" ? "opacity-40" : ""
          }`}
        >
          <span className="relative">{r.name[0]}</span>
        </span>
      ))}

      {/* The watching circle: hidden until the animation positions it over a resident. */}
      <span
        data-watcher
        className="pointer-events-none absolute left-0 top-0 hidden rounded-full"
      >
        <span
          data-watcher-wave
          className="absolute inset-0 animate-watch-ripple rounded-full bg-[#a0cbdb] motion-reduce:animate-none"
        />
        <span
          data-watcher-ring
          className="absolute inset-0 rounded-full border-4 border-[#3d7e93]/60"
        />
      </span>
    </div>
    <div className="mt-5 flex min-h-8 items-center justify-center">
      <span
        data-watch-chip
        className="text-center text-lg font-extrabold uppercase leading-none text-text-muted opacity-0 md:text-xl"
      >
        Caregiver alerted
      </span>
    </div>
  </div>
);

export default WatchdogDots;
