"use client";

import { useRef } from "react";
import Image from "next/image";
import { BellRing, Users, Check } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useSectionReveal } from "@/lib/useSectionReveal";

interface Role {
  key: string;
  title: string;
  who: string;
  Icon: typeof BellRing;
  image: string | null;
  points: string[];
}

const ROLES: Role[] = [
  {
    key: "caregiver",
    title: "Caregiver login",
    who: "For carers and nurses on shift",
    Icon: BellRing,
    image: null,
    points: [
      "Critical alerts with the resident and room: stand-up attempts, falls, wet pads, device offline",
      "Confirm or dismiss an alert. Dismissed false alarms go to the Recycle Bin and retrain the model",
      "Response times and a full system timeline",
      "Ask ARIA about a resident, in plain language",
      "Password-less sign-in with a one-time code or Google",
    ],
  },
  {
    key: "guardian",
    title: "Guardian login",
    who: "For the family of a resident",
    Icon: Users,
    image: null,
    points: [
      "Real-time status of their family member",
      "Daily summaries written in plain language",
      "Trends and patterns over weeks",
      "Every record, exportable as PDF or CSV",
      "Notified only when something concerning happens or an update is necessary, never for every alert",
    ],
  },
];

const AppsDuo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  return (
    <section id="apps" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 relative z-10 py-16 md:py-24">
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          chip="The apps"
          title="One app, two logins"
          subtitle="Carers act on critical alerts. Families see what is happening, the trends and the records."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ROLES.map(({ key, title, who, Icon, image, points }) => (
            <article key={key} className="bg-bg-card rounded-[2rem] shadow-m p-6 md:p-10 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-12 rounded-2xl bg-[#a0cbdb]/20 flex items-center justify-center">
                  <Icon className="text-[#3d7e93]" size={24} />
                </span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
                  <p className="text-text-muted">{who}</p>
                </div>
              </div>

              {image ? (
                <Image
                  src={image}
                  alt={`${title} screens`}
                  width={900}
                  height={700}
                  className="w-full h-auto rounded-2xl mb-6"
                />
              ) : (
                <div className="mb-6 rounded-2xl border-2 border-dashed border-black/10 bg-black/[0.02] h-48 flex items-center justify-center text-sm font-semibold text-text-muted">
                  App screens coming soon
                </div>
              )}

              <ul className="space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-text-muted leading-relaxed">
                    <Check size={18} className="mt-1 flex-shrink-0 text-[#3d7e93]" strokeWidth={3} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppsDuo;
