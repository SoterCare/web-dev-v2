"use client";

import { useRef } from "react";
import { ArrowDown, ArrowRight, CalendarCheck } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WatermarkMarquee from "@/components/WatermarkMarquee";

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
          // Only scale and opacity: the GPU handles those without repainting. Animating the
          // corner radius here repainted the whole hero on every scroll frame, which iPhone
          // Safari could not keep up with.
          .to(contentRef.current, {
            scale: 0.8,
            opacity: 0.8,
            ease: "none",
          })
          // autoAlpha also hides it once faded. The hero is sticky and stays behind the whole
          // page, so without this the phone keeps drawing it under every section.
          .to(contentRef.current, {
            autoAlpha: 0,
            ease: "none",
          }),
      });
    },
    { scope: containerRef },
  );

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
            {/* A gradient, not blur(): a large blur filter is very slow to repaint in iPhone Safari. */}
            <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(160,203,219,0.2)_0%,rgba(160,203,219,0.1)_40%,transparent_70%)]" />
          </div>

          {/* ── Marquee Bands — faint dark texture watermark ── */}
          <WatermarkMarquee />

          {/* Main Text Content */}
          <div
            ref={textContainerRef}
            className="flex-1 flex flex-col items-center justify-center text-center max-w-6xl mx-auto z-20 pt-12 md:pt-0 px-4 will-change-transform"
          >
            <div className="flex flex-col items-center">
              <h1 className="mb-6 md:mb-8 leading-[1.02]">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-text tracking-tighter reveal-text opacity-0">
                  Smarter care ecosystem
                </span>{" "}
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#3d7e93] tracking-tighter mt-1 md:mt-2 reveal-text opacity-0">
                  for every resident.
                </span>
              </h1>

              <span className="max-w-sm sm:max-w-2xl mx-auto leading-relaxed text-base md:text-xl tracking-wide text-text-muted reveal-text opacity-0">
                SoterCare monitors every resident, alerts the right carer in seconds, learns
                each person&apos;s patterns and keeps the home&apos;s records. No cameras. Works without internet.
              </span>

              {/* CTA pair — dark primary for contrast, soft card secondary */}
              <div className="reveal-text opacity-0 flex flex-col sm:flex-row items-center gap-4 mt-9 md:mt-11">
                <button
                  onClick={() => window.dispatchEvent(new Event("open-contact-popup"))}
                  className="group bg-text text-bg-card px-7 py-3.5 rounded-full font-bold text-base hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  <CalendarCheck size={18} />
                  Book a demo
                </button>
                <a
                  href="#how-it-works"
                  className="group bg-bg-card text-text px-7 py-3.5 rounded-full font-bold text-base shadow-m hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                >
                  See how it works
                  <ArrowRight size={18} className="text-[#3d7e93] transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="w-full flex justify-center md:justify-between items-end text-[10px] sm:text-xs font-bold text-text-muted z-20 pb-4 md:pb-0 px-2 sm:px-4">
            <div className="w-20 sm:w-32 hidden md:block">#healthtech</div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-text-muted font-bold text-xs sm:text-sm whitespace-nowrap ">
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
