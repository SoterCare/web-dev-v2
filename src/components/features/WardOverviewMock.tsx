// Decorative sample of the ward gateway's overview screen. Not real residents.
const TILES = [
  { room: 1, status: "Resting" },
  { room: 2, status: "Moving" },
  { room: 3, status: "Resting" },
  { room: 4, status: "Resting" },
  { room: 5, status: "Moving" },
  { room: 6, status: "Resting" },
  { room: 7, status: "Resting" },
  { room: 8, status: "Resting" },
  { room: 9, status: "Moving" },
  { room: 10, status: "Resting" },
  { room: 11, status: "Resting" },
  { room: 12, status: "Resting", alert: true },
];

const WardOverviewMock = () => (
  <div
    aria-hidden="true"
    className="rounded-[1.5rem] bg-text p-3 shadow-xl md:p-4"
  >
    <div className="mb-3 flex items-center justify-between px-1 text-[11px] font-semibold text-white/70">
      <span>Ward overview</span>
      <span className="rounded-full bg-white/10 px-2 py-0.5">Sample view</span>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {TILES.map((t) => (
        <div
          key={t.room}
          {...(t.alert ? { "data-alert-tile": true } : {})}
          className="relative rounded-xl bg-white/[0.08] px-2.5 py-2.5 text-white"
        >
          {t.alert && (
            <span
              data-alert-ping
              className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[#f0a04b] opacity-0"
            />
          )}
          <div className="text-[11px] font-semibold">Room {t.room}</div>
          <div
            {...(t.alert ? { "data-alert-status": true } : {})}
            className="mt-0.5 flex items-center gap-1 text-[10px] text-white/70"
          >
            {t.status}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WardOverviewMock;
