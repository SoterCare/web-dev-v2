"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Users, ClipboardX } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useSectionReveal } from "@/lib/useSectionReveal";

gsap.registerPlugin(ScrollTrigger);
// Mobile browsers resize the viewport as the address bar shows/hides; don't re-measure the pin on that.
ScrollTrigger.config({ ignoreMobileResize: true });

const HEADLINE = "Care breaks down, unseen.";

const STATS = [
  { value: "81%", label: "of care home falls are unwitnessed" },
  { value: "83%", label: "happen in the resident's own room, where no one is watching" },
  { value: "31%", label: "of residents who fell waited over an hour on the floor" },
];

const PAINS = [
  {
    Icon: Clock,
    title: "Help comes late",
    body: "Today's workaround is two-hourly rounds, call bells residents can't press, and CCTV no one watches 24/7.",
  },
  {
    Icon: Users,
    title: "Understaffed",
    body: "Two or three carers per home, many untrained, covering every room at night.",
  },
  {
    Icon: ClipboardX,
    title: "No records kept",
    body: "Handover runs on memory. Families get promises, not proof.",
  },
];

const Problem = () => {
  const pinRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const painsSectionRef = useRef<HTMLElement>(null);
  const painsContentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!pinRef.current || !textRef.current) return;
      const words = textRef.current.querySelectorAll(".word");
      const stats = textRef.current.querySelectorAll(".stat");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(words, { opacity: 0.1 }, { opacity: 1, stagger: 0.15, ease: "none" });
      tl.fromTo(stats, { opacity: 0.1, y: 20 }, { opacity: 1, y: 0, stagger: 0.3, ease: "none" });
      tl.to({}, { duration: 1 });
    },
    { scope: pinRef },
  );

  useSectionReveal(painsSectionRef, painsContentRef);

  return (
    <>
      <section
        id="problem"
        ref={pinRef}
        className="pt-24 md:pt-32 pb-8 bg-bg-body overflow-hidden relative z-10 min-h-[100svh] flex flex-col justify-center"
      >
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        <div ref={textRef} className="relative z-10 container mx-auto px-4 max-w-5xl text-center">
          <span className="bg-bg-card px-8 py-2 rounded-[2rem] shadow-m text-sm font-bold uppercase tracking-widest text-foreground/60 inline-block mb-6">
            The problem
          </span>
          <h2 className="text-[40px] leading-[1.05] sm:text-6xl md:text-7xl font-medium text-text mb-8 md:mb-12">
            {HEADLINE.split(" ").map((word, i) => (
              <span key={i} className="word inline-block mr-[0.2em] opacity-10">
                {word}
              </span>
            ))}
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {STATS.map((s) => (
              <div key={s.value} className="stat opacity-10 bg-bg-card rounded-2xl sm:rounded-3xl shadow-m p-3 sm:p-6">
                <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#3d7e93]">{s.value}</div>
                <p className="mt-2 text-[11px] leading-snug sm:text-base text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] sm:text-xs text-text-muted">
            Single-site studies: JAMDA 2025 (212 falls), JMIR 2021 (6 memory care facilities).
          </p>
        </div>
      </section>

      <section ref={painsSectionRef} className="relative z-10 bg-bg-body py-16 md:py-24">
        <div ref={painsContentRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            chip="Why it matters"
            title="Carers are stretched thin"
            subtitle="18% of Sri Lankans are already 60 or older, and there are about 40,000 nurses against the 88,000 needed."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAINS.map(({ Icon, title, body }) => (
              <div key={title} className="bg-bg-card rounded-3xl shadow-m p-8">
                <Icon className="text-[#3d7e93] mb-4" size={28} />
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <figure className="mt-12 max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl md:text-3xl font-medium text-text leading-snug">
              &ldquo;This is not an eight-hour duty. We must work 24 hours.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-text-muted">Carer, aged care home in Galle</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
};

export default Problem;
