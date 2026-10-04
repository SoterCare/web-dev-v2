'use client';

import React, { useRef } from 'react';
import { PersonStanding, BellRing, Building2, Users } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { useSectionReveal } from '@/lib/useSectionReveal';

interface FeatureGroup {
  key: string;
  title: string;
  tagline: string;
  Icon: typeof BellRing;
  items: { name: string; desc: string }[];
}

const GROUPS: FeatureGroup[] = [
  {
    key: 'elders',
    title: 'Elders',
    tagline: 'Safer nights, with dignity kept.',
    Icon: PersonStanding,
    items: [
      { name: 'Camera-free', desc: 'No cameras in bedrooms or bathrooms. Motion, moisture and skin temperature only.' },
      { name: 'Stand-up warning', desc: 'Our gait model spots a stand-up attempt before a fall: 97.65% accuracy on lab data, across five movement states.' },
      { name: 'Discreet hygiene alerts', desc: 'Moisture is detected on the band and reported privately and silently to the carer.' },
      { name: 'Haptic nudge', desc: 'The band can give a private vibration warning. Working in our prototype.' },
    ],
  },
  {
    key: 'carers',
    title: 'Carers',
    tagline: 'The right alert, to the right room.',
    Icon: BellRing,
    items: [
      { name: 'Critical alerts', desc: 'Delivered to the right carer\'s phone in seconds, with the resident and room.' },
      { name: 'Instant hard-fall detection', desc: 'A fast threshold-based check catches sudden impacts and hard falls immediately.' },
      { name: 'Confirm or dismiss', desc: 'Mark a false alarm and it moves to the Recycle Bin and retrains the model.' },
      { name: 'Ask ARIA', desc: 'ARIA answers questions about a resident from their own records, in plain language.' },
    ],
  },
  {
    key: 'homes',
    title: 'Care homes',
    tagline: 'See everyone at once. Keep the record.',
    Icon: Building2,
    items: [
      { name: 'All residents at a glance', desc: 'The 15.6-inch ward gateway shows every resident\'s status on one screen.' },
      { name: 'Works offline', desc: 'Detection and alerts run on the gateway over the home\'s local network, with no internet needed.' },
      { name: 'Records without paperwork', desc: 'Every resident, alert and response time is logged, and AI writes the shift handover.' },
      { name: 'Three AI agents', desc: 'Safety Guard watches readings and raises alerts with no LLM. ARIA answers questions. A clinical report agent writes six-hourly summaries.' },
    ],
  },
  {
    key: 'families',
    title: 'Families',
    tagline: 'Informed, without being flooded.',
    Icon: Users,
    items: [
      { name: 'Real-time status', desc: 'See how their family member is doing right now.' },
      { name: 'Daily summaries', desc: 'Plain-language updates on the day, written by AI from the sensor data.' },
      { name: 'Trends and patterns', desc: 'Movement, night-time activity and moisture patterns over weeks.' },
      { name: 'Full records', desc: 'Every record, exportable as PDF or CSV.' },
      { name: 'Only when it matters', desc: 'Notified when something concerning happens or an update is necessary, not for every alert.' },
    ],
  },
];

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section id="features" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 bg-transparent relative z-10 w-full overflow-hidden">
      <div ref={contentRef} className="w-full relative z-10 px-4 sm:px-8 pt-16 md:pt-24 pb-8">
        <div className="w-full max-w-7xl mx-auto">
          <SectionHeader
            chip="Features"
            title="Built for every party in care"
            subtitle="Elders wear it. Carers act on it. Families stay informed. Homes keep the record."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {GROUPS.map(({ key, title, tagline, Icon, items }) => (
              <article key={key} className="bg-bg-card p-8 rounded-3xl shadow-sm border border-black/5 relative overflow-hidden">
                <Icon className="absolute -bottom-4 -right-4 text-[#3d7e93] opacity-5 w-32 h-32 rotate-12" />
                <h3 className="text-3xl font-bold">{title}</h3>
                <p className="text-[#3d7e93] font-semibold mb-5">{tagline}</p>
                <ul className="space-y-4 relative">
                  {items.map((item) => (
                    <li key={item.name}>
                      <p className="font-bold text-text">{item.name}</p>
                      <p className="text-text-muted leading-relaxed">{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
