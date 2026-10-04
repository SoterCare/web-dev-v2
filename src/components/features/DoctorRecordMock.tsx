import { SCENARIOS } from "@/components/features/scenarios";

// Decorative preview of an exported resident record. Details are made up.
// Records are never removed: each new line lands at the top and pushes the older ones down.
const OLDER = [
  { when: "Mon 22:40", what: "Moisture event, handled" },
  { when: "Mon 23:15", what: "Back in bed, resting" },
  { when: "Tue 00:30", what: "Skin temperature logged" },
];

const DoctorRecordMock = () => (
  <div
    aria-hidden="true"
    className="rounded-xl bg-white p-4 shadow-xl ring-1 ring-black/5 md:p-5"
  >
    <div className="mb-3 flex items-center justify-between">
      <span className="text-xs font-bold text-text">Resident record</span>
    </div>
    <div data-records className="h-[150px] overflow-hidden">
      <ul>
        {/* Newest first, so a new line grows in above the older ones. */}
        {SCENARIOS.map((sc, i) => ({ sc, i }))
          .reverse()
          .map(({ sc, i }) => (
            <li key={i} data-rec={i} className={`overflow-hidden ${i === 0 ? "" : "hidden"}`}>
              <div className="mb-1.5 flex gap-3 rounded-lg bg-[#3d7e93]/10 px-2.5 py-2 text-[11px]">
                <span className="w-16 shrink-0 font-semibold text-[#3d7e93]">{sc.time}</span>
                <span className="font-semibold text-text">{sc.record}</span>
              </div>
            </li>
          ))}
        {OLDER.map((r) => (
          <li key={r.when} className="flex gap-3 px-2.5 py-1.5 text-[11px] text-text-muted">
            <span className="w-16 shrink-0 font-semibold">{r.when}</span>
            <span>{r.what}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-4 flex gap-2">
      <span className="inline-flex h-6 items-center justify-center rounded-full bg-[#3d7e93] px-3 text-[10px] font-bold leading-none text-white">
        Export PDF
      </span>
      <span className="inline-flex h-6 items-center justify-center rounded-full bg-black/5 px-3 text-[10px] font-bold leading-none text-text">
        Export CSV
      </span>
    </div>
  </div>
);

export default DoctorRecordMock;
