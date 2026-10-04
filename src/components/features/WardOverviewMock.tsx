import { RESIDENTS } from "@/components/features/scenarios";

// Decorative preview of the ward gateway's overview screen. Names are made up.
// Active residents share one blue; the offline resident's cell is greyed out.
// The AI frame sits on top of the tiles, so it is only an outline and never hides a name.
// It moves from resident to resident. When it spots a problem it takes on the alert's
// colour, and the header shows what it found.
const WardOverviewMock = () => (
  <div aria-hidden="true" className="mx-auto flex h-full w-full max-w-[460px] flex-col rounded-[1.75rem] bg-bg-card p-3 shadow-m ring-1 ring-black/5 sm:p-4 md:p-5">
    <div className="mb-4 flex items-center justify-between gap-3 px-1">
      <span className="text-sm font-bold text-text">Ward overview</span>

      {/* "AI watching" rests here; what the AI found replaces it while an alert plays. */}
      <span className="relative flex h-6 items-center justify-end">
        <span
          data-watch-idle
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#3d7e93]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#3d7e93]"
        >
          <span className="h-1.5 w-1.5 animate-watch-live rounded-full bg-[#3d7e93] motion-reduce:animate-none" />
          AI watching
        </span>
        <span
          data-watch-chip
          className="absolute inset-y-0 right-0 flex items-center whitespace-nowrap text-[11px] font-extrabold uppercase tracking-wide text-text-muted opacity-0"
        />
      </span>
    </div>

    <div className="relative grid flex-1 grid-cols-3 gap-2 sm:gap-2.5 md:grid-rows-4">
      {RESIDENTS.map((r, i) => {
        const offline = r.status === "Offline";
        return (
          <div
            key={r.name}
            data-res={i}
            className={`flex min-h-[92px] flex-col justify-between rounded-2xl px-2 py-2.5 sm:px-3 md:min-h-0 ${
              offline ? "bg-black/[0.04] opacity-60" : "bg-[#3d7e93]/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className={`truncate text-xs font-bold sm:text-sm ${offline ? "text-text-muted" : "text-text"}`}>
                {r.name}
              </span>
              <span
                data-res-dot
                className={`h-2 w-2 shrink-0 rounded-full ${offline ? "bg-black/25" : "bg-[#3d7e93]"}`}
              />
            </div>
            <div className="text-xs text-text-muted">Resident {i + 1}</div>
            <div
              data-res-status
              className={`text-xs font-semibold ${offline ? "text-text-muted" : "text-[#3d7e93]"}`}
            >
              {r.status}
            </div>
          </div>
        );
      })}

      {/* The AI frame: hidden until the animation places it over a resident. */}
      <span data-watcher className="pointer-events-none absolute left-0 top-0 hidden rounded-2xl">
        <span
          data-watcher-wave
          className="absolute inset-0 animate-watch-ripple rounded-2xl border-2 border-[#a0cbdb] motion-reduce:animate-none"
        />
        <span
          data-watcher-ring
          className="absolute inset-0 rounded-2xl border-2 border-[#3d7e93]"
        />
      </span>
    </div>
  </div>
);

export default WardOverviewMock;
