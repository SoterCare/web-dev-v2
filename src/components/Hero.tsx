"use client";

import { useRef } from "react";
import { ArrowDown, ArrowRight, Mail } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Quick setters for performant mouse tracking
  const textXTo = useRef<any>(null);
  const textYTo = useRef<any>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!contentRef.current) return;

    const rect = contentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Parallax logic (-0.5 to 0.5 ratio)
    const xPercent = x / rect.width - 0.5;
    const yPercent = y / rect.height - 0.5;

    // Text moves slightly towards cursor
    textXTo.current?.(xPercent * 16);
    textYTo.current?.(yPercent * 16);
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
          className="relative h-full w-full overflow-hidden flex flex-col justify-between pt-28 md:pt-36 pb-6 md:pb-8 px-4 sm:px-6 lg:px-8 rounded-b-[1.5rem] md:rounded-b-[1.5rem] rounded-t-none origin-top bg-gradient-to-b from-white to-bg-body shadow-m"
        >
          {/* Dotted grid — continues the page texture through the hero surface */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

          {/* Soft powder-blue ambient glow (matches Pricing's blur blobs) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#a0cbdb]/20 blur-[120px]" />
          </div>

          {/* ── Marquee Bands — faint dark texture watermark ── */}
          <div className="absolute inset-0 z-[1] flex flex-col justify-between py-4 md:py-8 overflow-hidden select-none pointer-events-none">
            {marqueeRows.map((row, i) => {
              const repeated = Array(8).fill(`${row.text} · `).join('');
              return (
                <div key={i} className="overflow-hidden py-1 sm:py-2">
                  <div
                    className="flex whitespace-nowrap will-change-transform"
                    style={{
                      animation: `marquee-${row.dir} ${row.duration} linear infinite`,
                    }}
                  >
                    <span className="text-[18rem] font-black tracking-tighter leading-[0.8] text-black/[0.03]">
                      {repeated}
                    </span>
                    <span className="text-[18rem] font-black tracking-tighter leading-[0.8] text-black/[0.03]" aria-hidden="true">
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
              {/* Eyebrow pill — same chip as the section labels */}
              <span className="reveal-text opacity-0 bg-bg-card px-6 py-2.5 rounded-[2rem] shadow-m text-xs sm:text-sm font-bold uppercase tracking-widest text-text-muted mb-7 md:mb-9 w-fit">
                Wellness Simplified
              </span>

              <h1 className="mb-6 md:mb-8 leading-tight">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-text leading-none tracking-tighter pb-1 reveal-text opacity-0">
                  Proactive Elderly Care
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#3d7e93] leading-none tracking-tight mt-1 md:mt-2 reveal-text opacity-0">
                  Monitoring System
                </span>
              </h1>

              <span className="max-w-sm sm:max-w-2xl mx-auto leading-relaxed text-base md:text-xl tracking-wide text-text-muted reveal-text opacity-0">
                Advanced real-time health monitoring ensuring safety and peace
                of mind for your loved ones.
              </span>

              {/* CTA pair — dark primary for contrast, soft card secondary */}
              <div className="reveal-text opacity-0 flex flex-col sm:flex-row items-center gap-4 mt-9 md:mt-11">
                <a
                  href="#product"
                  className="group bg-text text-bg-card px-7 py-3.5 rounded-full font-bold text-base hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  See how it works
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </a>
                <button
                  onClick={() => window.dispatchEvent(new Event("open-contact-popup"))}
                  className="bg-bg-card text-text px-7 py-3.5 rounded-full font-bold text-base shadow-m hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                >
                  <Mail size={18} className="text-[#3d7e93]" />
                  Get in touch
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="w-full flex justify-center md:justify-between items-end text-[10px] sm:text-xs font-bold uppercase tracking-widest text-text-muted z-20 pb-4 md:pb-0 px-2 sm:px-4">
            <div className="w-20 sm:w-32 hidden md:block">#healthtech</div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-text-muted font-bold text-xs sm:text-sm whitespace-nowrap tracking-widest uppercase">
                Scroll to Explore
              </span>
              <ArrowDown size={16} className="text-[#3d7e93] animate-jump" />
            </div>
            <div className="w-20 sm:w-32 text-right hidden md:block">
              Sri Lanka Based
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;
