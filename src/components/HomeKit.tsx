"use client";

import { useRef, useState } from "react";
import { Home } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import WaitlistPopup from "@/components/WaitlistPopup";
import { useSectionReveal } from "@/lib/useSectionReveal";

const HomeKit = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section id="home-kit" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 relative z-10 py-16 md:py-24">
      <div ref={contentRef} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeader chip="Coming home" title="Then, every home." />
        <p className="text-lg md:text-xl text-text-muted leading-relaxed">
          We are starting where the need is greatest: care homes. Once SoterCare is proven there,
          we will bring it to families as a home kit. That is our promise to the community.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-8 bg-bg-card text-text px-7 py-3.5 rounded-full font-bold shadow-m hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2"
        >
          <Home size={18} className="text-[#3d7e93]" />
          Join the home-kit waitlist
        </button>
      </div>
      <WaitlistPopup isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
};

export default HomeKit;
