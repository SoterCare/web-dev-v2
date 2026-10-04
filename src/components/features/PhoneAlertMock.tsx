import { PALETTES, RESIDENTS, SCENARIOS } from "@/components/features/scenarios";

// Three earlier alerts already sit collapsed under the first new one, so the feed never starts empty.
const PREVIOUS = [
  { kind: "moisture", resident: 8, type: "Moisture", ago: "18 min ago" },
  { kind: "standup", resident: 2, type: "Stand-up", ago: "26 min ago" },
  { kind: "checkup", resident: 5, type: "High temperature", ago: "41 min ago" },
] as const;

// Collapsed alert: the resident, the alert type and how long ago. No buttons.
const Capsule = ({
  name,
  resident,
  type,
  ago,
}: {
  name: string;
  resident: number;
  type: string;
  ago: string;
}) => (
  <>
    <span className="block text-[11px] font-bold text-text">
      {name}, Resident {resident}
    </span>
    <span className="block text-[10px] text-text-muted">
      {type} · {ago}
    </span>
  </>
);

// Decorative preview of a caregiver's phone. Names are made up.
// It is a feed: each new alert lands at the top and pushes the older ones down. Alerts are
// never removed. One that nobody attends repeats until someone taps On my way, then stays
// active until someone marks it resolved. Completed alerts shrink to a compact capsule.
const PhoneAlertMock = () => (
  <div
    aria-hidden="true"
    className="mx-auto w-[220px] rounded-[2rem] border-[6px] border-[#dfe6e9] bg-bg-body shadow-xl"
  >
    <div className="h-[340px] overflow-hidden px-3 pb-4 pt-4">
      <div className="mb-3 text-[10px] font-bold text-text-muted">Alerts</div>

      <div data-feed>
        {/* Newest first, so a new alert grows in above the older ones. */}
        {SCENARIOS.map((sc, i) => ({ sc, i }))
          .reverse()
          .map(({ sc, i }) => {
            const c = PALETTES[sc.kind];
            const r = RESIDENTS[sc.resident];
            return (
              <div key={i} data-feed-card={i} className={`overflow-hidden ${i === 0 ? "" : "hidden"}`}>
                <div
                  data-card-body
                  style={{ borderLeftColor: c.solid }}
                  className="mb-2.5 overflow-hidden rounded-2xl border-l-4 bg-bg-card p-3 shadow-m"
                >
                  <div data-card-full>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="block text-xs font-bold text-text">
                        {r.name}, Resident {sc.resident + 1}
                      </span>
                      <span data-card-count className="shrink-0 text-[10px] font-bold text-text-muted" />
                    </div>
                    <span className="mt-0.5 block text-xs leading-snug text-text-muted">
                      {sc.alertText}
                    </span>
                    <div data-card-actions className="mt-2.5 flex gap-2">
                      <span
                        data-card-confirm
                        style={{ backgroundColor: c.solid, color: c.button }}
                        className="inline-flex h-6 items-center justify-center rounded-full px-3 text-[10px] font-bold leading-none"
                      >
                        Confirm
                      </span>
                      <span className="inline-flex h-6 items-center justify-center rounded-full bg-black/5 px-3 text-[10px] font-bold leading-none text-text-muted">
                        Dismiss
                      </span>
                    </div>
                    <div data-card-status className="mt-2.5 hidden items-center gap-2">
                      <span data-card-status-text className="text-[11px] font-bold text-[#14532d]" />
                      <span
                        data-card-resolve
                        style={{ backgroundColor: c.solid, color: c.button }}
                        className="inline-flex h-6 items-center justify-center rounded-full px-3 text-[10px] font-bold leading-none"
                      >
                        Mark resolved
                      </span>
                    </div>
                  </div>
                  <div data-card-mini className="hidden">
                    <Capsule
                      name={r.name}
                      resident={sc.resident + 1}
                      type={sc.type}
                      ago={sc.ago}
                    />
                  </div>
                </div>
              </div>
            );
          })}

        {/* Earlier alerts, already completed. */}
        {PREVIOUS.map((p) => (
          <div
            key={p.resident}
            style={{ borderLeftColor: PALETTES[p.kind].solid }}
            className="mb-2.5 rounded-2xl border-l-4 bg-bg-card p-3 shadow-m"
          >
            <Capsule
              name={RESIDENTS[p.resident].name}
              resident={p.resident + 1}
              type={p.type}
              ago={p.ago}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PhoneAlertMock;
