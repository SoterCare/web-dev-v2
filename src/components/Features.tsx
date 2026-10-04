'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, HandHeart, Users } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import WardOverviewMock from '@/components/features/WardOverviewMock';
import PhoneAlertMock from '@/components/features/PhoneAlertMock';
import DoctorRecordMock from '@/components/features/DoctorRecordMock';
import WatchdogDots from '@/components/features/WatchdogDots';
import { buildCareCircleTimeline } from '@/components/features/scenarios';

gsap.registerPlugin(ScrollTrigger);

const HOME_POINTS = [
  'Every resident at a glance on the 15.6-inch ward gateway',
  'Keeps working without internet, on your own network',
  'Records and shift handover written for you, with no extra paperwork',
  'Features you can offer to your residents and their families',
];

const CAREGIVER_POINTS = [
  'Critical alerts that name the resident who needs help',
  'Instant hard-fall detection',
  'Confirm or dismiss an alert, and the system learns from you',
  'Ask ARIA about any resident',
];

const ELDER_POINTS = [
  'No cameras in bedrooms or bathrooms',
  'A stand-up warning before a fall, 97.65% accurate in lab data',
  'Private, silent moisture alerts',
  'A gentle vibration nudge on the band (working in our prototype)',
];

const FAMILY_POINTS = [
  'Real-time status of their family member',
  'Daily summaries in plain language',
  'Trends and patterns over weeks',
  'Every record, any time',
  'Notified only when something concerning happens',
];

const Points = ({ items, tone = 'dark' }: { items: string[]; tone?: 'dark' | 'light' }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li
        key={item}
        className={`flex items-start gap-3 leading-relaxed ${
          tone === 'light' ? 'text-white/80' : 'text-text-muted'
        }`}
      >
        <Check
          size={18}
          strokeWidth={3}
          className={`mt-1 flex-shrink-0 ${tone === 'light' ? 'text-[#a0cbdb]' : 'text-[#3d7e93]'}`}
        />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Four short scenarios play on a loop while the grid is on screen: a resident needs help,
  // the AI spots it, the caregiver is alerted and confirms, and the record gains a line.
  useGSAP(
    () => {
      const root = stageRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = buildCareCircleTimeline(root);
        if (!tl) return;

        ScrollTrigger.create({
          trigger: root,
          start: 'top 75%',
          end: 'bottom 15%',
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="features"
      ref={sectionRef}
      className="scroll-mt-24 md:scroll-mt-28 bg-transparent relative z-10 w-full overflow-hidden"
    >
      <div className="w-full relative z-10 px-4 sm:px-8 pt-16 md:pt-24 pb-8">
        <div className="w-full max-w-7xl mx-auto">
          <SectionHeader
            chip="Features"
            title="Built for the whole circle of care"
            subtitle="Care homes get the system. Caregivers get the alerts. Elders and families get the care you can now offer."
          />

          <div ref={stageRef} className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            {/* Care homes: the buyer, so the largest card */}
            <article className="relative overflow-hidden rounded-[2.5rem] bg-bg-card shadow-m p-7 md:p-10 lg:col-span-8">
              <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Care homes</h3>
                  <p className="mt-3 mb-6 text-lg text-text-muted leading-relaxed">
                    Everything you need to run safer care, and the records to show for it.
                  </p>
                  <Points items={HOME_POINTS} />
                </div>
                <WardOverviewMock />
              </div>
            </article>

            {/* AI watchdog */}
            <article className="rounded-[2rem] bg-bg-card shadow-m p-7 md:p-8 lg:col-span-4 flex flex-col justify-between gap-6">
              <WatchdogDots />
              <div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                  AI that never looks away
                </h3>
                <p className="mt-3 text-text-muted leading-relaxed">
                  AI monitors every resident around the clock and alerts your caregivers the
                  moment something goes wrong.
                </p>
              </div>
            </article>

            {/* Caregivers */}
            <article className="rounded-[2rem] bg-bg-card shadow-m p-7 md:p-8 lg:col-span-5">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Caregivers</h3>
              <p className="mt-2 mb-6 text-lg text-text-muted leading-relaxed">
                The right alert, to the right caregiver, in seconds.
              </p>
              <div className="grid gap-8 sm:grid-cols-2 sm:items-center lg:grid-cols-1 xl:grid-cols-2">
                <Points items={CAREGIVER_POINTS} />
                <PhoneAlertMock />
              </div>
            </article>

            {/* Records for doctors */}
            <article className="rounded-[1.75rem] bg-bg-card shadow-m p-7 md:p-8 lg:col-span-7">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                Records your doctor can use
              </h3>
              <p className="mt-2 mb-6 text-lg text-text-muted leading-relaxed max-w-xl">
                Every fall, stand-up attempt, moisture event and skin temperature reading is
                logged with its time. Export a clear report as PDF or CSV for the doctor&apos;s
                visit.
              </p>
              <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <DoctorRecordMock />
                <p className="text-text-muted leading-relaxed">
                  A record to support the conversation with the doctor, not a diagnosis. The
                  history is always there, so nobody has to rely on memory at handover.
                </p>
              </div>
            </article>

            {/* What the home can offer */}
            <p className="lg:col-span-12 pt-6 text-center text-xl md:text-2xl font-semibold text-text">
              And what you can offer your residents and their families
            </p>

            {/* Elders */}
            <article className="group relative overflow-hidden rounded-[2rem] bg-bg-card shadow-m p-7 md:p-8 lg:col-span-6">
              <HandHeart
                aria-hidden="true"
                strokeWidth={1.75}
                className="pointer-events-none absolute right-6 top-6 h-24 w-24 text-[#e3e3e3] transition-colors duration-500 group-hover:text-[#3d7e93]"
              />
              <h3 className="relative text-3xl font-bold tracking-tight">Elders</h3>
              <p className="relative mt-2 mb-6 text-lg text-text-muted">
                Safer nights, with dignity kept.
              </p>
              <div className="relative">
                <Points items={ELDER_POINTS} />
              </div>
            </article>

            {/* Families */}
            <article className="group relative overflow-hidden rounded-[2rem] bg-bg-card shadow-m p-7 md:p-8 lg:col-span-6">
              <Users
                aria-hidden="true"
                strokeWidth={1.75}
                className="pointer-events-none absolute right-6 top-6 h-24 w-24 text-[#e3e3e3] transition-colors duration-500 group-hover:text-[#3d7e93]"
              />
              <h3 className="relative text-3xl font-bold tracking-tight">Families</h3>
              <p className="relative mt-2 mb-6 text-lg text-text-muted">
                Informed, without being flooded.
              </p>
              <div className="relative">
                <Points items={FAMILY_POINTS} />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
