import { PALETTES, SCENARIOS } from "@/components/features/scenarios";

// Decorative preview of an exported care record. Details are made up.
// Records are never removed: each new line lands at the top and pushes the older ones down.
// Earlier lines match the earlier alerts on the caregiver's phone, newest first.
const OLDER = [
  { kind: "moisture", when: "Tue 04:55", what: "Moisture event, Gamini" },
  { kind: "standup", when: "Tue 04:47", what: "Stand-up attempt, Sunil" },
  { kind: "checkup", when: "Tue 04:32", what: "High temperature, Chandra" },
] as const;

// One row style for every line, old or new, so a new line looks like the rest once it settles.
const Row = ({ kind, when, what }: { kind: keyof typeof PALETTES; when: string; what: string }) => (
  <div
    data-rec-row
    className="mb-1 flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-[13px] md:text-sm"
  >
    <span
      className="h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: PALETTES[kind].solid }}
    />
    <span className="w-[4.75rem] shrink-0 font-semibold text-[#3d7e93]">{when}</span>
    <span className="truncate font-semibold text-text">{what}</span>
  </div>
);

const DoctorRecordMock = () => (
  <div
    aria-hidden="true"
    className="flex h-full flex-col rounded-2xl bg-bg-card p-4 shadow-xl ring-1 ring-black/5 md:p-5"
  >
    <div className="mb-3 flex items-center justify-between gap-3">
      <span className="text-sm font-bold text-text">Care records</span>
      <span className="text-xs font-semibold text-text-muted">Tuesday · Night shift</span>
    </div>
    {/* The list fades out at the bottom, so a line is never sliced in half. */}
    <div
      data-records
      className="relative min-h-[210px] flex-1 overflow-hidden"
      style={{
        maskImage: "linear-gradient(to bottom, black 78%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, black 78%, transparent)",
      }}
    >
      {/* Taken out of the flow, so the growing list fills the panel instead of stretching it. */}
      <ul className="absolute inset-x-0 top-0">
        {/* Newest first, so a new line grows in above the older ones. */}
        {SCENARIOS.map((sc, i) => ({ sc, i }))
          .reverse()
          .map(({ sc, i }) => (
            <li key={i} data-rec={i} className={`overflow-hidden ${i === 0 ? "" : "hidden"}`}>
              <Row kind={sc.kind} when={sc.time} what={sc.record} />
            </li>
          ))}
        {OLDER.map((r) => (
          <li key={r.when}>
            <Row kind={r.kind} when={r.when} what={r.what} />
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-3 flex gap-2 border-t border-black/5 pt-4">
      <span className="inline-flex h-7 items-center justify-center rounded-full bg-[#3d7e93] px-3.5 text-xs font-bold leading-none text-white">
        Export PDF
      </span>
      <span className="inline-flex h-7 items-center justify-center rounded-full bg-black/5 px-3.5 text-xs font-bold leading-none text-text">
        Export CSV
      </span>
    </div>
  </div>
);

export default DoctorRecordMock;
