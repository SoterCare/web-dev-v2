"use client";

import React, { Suspense, useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Instagram, Linkedin, Play, Mail, ArrowLeft, Github, Home } from "lucide-react";
import WaitlistPopup from "@/components/WaitlistPopup";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type ViewState = "footer" | "transitioning-in" | "video" | "transitioning-out";

const MiniPitchQueryHandler = ({ onOpen }: { onOpen: () => void }) => {
  const searchParams = useSearchParams();
  const hasHandledMiniPitchParam = useRef(false);

  useEffect(() => {
    if (searchParams.get("miniPitch") !== "open") {
      hasHandledMiniPitchParam.current = false;
      return;
    }

    if (hasHandledMiniPitchParam.current) return;

    hasHandledMiniPitchParam.current = true;
    onOpen();
  }, [searchParams, onOpen]);

  return null;
};

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
  const [showPlayGate, setShowPlayGate] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
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

  const handleMiniPitchButtonClick = useCallback(() => {
    setShowPlayGate(false);
    setShowIframe(true);
    handleWatchClick();
  }, [handleWatchClick]);

  const handleMiniPitchLinkOpen = useCallback(() => {
    setShowPlayGate(true);
    setShowIframe(false);
    handleWatchClick();
  }, [handleWatchClick]);

  const handlePlayMiniPitch = useCallback(() => {
    setShowPlayGate(false);
    setShowIframe(true);
  }, []);

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
        setShowPlayGate(false);
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
      <Suspense fallback={null}>
        <MiniPitchQueryHandler onOpen={handleMiniPitchLinkOpen} />
      </Suspense>
      <div className="px-2 pt-2 md:px-4 md:pt-4 h-full w-full pb-0">
        <div className="w-full h-full mx-auto text-text rounded-t-[1.5rem] md:rounded-t-[2.5rem] rounded-b-none relative overflow-hidden flex flex-col justify-between bg-gradient-to-t from-white to-bg-body shadow-m">
          {/* Dotted grid — continues the page texture through the footer surface */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

          {/* Soft powder-blue ambient glow (matches Pricing's blur blobs) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#a0cbdb]/20 blur-[120px]" />
          </div>

          {/* ── Marquee Bands — faint dark texture watermark ── */}
          {(() => {
            const marqueeRows = [
              { text: "MONITOR · ALERT · ANALYSE · RECORD", dir: "left",  duration: "35s" },
              { text: "SOTERCARE",           dir: "right", duration: "28s" },
              { text: "CAMERA-FREE",         dir: "left",  duration: "38s" },
              { text: "CARE HOME READY",     dir: "right", duration: "32s" },
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
                <span className="block text-3xl sm:text-4xl md:text-5xl font-bold text-[#3d7e93] leading-none tracking-tight pb-2 md:pb-4">
                  That&apos;s our story.
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text leading-none tracking-tighter">
                  Smarter care for every elder.
                </span>
              </h2>

              <p className="max-w-2xl text-base md:text-lg text-text-muted leading-relaxed">
                We are a startup building SoterCare with our first care homes, and early partners shape
                the product. Once it is proven there, we will bring it to every home as a family kit.
                That is our promise to the community.
              </p>

              <div
                ref={ctaRef}
                className="flex flex-col md:flex-row gap-4 md:gap-5 mt-8 md:mt-10 justify-center items-stretch w-full max-w-2xl mx-auto"
              >
                <button
                  onClick={() =>
                    window.dispatchEvent(new Event("open-contact-popup"))
                  }
                  className="bg-text text-bg-card px-8 py-4 rounded-full font-bold text-lg md:text-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 w-full md:w-auto justify-center shadow-lg"
                >
                  <Mail size={22} />
                  Book a demo
                </button>

                <button
                  onClick={() => setWaitlistOpen(true)}
                  className="bg-bg-card text-text px-8 py-4 rounded-full font-bold text-lg md:text-xl shadow-m hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 w-full md:w-auto justify-center"
                >
                  <Home size={22} className="text-[#3d7e93]" />
                  Join the home-kit waitlist
                </button>

                {/* Mini Pitch button removed for now. The video overlay and handlers below are kept
                    so it can be added back: <button onClick={handleMiniPitchButtonClick}>Mini Pitch</button> */}
              </div>
            </div>

            {/* Bottom Bar */}
            <div ref={bottomBarRef} className="w-full px-8 pb-8 pt-20">
              <div className="border-t border-black/10 pt-8 grid grid-cols-1 xl:grid-cols-3 items-center gap-6 text-sm md:text-base text-text-muted">
                {/* Left: copyright */}
                <div className="order-3 xl:order-1 text-center xl:text-left">
                  &copy; {new Date().getFullYear()} SoterCare. All rights reserved.
                </div>

                {/* Centre: how to reach us */}
                <div className="order-1 xl:order-2 flex flex-col md:flex-row flex-wrap gap-x-8 gap-y-3 items-center justify-center">
                  <a href="mailto:support@sotercare.com" className="hover:text-text transition-colors">
                    support@sotercare.com
                  </a>
                  <a href="tel:+94704888440" className="hover:text-text transition-colors">
                    +94 70 4888 440
                  </a>
                  <a href="https://sotercare.com" className="hover:text-text transition-colors">
                    sotercare.com
                  </a>
                </div>

                {/* Right: community and socials */}
                <div className="order-2 xl:order-3 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center xl:justify-end">
                  <Link href="/community" className="hover:text-text transition-colors font-medium">
                    Join our developer community →
                  </Link>
                  <div className="flex gap-2 items-center">
                    <a
                      href="https://www.instagram.com/sotercare_"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="SoterCare on Instagram"
                      className="hover:text-text transition-colors p-2 hover:bg-black/5 rounded-full"
                    >
                      <Instagram size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/sotercare/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="SoterCare on LinkedIn"
                      className="hover:text-text transition-colors p-2 hover:bg-black/5 rounded-full"
                    >
                      <Linkedin size={20} />
                    </a>
                    <a
                      href="https://github.com/SoterCare"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="SoterCare on GitHub"
                      className="hover:text-text transition-colors p-2 hover:bg-black/5 rounded-full"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Video Overlay ── */}
          <div
            ref={videoOverlayRef}
            className="absolute inset-0 z-20 bg-gradient-to-b from-white to-bg-body origin-bottom"
            style={{ transform: "scaleY(0)", opacity: 0 }}
          >
            <div
              ref={iframeWrapperRef}
              className="absolute inset-2 sm:inset-4 md:inset-6 lg:inset-10 xl:inset-14 flex items-center justify-center"
              style={{ opacity: 0 }}
            >
              <div className="w-full h-full max-w-[1400px] aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-m border border-black/10 relative bg-black">
                {showPlayGate && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-cover bg-center px-6 text-center"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(8, 20, 25, 0.38), rgba(8, 20, 25, 0.72)), url('https://i.ytimg.com/vi/DvCljGW_eBc/maxresdefault.jpg')",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="mb-5 text-sm font-semibold text-white/80">
                        SoterCare Mini Pitch
                      </span>
                      <button
                        type="button"
                        onClick={handlePlayMiniPitch}
                        className="group flex items-center gap-3 rounded-full bg-white px-7 py-4 text-base font-bold text-text shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95 sm:px-9 sm:text-lg"
                        aria-label="Watch the SoterCare Mini Pitch"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3d7e93] text-white transition-transform duration-300 group-hover:scale-110">
                          <Play size={20} fill="currentColor" />
                        </span>
                        Watch Mini Pitch
                      </button>
                    </div>
                  </div>
                )}
                {showIframe && (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/DvCljGW_eBc?autoplay=1&playsinline=1&rel=0"
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
            className="absolute top-4 left-4 md:top-8 md:left-8 z-30 bg-bg-card text-text px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold text-xs md:text-sm shadow-m hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 md:gap-2"
            style={{ opacity: 0, pointerEvents: viewState === "video" ? "auto" : "none" }}
          >
            <ArrowLeft size={16} className="w-3 h-3 md:w-4 md:h-4" />
            Back
          </button>
        </div>
      </div>
      <WaitlistPopup isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </footer>
  );
};

export default Footer;
