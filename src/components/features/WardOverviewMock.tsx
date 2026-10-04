// Decorative preview of the ward gateway's overview screen. Names are made up.
const RESIDENTS = [
  { name: "Kamala", status: "Resting" },
  { name: "Nimal", status: "Moving" },
  { name: "Sunil", status: "Resting" },
  { name: "Malini", status: "Resting" },
  { name: "Ranjith", status: "Moving" },
  { name: "Chandra", status: "Resting" },
  { name: "Piyal", status: "Resting" },
  { name: "Sita", status: "Resting" },
  { name: "Gamini", status: "Moving" },
  { name: "Latha", status: "Resting" },
  { name: "Somapala", status: "Resting" },
  { name: "Indrani", status: "Resting", alert: true },
];

const WardOverviewMock = () => (
  <div aria-hidden="true" className="rounded-[1.5rem] bg-bg-card p-3 shadow-m ring-1 ring-black/5 md:p-4">
    <div className="mb-3 px-1 text-xs font-bold text-text">Ward overview</div>
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {RESIDENTS.map((r, i) => (
        <div
          key={r.name}
          {...(r.alert ? { "data-alert-tile": true } : {})}
          className="relative rounded-xl bg-[#3d7e93]/[0.08] px-2.5 py-2.5"
        >
          {r.alert && (
            <span
              data-alert-ping
              className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[#e08a2e] opacity-0"
            />
          )}
          <div className="flex items-center justify-between gap-1">
            <span className="truncate text-[11px] font-bold text-text">{r.name}</span>
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                r.status === "Moving" ? "bg-[#a0cbdb]" : "bg-[#3d7e93]"
              }`}
            />
          </div>
          <div className="mt-0.5 text-[10px] text-text-muted">Resident {i + 1}</div>
          <div
            {...(r.alert ? { "data-alert-status": true } : {})}
            className="text-[10px] font-semibold text-[#3d7e93]"
          >
            {r.status}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WardOverviewMock;
