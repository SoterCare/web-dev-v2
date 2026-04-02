"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [time, setTime] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);


  // Quick setters for performant mouse tracking
  const bgXTo = useRef<any>(null);
  const bgYTo = useRef<any>(null);
  const textXTo = useRef<any>(null);
  const textYTo = useRef<any>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!contentRef.current) return;

    const rect = contentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Parallax logic (-0.5 to 0.5 ratio)
    const xPercent = x / rect.width - 0.5;
    const yPercent = y / rect.height - 0.5;

    // Text moves slightly towards cursor
    textXTo.current?.(xPercent * 20);
    textYTo.current?.(yPercent * 20);
  };

  useGSAP(
    () => {
      if (!containerRef.current || !contentRef.current) return;

      // Initialize GSAP QuickTo for parallax mouse tracking
      textXTo.current = gsap.quickTo(textContainerRef.current, "x", { duration: 1.5, ease: "power2.out" });
      textYTo.current = gsap.quickTo(textContainerRef.current, "y", { duration: 1.5, ease: "power2.out" });



      // Staggered Text Load Animation
      gsap.fromTo(
        ".reveal-text",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.2 }
      );

      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "+=1000",
        scrub: 1.5,
        animation: gsap
          .timeline()
          .to(contentRef.current, {
            scale: 0.8,
            opacity: 0.8,
            borderBottomLeftRadius: "2.5rem",
            borderBottomRightRadius: "2.5rem",
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
            ease: "none",
          })
          .to(contentRef.current, {
            opacity: 0,
            ease: "none",
          }),
      });
    },
    { scope: containerRef },
  );

  const marqueeRows = [
    { text: "WELLNESS SIMPLIFIED", dir: "left", duration: "35s" },
    { text: "SOTERCARE", dir: "right", duration: "28s" },
    { text: "WEIGHT INTO WELLNESS", dir: "left", duration: "38s" },
    { text: "MEDTECH CARE", dir: "right", duration: "32s" },
  ];

  return (
    <div ref={containerRef} className="h-screen w-full sticky top-0 z-0">
      <div className="px-2 pb-2 md:px-4 md:pb-4 h-full w-full">
        <section
          ref={contentRef}
          onMouseMove={handleMouseMove}
          className="relative h-full w-full overflow-hidden flex flex-col justify-between pt-28 md:pt-36 pb-6 md:pb-8 px-4 sm:px-6 lg:px-8 rounded-b-[1.5rem] md:rounded-b-[1.5rem] rounded-t-none origin-top"
        >

          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/herotest1.webp"
              alt="SoterCare elderly care monitoring system - IoT wearable devices and AI dashboard"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#0f172a]/70 to-[#020617]/90" />
          </div>

          {/* ── Marquee Bands — inside section, covering full height ── */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between py-4 md:py-8 overflow-hidden select-none pointer-events-none">
            {marqueeRows.map((row, i) => {
              const repeated = `${row.text} · ${row.text} · ${row.text} · ${row.text} · `;
              return (
                <div key={i} className="overflow-hidden py-1 sm:py-2">
                  <div
                    className="flex whitespace-nowrap will-change-transform"
                    style={{
                      animation: `marquee-${row.dir} ${row.duration} linear infinite`,
                    }}
                  >
                    <span className="text-[18rem] font-black tracking-tighter leading-[0.8] text-white/[0.04] pr-20">
                      {repeated}
                    </span>
                    <span className="text-[18rem] font-black tracking-tighter leading-[0.8] text-white/[0.04] pr-20" aria-hidden="true">
                      {repeated}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Text Content */}
          <div
            ref={textContainerRef}
            className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto z-20 pt-12 md:pt-0 px-4 will-change-transform"
          >
            <div className="flex flex-col items-center">
              <h1 className="mb-6 md:mb-8 leading-tight">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold suppercase bg-gradient-to-br from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent leading-none tracking-tighter pb-1 reveal-text opacity-0">
                  Proactive Elderly Care
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#a0cbdb] leading-none tracking-tight mt-1 md:mt-2 reveal-text opacity-0">
                  Monitoring System
                </span>
              </h1>
              <span className="block text-xl md:text-2xl font-medium text-white/80 leading-snug mt-2 mb-4 md:mb-6 tracking-wide reveal-text opacity-0">
                Wellness simplified.
              </span>
              <span className="max-w-sm sm:max-w-2xl mx-auto leading-relaxed text-base md:text-lg tracking-wide text-white/60 reveal-text opacity-0">
                Advanced real-time health monitoring ensuring safety and peace of
                mind for your loved ones.
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="w-full flex justify-center md:justify-between items-end text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 z-20 pb-4 md:pb-0 px-2 sm:px-4">
            <div className="w-20 sm:w-32 hidden md:block">#SDGP</div>
            <div className="flex flex-col items-center">
              <span className="text-shimmer font-bold text-sm sm:text-base whitespace-nowrap tracking-widest uppercase">
                Scroll to Explore
              </span>
            </div>
            <div className="w-20 sm:w-32 text-right hidden md:block">
              IIT-CS-42
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;


