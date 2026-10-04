import { RESIDENTS } from "@/components/features/scenarios";

// Decorative preview of the ward gateway's overview screen. Names are made up.
// Active residents share one blue; the offline resident's cell is greyed out.
const WardOverviewMock = () => (
  <div aria-hidden="true" className="rounded-[1.5rem] bg-bg-card p-3 shadow-m ring-1 ring-black/5 md:p-4">
    <div className="mb-3 px-1 text-xs font-bold text-text">Ward overview</div>
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {RESIDENTS.map((r, i) => {
        const offline = r.status === "Offline";
        return (
          <div
            key={r.name}
            data-res={i}
            className={`rounded-xl px-2.5 py-2.5 ${
              offline ? "bg-black/[0.04] opacity-60" : "bg-[#3d7e93]/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className={`truncate text-[11px] font-bold ${offline ? "text-text-muted" : "text-text"}`}>
                {r.name}
              </span>
              <span
                data-res-dot
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${offline ? "bg-black/25" : "bg-[#3d7e93]"}`}
              />
            </div>
            <div className="mt-0.5 text-[10px] text-text-muted">Resident {i + 1}</div>
            <div
              data-res-status
              className={`text-[10px] font-semibold ${offline ? "text-text-muted" : "text-[#3d7e93]"}`}
            >
              {r.status}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default WardOverviewMock;
