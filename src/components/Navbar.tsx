"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const videoActiveRef = useRef(false); // Use ref so scroll handler sees latest state
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // If video is active, hide nav ONLY when scrolled to the very bottom
      if (videoActiveRef.current) {
        const isNearBottom =
          window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50;
        setIsHidden(isNearBottom);
      } else {
        setIsHidden(false);
      }
    };

    handleScroll(); // Check on initial mount
    window.addEventListener("scroll", handleScroll);

    const handleVideoStart = () => {
      videoActiveRef.current = true;
      setIsOpen(false); // Close mobile menu if open
      handleScroll(); // Check immediately
    };

    const handleVideoEnd = () => {
      videoActiveRef.current = false;
      handleScroll(); // Check immediately
    };

    window.addEventListener("video-view-start", handleVideoStart);
    window.addEventListener("video-view-end", handleVideoEnd);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("video-view-start", handleVideoStart);
      window.removeEventListener("video-view-end", handleVideoEnd);
    };
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      navRef.current,
      {
        width: "85%", // Initial "Longer" state
        maxWidth: "1280px",
      },
      {
        width: "95%", // Mobile default basically, or constrained desktop
        maxWidth: "900px", // Shorter state (current max-w-5xl)
        duration: 0.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: document.body,
          start: "+=300",
          end: "+=390",
          scrub: 1, // Adds standard easing to catch up with the scroll
        },
      },
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isHidden ? "-translate-y-[150%]" : "translate-y-0"
        }`}
    >
      <div
        className="rounded-[1.5rem] px-6 py-4 flex justify-between items-center relative z-50 shadow-lg bg-bg-card shadow-m border border-white/10"
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="#" className="flex items-center gap-2" scroll={false}>
            <Image
              src="/assets/SoterCare-Primary-logo-brandblue.webp"
              alt="SoterCare - Smart Elderly Care Monitoring System"
              width={0}
              height={0}
              sizes="100vw"
              className="h-12 w-auto object-contain transition-opacity duration-700 ease-in-out"
              style={{ width: "auto", height: "48px" }}
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#product" className="transition-colors text-base font-medium text-[#797979] hover:text-black" scroll={false}>Product</Link>
          <Link href="#features" className="transition-colors text-base font-medium text-[#797979] hover:text-black" scroll={false}>Features</Link>
          <Link href="#pricing" className="transition-colors text-base font-medium text-[#797979] hover:text-black" scroll={false}>Pricing</Link>
          <Link href="#team" className="transition-colors text-base font-medium text-[#797979] hover:text-black" scroll={false}>Team</Link>
          <Link href="#contact" className="transition-colors text-base font-medium text-[#797979] hover:text-black" scroll={false}>Contact</Link>
          <Link href="/news" className="transition-colors text-base font-medium text-[#3d7e93] hover:text-black"><span className="news-heartbeat">News</span></Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/dashboard"
            className="px-6 py-2 rounded-[1rem] font-bold text-base transition-all hover:scale-105 active:scale-95 bg-bg-card shadow-m text-text"
          >
            Dashboard
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            className="p-2 transition-transform active:scale-95 text-[#797979] hover:text-black"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`absolute top-full mt-2 left-0 w-full bg-bg-card shadow-m border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 origin-top ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}`}
      >
        <Link
          href="#product"
          className="text-text-muted hover:text-text hover:bg-black/5 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
          onClick={() => setIsOpen(false)}
          scroll={false}
        >
          Product
        </Link>
        <Link
          href="#features"
          className="text-text-muted hover:text-text hover:bg-black/5 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
          onClick={() => setIsOpen(false)}
          scroll={false}
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className="text-text-muted hover:text-text hover:bg-black/5 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
          onClick={() => setIsOpen(false)}
          scroll={false}
        >
          Pricing
        </Link>
        <Link
          href="#team"
          className="text-text-muted hover:text-text hover:bg-black/5 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
          onClick={() => setIsOpen(false)}
          scroll={false}
        >
          Team
        </Link>
        <Link
          href="#contact"
          className="text-text-muted hover:text-text hover:bg-black/5 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
          onClick={() => setIsOpen(false)}
          scroll={false}
        >
          Contact
        </Link>
        <Link
          href="/news"
          className="text-[#3d7e93] hover:text-text hover:bg-black/5 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
          onClick={() => setIsOpen(false)}
        >
          <span className="news-heartbeat">News</span>
        </Link>
        <Link
          href="/dashboard"
          className="bg-bg-panel shadow-m text-text px-6 py-3 rounded-xl font-bold text-lg text-center mt-2 transition-all active:scale-95"
          onClick={() => setIsOpen(false)}
        >
          Dashboard
        </Link>
      </div>

    </nav>
  );

};

export default Navbar;
