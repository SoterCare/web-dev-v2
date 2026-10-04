// Decorative preview of AI watching every resident: a soft wave of attention passes over the
// residents, and now and then one is flagged and the caregiver is alerted. Initials are made up.
const INITIALS = ["K", "N", "S", "M", "R", "C", "P", "S", "G", "L", "S", "I"];
const FLAGGED = 6;

const WatchdogDots = () => (
  <div aria-hidden="true" className="mx-auto w-full max-w-[260px]">
    <div className="grid grid-cols-4 gap-3">
      {INITIALS.map((initial, i) => (
        <span
          key={i}
          style={{ animationDelay: `${(i % 4) * 0.35 + Math.floor(i / 4) * 0.35}s` }}
          className={`flex aspect-square items-center justify-center rounded-full bg-[#a0cbdb]/35 text-sm font-bold text-[#3d7e93] motion-reduce:animate-none ${
            i === FLAGGED ? "animate-watch-flag" : "animate-watch"
          }`}
        >
          {initial}
        </span>
      ))}
    </div>
    <div className="mt-4 flex h-8 items-center justify-center">
      <span className="animate-watch-chip rounded-full bg-[#e08a2e]/15 px-4 py-1.5 text-xs font-bold text-[#8a4e0c] motion-reduce:animate-none">
        Caregiver alerted
      </span>
    </div>
  </div>
);

export default WatchdogDots;
