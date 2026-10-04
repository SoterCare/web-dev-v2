"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MISSION_TEXT =
  "\u201COur promise is to make elderly care more responsible. Retirement should never mean distance, so we connect every elder, carer and family in one proper way to stay close and stay safe.\u201D";

// Only the key points of the promise are bold blue.
const HIGHLIGHT_WORDS = ["responsible", "retirement", "connect", "family", "safe"];

const Mission = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const words = MISSION_TEXT.split(" ");

  useGSAP(
    () => {
      if (!textRef.current || !sectionRef.current) return;
      const textElements = textRef.current.querySelectorAll(".word");

      // No pin: the words start lighting up as soon as the section is a fifth of the way
      // into view, and finish just before it fills the screen.
      gsap.fromTo(
        textElements,
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 10%",
            scrub: 1,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="promise"
      ref={sectionRef}
      className="py-24 md:py-40 bg-bg-body overflow-hidden relative z-10"
    >
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
      <div ref={textRef} className="container mx-auto px-4 text-center max-w-5xl relative z-10">
        <div className="text-[34px] leading-[1.15] sm:text-[44px] sm:leading-tight md:text-6xl font-medium text-text">
          {words.map((word, i) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
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
