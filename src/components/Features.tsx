'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, HandHeart, ScanEye, Users } from 'lucide-react';
import WardOverviewMock from '@/components/features/WardOverviewMock';
import PhoneAlertMock from '@/components/features/PhoneAlertMock';
import DoctorRecordMock from '@/components/features/DoctorRecordMock';
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

const RECORD_POINTS = [
  'Every event logged with its exact time',
  "Each resident's full history in one place",
  'Trends and patterns analysed by the SoterCare system',
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Four short scenarios play on a loop while the grid is on screen: a resident needs help,
  // the AI spots it, the caregiver is alerted and confirms, and the record gains a line.
  useGSAP(
    () => {
      const root = stageRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const anim = buildCareCircleTimeline(root);
        if (!anim) return;
        const tl = anim.timeline;

        ScrollTrigger.create({
          trigger: root,
          start: 'top 75%',
          end: 'bottom 15%',
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        });

        return anim.dispose;
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 md:mt-20">
      <div className="w-full">
        <div className="mb-8 md:mb-12 text-center flex flex-col items-center">
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight">
            Built for the whole circle of care
          </h3>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-text-muted leading-relaxed">
            Care homes get the system. Caregivers get the alerts. Elders and families get the care you can now offer.
          </p>
        </div>

          <div ref={stageRef} className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            {/* Care homes: the buyer, so the largest card. The ward overview carries the AI that watches every resident. */}
            <article className="relative overflow-hidden rounded-[2.5rem] bg-bg-card shadow-m p-5 sm:p-7 md:p-10 lg:col-span-12">
              <div className="relative grid gap-8 md:grid-cols-2 md:items-stretch lg:gap-12">
                <div className="flex flex-col">
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Care homes</h3>
                  <p className="mt-3 mb-6 text-lg text-text-muted leading-relaxed">
                    Everything you need to run safer care, and the records to show for it.
                  </p>
                  <Points items={HOME_POINTS} />

                  <div className="mt-8 rounded-3xl bg-[#3d7e93]/[0.07] p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-bg-card text-[#3d7e93] shadow-m">
                        <ScanEye size={20} strokeWidth={2.25} aria-hidden="true" />
                      </span>
                      <h4 className="text-xl md:text-2xl font-bold tracking-tight">
                        AI that never looks away
                      </h4>
                    </div>
                    <p className="mt-3 text-text-muted leading-relaxed">
                      AI monitors every resident around the clock and alerts your caregivers the
                      moment something goes wrong.
                    </p>
                  </div>
                </div>
                {/* On desktop the overview fills the height of the text column, so it never stretches the card. */}
                <div className="relative">
                  <div className="md:absolute md:inset-0">
                    <WardOverviewMock />
                  </div>
                </div>
              </div>
            </article>

            {/* Caregivers */}
            <article className="flex flex-col rounded-[2rem] bg-bg-card shadow-m p-5 sm:p-7 md:p-8 lg:col-span-5">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Caregivers</h3>
              <p className="mt-2 mb-6 text-lg text-text-muted leading-relaxed">
                The right alert, to the right caregiver, in seconds.
              </p>
              {/* The phone grows to the card's height, so this card ends level with the records card beside it. */}
              <div className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-[auto_1fr] xl:grid-cols-2 xl:grid-rows-none">
                <div className="self-center">
                  <Points items={CAREGIVER_POINTS} />
                </div>
                <PhoneAlertMock />
              </div>
            </article>

            {/* Records for doctors */}
            <article className="flex flex-col rounded-[1.75rem] bg-bg-card shadow-m p-5 sm:p-7 md:p-8 lg:col-span-7">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                Records your doctor can use
              </h3>
              <p className="mt-2 mb-6 text-lg text-text-muted leading-relaxed max-w-xl">
                Every fall, stand-up attempt, moisture event and skin temperature reading is
                logged with its time. Export a clear report as PDF or CSV for the doctor&apos;s
                visit.
              </p>
              {/* The records panel stretches to the card's height, so the card has no empty band. */}
              <div className="grid flex-1 gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-8 lg:grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <DoctorRecordMock />
                <div className="flex flex-col justify-center gap-5">
                  <Points items={RECORD_POINTS} />
                  {/* A div, not a p: the global p style would make it larger than the card points. */}
                  <div className="border-t border-black/5 pt-5 text-base text-text-muted leading-relaxed">
                    A record to support the conversation with the doctor, not a diagnosis. The
                    history is always there, so nobody has to rely on memory at handover.
                  </div>
                </div>
              </div>
            </article>

            {/* What the home can offer */}
            <h3 className="lg:col-span-12 pt-10 md:pt-14 text-center text-3xl md:text-5xl font-bold tracking-tight text-text">
              And what you can offer your{' '}
              <span className="text-[#3d7e93]">residents and their families</span>
            </h3>

            {/* Elders */}
            <article className="group relative overflow-hidden rounded-[2rem] bg-bg-card shadow-m p-5 sm:p-7 md:p-8 lg:col-span-6">
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
            <article className="group relative overflow-hidden rounded-[2rem] bg-bg-card shadow-m p-5 sm:p-7 md:p-8 lg:col-span-6">
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
  );
};

export default Features;
