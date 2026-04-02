import React, { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Play, Mail, ArrowLeft } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type ViewState = "footer" | "transitioning-in" | "video" | "transitioning-out";

const Footer = () => {
  const containerRef = useRef<HTMLElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoOverlayRef = useRef<HTMLDivElement>(null);
  const iframeWrapperRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  const [viewState, setViewState] = useState<ViewState>("footer");
  const [showIframe, setShowIframe] = useState(false);
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);

  // Scroll-triggered entrance animation (unchanged)
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
        "-=0.6",
      );
    },
    { scope: containerRef },
  );

  const handleWatchClick = useCallback(() => {
    if (viewState !== "footer") return;

    // Smooth scroll to perfectly align footer before lock
    const scrollTarget = document.documentElement.scrollHeight - window.innerHeight;

    gsap.to(window, {
      scrollTo: scrollTarget,
      duration: 0.5,
      ease: "power2.out",
    });

    window.dispatchEvent(new Event("video-view-start"));

    // Kill any active timeline
    if (activeTimeline.current) {
      activeTimeline.current.kill();
    }

    setViewState("transitioning-in");
    setShowIframe(true);

    const tl = gsap.timeline({
      onComplete: () => setViewState("video"),
    });
    activeTimeline.current = tl;

    // Phase 1: Heading + CTA buttons fade out and slide up
    tl.to(
      headingRef.current,
      { opacity: 0, y: -30, duration: 0.35, ease: "power2.in" },
      0,
    );
    tl.to(
      ctaRef.current,
      { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" },
      0.05,
    );

    // Phase 2: Bottom bar fades out
    tl.to(
      bottomBarRef.current,
      { opacity: 0, y: 20, duration: 0.3, ease: "power2.in" },
      0.15,
    );

    // Phase 3: Video overlay expands from bottom
    tl.fromTo(
      videoOverlayRef.current,
      { scaleY: 0, opacity: 0 },
      {
        scaleY: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power3.inOut",
      },
      0.35,
    );

    // Phase 4: Iframe fades in
    tl.fromTo(
      iframeWrapperRef.current,
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      0.7,
    );

    // Phase 5: Back button slides in
    tl.fromTo(
      backBtnRef.current,
      { opacity: 0, y: -15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      0.85,
    );
  }, [viewState]);

  const handleBackClick = useCallback(() => {
    if (viewState !== "video") return;

    window.dispatchEvent(new Event("video-view-end"));

    if (activeTimeline.current) {
      activeTimeline.current.kill();
    }

    setViewState("transitioning-out");

    const tl = gsap.timeline({
      onComplete: () => {
        setViewState("footer");
        setShowIframe(false);
      },
    });
    activeTimeline.current = tl;

    // Phase 1: Back button + iframe fade out
    tl.to(
      backBtnRef.current,
      { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" },
      0,
    );
    tl.to(
      iframeWrapperRef.current,
      { opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in" },
      0.05,
    );

    // Phase 2: Overlay shrinks back down
    tl.to(
      videoOverlayRef.current,
      {
        scaleY: 0,
        opacity: 0,
        duration: 0.45,
        ease: "power3.inOut",
      },
      0.25,
    );

    // Phase 3: Footer content fades back in
    tl.to(
      headingRef.current,
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
      0.55,
    );
    tl.to(
      ctaRef.current,
      { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
      0.6,
    );

    // Phase 4: Bottom bar returns
    tl.to(
      bottomBarRef.current,
      { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
      0.7,
    );
  }, [viewState]);

  return (
    <footer id="contact" ref={containerRef} className="h-screen w-full bg-bg-body relative z-10">
      <div className="px-2 pt-2 md:px-4 md:pt-4 h-full w-full pb-0">
        <div className="w-full h-full mx-auto text-white rounded-t-[1.5rem] md:rounded-t-[2.5rem] rounded-b-none relative overflow-hidden flex flex-col justify-between">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image
              src="/assets/footer_1BNW.webp"
              alt=""
              aria-hidden="true"
              fill
              className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.02]"
              priority
            />
            {/* Modern dark metallic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-[#0f172a]/60 to-[#020617]/50" />
          </div>

          {/* ── Marquee Bands — inside footer, full height watermark ── */}
          {(() => {
            const marqueeRows = [
              { text: "WELLNESS SIMPLIFIED", dir: "left",  duration: "35s" },
              { text: "SOTERCARE",           dir: "right", duration: "28s" },
              { text: "WEIGHT INTO WELLNESS",dir: "left",  duration: "38s" },
              { text: "MEDTECH CARE",        dir: "right", duration: "32s" },
            ];
            return (
              <div className="absolute inset-0 z-[1] flex flex-col justify-between py-4 md:py-8 overflow-hidden select-none pointer-events-none">
                {marqueeRows.map((row, i) => {
                  const repeated = Array(8).fill(`${row.text} · `).join('');
                  return (
                    <div key={i} className="overflow-hidden py-1 sm:py-2">
                      <div
                        className="flex whitespace-nowrap will-change-transform"
                        style={{ animation: `marquee-${row.dir} ${row.duration} linear infinite` }}
                      >
                        <span className="text-[18rem] font-black tracking-tighter leading-[0.8] text-white/[0.03]">
                          {repeated}
                        </span>
                        <span className="text-[18rem] font-black tracking-tighter leading-[0.8] text-white/[0.03]" aria-hidden="true">
                          {repeated}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Content Wrapper */}
          <div className="relative z-10 flex flex-col flex-grow justify-between">
            {/* Main Content Center */}
            <div
              ref={mainContentRef}
              className="flex-grow flex flex-col items-center justify-center p-8 text-center mt-20"
            >
              <h2 ref={headingRef} className="mb-6 md:mb-10 leading-tight">
                <span className="block text-3xl sm:text-4xl md:text-5xl font-bold text-[#a0cbdb] leading-none tracking-tight pb-2 md:pb-4">
                  That&apos;s our story.
                </span>
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-br from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent leading-none tracking-tighter">
                  Wellness Simplified.
                </span>
              </h2>

              <div
                ref={ctaRef}
                className="flex flex-col md:flex-row gap-6 mt-6 md:mt-8 justify-center w-full max-w-xl mx-auto"
              >
                <button
                  onClick={handleWatchClick}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 w-full md:w-auto justify-center shadow-lg"
                >
                  <Play size={20} fill="currentColor" />
                  Watch
                </button>

                <button
                  onClick={() =>
                    window.dispatchEvent(new Event("open-contact-popup"))
                  }
                  className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 hover:bg-neutral-200 transition-all duration-300 flex items-center gap-3 w-full md:w-auto justify-center"
                >
                  <Mail size={20} />
                  Send a Message
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
                      rel="noopener noreferrer"
                      aria-label="SoterCare on Instagram"
                      className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                      <Instagram size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/sotercare/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="SoterCare on LinkedIn"
                      className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Video Overlay ── */}
          <div
            ref={videoOverlayRef}
            className="absolute inset-0 z-20 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#050505] origin-bottom"
            style={{ transform: "scaleY(0)", opacity: 0 }}
          >
            <div
              ref={iframeWrapperRef}
              className="absolute inset-2 sm:inset-4 md:inset-6 lg:inset-10 xl:inset-14 flex items-center justify-center"
              style={{ opacity: 0 }}
            >
              <div className="w-full h-full max-w-[1400px] aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/10 relative">
                {showIframe && (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/2bcujj8dd_M?autoplay=1&rel=0"
                    title="SoterCare Demo Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── Back Button ── */}
          <button
            ref={backBtnRef}
            onClick={handleBackClick}
            className="absolute top-4 left-4 md:top-8 md:left-8 z-30 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold text-xs md:text-sm hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 md:gap-2 shadow-lg"
            style={{ opacity: 0, pointerEvents: viewState === "video" ? "auto" : "none" }}
          >
            <ArrowLeft size={16} className="w-3 h-3 md:w-4 md:h-4" />
            Back
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
