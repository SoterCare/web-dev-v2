import { RESIDENTS } from "@/components/features/scenarios";

// Decorative preview of the ward gateway's overview screen. Names are made up.
// Active residents share one blue; the offline resident's cell is greyed out.
const WardOverviewMock = () => (
  <div aria-hidden="true" className="mx-auto w-full max-w-[340px] rounded-[1.75rem] bg-bg-card p-4 shadow-m ring-1 ring-black/5 md:p-5">
    <div className="mb-4 px-1 text-sm font-bold text-text">Ward overview</div>
    <div className="grid grid-cols-3 gap-2.5">
      {RESIDENTS.map((r, i) => {
        const offline = r.status === "Offline";
        return (
          <div
            key={r.name}
            data-res={i}
            className={`flex min-h-[92px] flex-col justify-between rounded-2xl px-3 py-3 ${
              offline ? "bg-black/[0.04] opacity-60" : "bg-[#3d7e93]/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className={`truncate text-sm font-bold ${offline ? "text-text-muted" : "text-text"}`}>
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
    </div>
  </div>
);

export default WardOverviewMock;
