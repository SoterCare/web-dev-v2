'use client';

import React, { useRef } from 'react';
import { CalendarCheck, Check } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { useSectionReveal } from '@/lib/useSectionReveal';

const INCLUDED = [
  'One band for each resident',
  'One 15.6-inch ward gateway for the home',
  'Caregiver and guardian apps',
  'Support from the people who built it',
];

const Pricing = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section id="pricing" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 relative z-10 py-16 md:py-24 overflow-hidden">
      <div ref={contentRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader chip="Pricing" title="Priced for care homes. Let's talk." />

        <div className="bg-bg-card rounded-[2.5rem] shadow-xl border border-black/5 overflow-hidden flex flex-col md:flex-row">
          <div className="p-8 md:p-12 md:w-3/5">
            <p className="text-text-muted text-lg leading-relaxed mb-6">
              SoterCare is a startup, and we are building this with our first care homes. Pricing
              is per home: a band for each resident, one ward gateway, and a small monthly fee per
              bed. Tell us about your home and we will send you a quote.
            </p>
            <ul className="space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3 font-medium text-text">
                  <Check size={18} className="mt-1 flex-shrink-0 text-[#3d7e93]" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-black/5 p-8 md:p-12 md:w-2/5 flex flex-col justify-center items-center gap-5 text-center">
            <button
              onClick={() => window.dispatchEvent(new Event('open-contact-popup'))}
              className="w-full py-4 bg-text text-bg-card rounded-full font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg flex items-center justify-center gap-2"
            >
              <CalendarCheck size={20} />
              Book a demo
            </button>
            <p className="text-sm text-text-muted">
              Early partners shape the product. We reply personally.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
