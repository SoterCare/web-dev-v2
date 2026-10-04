"use client";

import { useRef } from "react";
import { Activity, BellRing, TrendingUp, ClipboardList } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import Product from "@/components/Product";
import TechStack from "@/components/TechStack";
import { useSectionReveal } from "@/lib/useSectionReveal";

const STEPS = [
  {
    verb: "Monitor",
    Icon: Activity,
    body: "One band per resident. Motion, moisture and skin temperature, streamed to the ward gateway over the home's network.",
  },
  {
    verb: "Alert",
    Icon: BellRing,
    body: "Critical alerts reach the right carer's phone in seconds, straight to the right room instead of blind rounds.",
  },
  {
    verb: "Analyse",
    Icon: TrendingUp,
    body: "Our own models learn each resident's gait, night stand-ups and moisture patterns over weeks.",
  },
  {
    verb: "Record",
    Icon: ClipboardList,
    body: "Every resident, alert and response time in one place, with no extra paperwork.",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="scroll-mt-24 md:scroll-mt-28 relative z-10 py-16 md:py-24"
    >
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          chip="How it works"
          title="Monitor. Alert. Analyse. Record."
          subtitle="SoterCare connects elders, carers and families in one system. Here is how each step works, and the hardware behind it."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ verb, Icon, body }, i) => (
            <div
              key={verb}
              className="group relative overflow-hidden bg-bg-card rounded-3xl shadow-m p-8 flex flex-col min-h-[260px]"
            >
              {/* Large icon, fully visible in the top-right corner. Muted until the card is hovered. */}
              <Icon
                aria-hidden="true"
                strokeWidth={1.75}
                className="absolute top-6 right-6 h-24 w-24 text-black/[0.09] transition-colors duration-500 group-hover:text-[#3d7e93] pointer-events-none"
              />
              <span className="relative text-sm font-bold text-text-muted mb-6">0{i + 1}</span>
              <h3 className="relative text-3xl font-bold mb-3">{verb}</h3>
              <p className="relative text-text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-lg font-semibold text-text">
          No cameras. Works without internet.
        </p>
        <div className="mt-12 md:mt-16">
          <Product />
          <TechStack />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
