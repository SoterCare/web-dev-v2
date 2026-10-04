// Decorative sample of an exported resident record. Not real data.
const ROWS = [
  { when: "Mon 22:40", what: "Moisture event, handled" },
  { when: "Mon 23:15", what: "Back in bed, resting" },
  { when: "Tue 06:05", what: "Skin temperature logged" },
];

const DoctorRecordMock = () => (
  <div
    aria-hidden="true"
    className="relative rounded-xl bg-white p-4 shadow-xl ring-1 ring-black/5 md:p-5"
  >
    {/* folded corner */}
    <span className="absolute right-0 top-0 h-6 w-6 rounded-bl-xl bg-gradient-to-br from-black/5 to-white" />
    <div className="mb-3 flex items-center justify-between pr-6">
      <span className="text-xs font-bold text-text">Resident record</span>
      <span className="text-[10px] font-semibold text-text-muted">Sample view</span>
    </div>
    <ul className="space-y-2">
      <li
        data-record-new
        className="flex gap-3 rounded-lg bg-[#3d7e93]/10 px-2.5 py-2 text-[11px]"
      >
        <span className="w-16 shrink-0 font-semibold text-[#3d7e93]">Tue 02:14</span>
        <span className="font-semibold text-text">Stand-up attempt, Room 12</span>
      </li>
      {ROWS.map((r) => (
        <li key={r.when} className="flex gap-3 px-2.5 py-1 text-[11px] text-text-muted">
          <span className="w-16 shrink-0 font-semibold">{r.when}</span>
          <span>{r.what}</span>
        </li>
      ))}
    </ul>
    <div className="mt-4 flex gap-2">
      <span className="rounded-full bg-text px-3 py-1 text-[10px] font-bold text-bg-card">
        Export PDF
      </span>
      <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-bold text-text">
        Export CSV
      </span>
    </div>
  </div>
);

export default DoctorRecordMock;
