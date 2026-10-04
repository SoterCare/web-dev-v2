"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useSectionReveal } from "@/lib/useSectionReveal";

const TRL = [
  { level: "TRL 5", state: "Done", body: "Components validated in a relevant environment.", current: false },
  { level: "TRL 6", state: "We are here", body: "Working prototype demonstrated in a relevant environment.", current: true },
  { level: "TRL 7", state: "Next, with NIA", body: "Pilot in real care homes through the NIA voucher programme.", current: false },
  { level: "TRL 8 to 9", state: "Then", body: "Production release and first paying homes.", current: false },
];

const ROADMAP = [
  { when: "Months 1 to 8", what: "Full build: production node and gateway, LAN alerting, moisture sensing, ML trend backend, carer and family apps." },
  { when: "Months 9 to 10", what: "Testing in 3 homes across 60 beds, then release." },
  { when: "After that", what: "First paying homes. Pilot homes convert at a pre-agreed price." },
];

const TARGETS = ["80% wear time", "Under 1 false alarm per bed a week", "Response under 3 minutes"];

const Proof = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section id="proof" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 relative z-10 py-16 md:py-24">
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          chip="Where we are"
          title="A working prototype, heading to real care homes"
          subtitle="We are a startup. Here is exactly how far along we are, and what comes next."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRL.map((t) => (
            <div
              key={t.level}
              className={`rounded-3xl p-6 ${t.current ? "bg-text text-bg-card shadow-lg" : "bg-bg-card shadow-m"}`}
            >
              <p className="text-sm font-bold opacity-70">{t.state}</p>
              <h3 className="text-3xl font-bold my-2">{t.level}</h3>
              <p className={t.current ? "opacity-80" : "text-text-muted"}>{t.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-bg-card rounded-3xl shadow-m p-8">
            <h3 className="text-2xl font-bold mb-5">The plan</h3>
            <ol className="space-y-4">
              {ROADMAP.map((r) => (
                <li key={r.when}>
                  <p className="font-bold text-[#3d7e93]">{r.when}</p>
                  <p className="text-text-muted leading-relaxed">{r.what}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-bg-card rounded-3xl shadow-m p-8">
            <h3 className="text-2xl font-bold mb-2">What we will measure in the pilot</h3>
            <p className="text-text-muted mb-5">These are targets, not results yet.</p>
            <ul className="flex flex-wrap gap-3">
              {TARGETS.map((t) => (
                <li key={t} className="bg-black/5 rounded-full px-4 py-2 font-semibold text-text">
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/news" className="mt-8 inline-flex items-center gap-2 font-bold text-[#3d7e93] hover:underline">
              Follow our progress in the news <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;
