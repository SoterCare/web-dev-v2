import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Play, Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const containerRef = useRef<HTMLElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      ).fromTo(
        bottomBarRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6", // Stagger overlap
      );
    },
    { scope: containerRef },
  );

  return (
    <footer ref={containerRef} className="bg-bg-body py-8 px-4 h-full">
      <div className="w-full mx-auto max-w-[98%] text-white rounded-[2.5rem] relative overflow-hidden min-h-[85vh] flex flex-col justify-between">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/assets/footer_1BNW.webp"
            alt="Background"
            fill
            className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.02]"
            priority
          />
          {/* Modern dark metallic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#0f172a]/60 to-[#020617]/50" />
        </div>

        {/* Content Wrapper specifically z-index relative to appear above background */}
        <div className="relative z-10 flex flex-col flex-grow justify-between">
          {/* Main Content Center */}
          <div
            ref={mainContentRef}
            className="flex-grow flex flex-col items-center justify-center p-8 text-center mt-20"
          >
            <h2 className="mb-6 md:mb-10 leading-tight">
              <span className="block text-3xl sm:text-4xl md:text-5xl font-bold text-[#a0cbdb] leading-none tracking-tight pb-2 md:pb-4">
                That&apos;s our story.
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-br from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent leading-none tracking-tighter">
                Wellness Simplified.
              </span>
            </h2>

            <div className="flex flex-col md:flex-row gap-6 mt-6 md:mt-8 justify-center w-full max-w-xl mx-auto">
              <button
                onClick={() =>
                  window.dispatchEvent(new Event("open-video-popup"))
                }
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 w-full md:w-auto justify-center shadow-lg"
              >
                <Play size={20} fill="currentColor" />
                Watch
              </button>

              <button
                onClick={() =>
                  window.dispatchEvent(new Event("open-newsletter-popup"))
                }
                className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 hover:bg-neutral-200 transition-all duration-300 flex items-center gap-3 w-full md:w-auto justify-center shadow-[0_4px_14px_0_rgba(255,255,255,0.39)]"
              >
                <Mail size={20} />
                Subscribe
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div ref={bottomBarRef} className="w-full px-8 pb-8 pt-20">
            <div className="border-t border-white/20 pt-8 flex flex-col xl:flex-row justify-between items-center text-sm md:text-base gap-6 md:gap-4 relative text-white/80">
              {/* Copyright */}
              <div className="order-3 xl:order-1 text-center xl:text-left w-full xl:w-auto">
                &copy; {new Date().getFullYear()} SoterCare. | All Rights
                Reserved.
              </div>

              {/* Contact Info */}
              <div className="order-1 xl:order-2 flex flex-col md:flex-row gap-4 md:gap-8 items-center xl:absolute xl:left-1/2 xl:-translate-x-1/2">
                <a
                  href="mailto:support@sotercare.com"
                  className="hover:text-white transition-colors"
                >
                  support@sotercare.com
                </a>
              </div>

              {/* Socials & Links */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 order-2 xl:order-3 items-center">
                <div className="flex gap-4 items-center">
                  <a
                    href="tel:+94704888440"
                    className="hover:text-white transition-colors"
                  >
                    +94 70 4888 440
                  </a>
                  <a
                    href="https://www.instagram.com/sotercare_"
                    target="_blank"
                    className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/sotercare/"
                    target="_blank"
                    className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
