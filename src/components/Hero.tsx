"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [time, setTime] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  useGSAP(
    () => {
      if (!containerRef.current || !contentRef.current) return;

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
            borderRadius: "2.5rem",
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

  return (
    <div ref={containerRef} className="h-screen w-full sticky top-0 z-0">
      <div className="p-2 md:p-4 h-full w-full">
        <section
          ref={contentRef}
          className="relative h-full w-full overflow-hidden flex flex-col justify-between pt-24 md:pt-32 pb-6 md:pb-8 px-4 sm:px-6 lg:px-8 rounded-[1.5rem] md:rounded-[1.5rem] origin-top"
        >
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 w-full h-full z-0 font-sans">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out hover:scale-[1.02]"
              style={{
                backgroundImage: 'url("/assets/herotest1.webp")',
              }}
            />
            {/* Modern dark gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#0f172a]/60 to-[#020617]/90" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto z-10 pt-12 md:pt-0 px-4">
            <div className="flex flex-col items-center">
              <h1 className="mb-6 md:mb-8 leading-tight">
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-br from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent leading-none tracking-tighter pb-1">
                  Proactive Elderly Care
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#a0cbdb] leading-none tracking-tight mt-1 md:mt-2">
                  Monitoring System
                </span>
              </h1>
              <span className="block text-xl md:text-2xl font-medium text-white/80 leading-snug mt-2 mb-4 md:mb-6 tracking-wide">
                Wellness simplified.
              </span>
              <span className="max-w-sm sm:max-w-2xl mx-auto leading-relaxed text-base md:text-lg tracking-wide text-white/60">
                Advanced real-time health monitoring ensuring safety and peace of
                mind for your loved ones.
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="w-full flex justify-between items-end text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 z-10 pb-4 md:pb-0 px-2 sm:px-4">
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
