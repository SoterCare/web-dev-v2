"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// Mobile browsers resize the viewport as the address bar shows/hides; don't re-measure the pin on that.
ScrollTrigger.config({ ignoreMobileResize: true });

const MISSION_TEXT =
  "\u201CWe believe that caring for elders should be about love, not exhaustion. Our technology can lift the weight from every carer by watching over the absolute truth of each resident\u2019s safety. Now, put that weight down and simply care again.\u201D";

const HIGHLIGHT_WORDS = ["we", "lift", "the", "weight"];

const Mission = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const words = MISSION_TEXT.split(" ");

  useGSAP(
    () => {
      if (!textRef.current || !sectionRef.current) return;
      const textElements = textRef.current.querySelectorAll(".word");

      // One pinned, scrubbed timeline: the section only unpins once every word is revealed,
      // with a short hold at the end so the full text is readable before scrolling on.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(textElements, { opacity: 0.1 }, { opacity: 1, stagger: 0.1, ease: "none" });
      tl.to({}, { duration: 1.2 });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="promise"
      ref={sectionRef}
      className="pt-24 md:pt-32 pb-6 md:pb-12 bg-bg-body overflow-hidden relative z-10 min-h-[100svh] flex flex-col justify-center"
    >
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
      <div ref={textRef} className="container mx-auto px-4 text-center max-w-5xl relative z-10">
        <div className="text-[38px] leading-[1.1] sm:text-[48px] sm:leading-tight md:text-6xl font-medium text-text">
          {words.map((word, i) => {
            const cleanWord = word.replace(/[^a-zA-Z\u2019']/g, "").toLowerCase();
            const isHighlighted = HIGHLIGHT_WORDS.includes(cleanWord);
            return (
              <span
                key={i}
                className={`word inline-block mr-[0.2em] opacity-10 ${isHighlighted ? "text-[#3d7e93] font-bold" : ""}`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Mission;
