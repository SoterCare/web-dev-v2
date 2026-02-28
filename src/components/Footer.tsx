'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Play, Mail } from 'lucide-react';

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
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      ).fromTo(
        bottomBarRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.6',
      );
    },
    { scope: containerRef },
  );

  return (
    <footer ref={containerRef} className="h-full px-4 py-8 bg-bg-body">
      <div className="w-full mx-auto max-w-[98%] text-white rounded-[2.5rem] relative overflow-hidden min-h-[85vh] flex flex-col justify-between">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <Image
            src="/assets/footer_1BNW.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#a0cbdb]/80" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col justify-between flex-grow">
          {/* Main Content Center */}
          <div
            ref={mainContentRef}
            className="flex flex-col items-center justify-center flex-grow p-8 mt-20 text-center"
          >
            <h2 className="mb-4 md:mb-2 leading-[1.1] md:leading-[1]">
              <span className="block text-2xl sm:text-4xl md:text-[4vh] font-medium opacity-80 text-[#2f2f2f] leading-none">
                That&apos;s our story
              </span>
              <span className="block text-2xl sm:text-4xl md:text-[8vh] font-medium opacity-90 text-white leading-none mt-4 md:mt-6">
                Wellness Simplified.
              </span>
            </h2>

            <div className="flex flex-col gap-4 mt-10 md:flex-row md:mt-8">
              <Link
                href="#"
                className="flex items-center justify-center w-full gap-3 px-8 py-4 text-lg font-medium transition-colors duration-300 rounded-full bg-bg-card shadow-m text-text hover:bg-gray-200 md:w-auto"
              >
                <Play size={20} fill="currentColor" />
                Watch a Demo
              </Link>

              <button
                onClick={() =>
                  window.dispatchEvent(new Event('open-newsletter-popup'))
                }
                className="bg-[#2f2f2f] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-black transition-colors duration-300 flex items-center gap-3 w-full md:w-auto justify-center"
              >
                <Mail size={20} />
                Subscribe
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div ref={bottomBarRef} className="w-full px-8 pt-20 pb-8">
            <div className="border-t border-white pt-8 flex flex-col xl:flex-row justify-between items-center text-sm md:text-base gap-6 md:gap-4 relative text-[#fafafa]">
              {/* Copyright */}
              <div className="order-3 w-full text-center xl:order-1 xl:text-left xl:w-auto">
                &copy; {new Date().getFullYear()} SoterCare. | All Rights
                Reserved.
              </div>

              {/* Contact Info */}
              <div className="flex flex-col items-center order-1 gap-4 xl:order-2 md:flex-row md:gap-8 xl:absolute xl:left-1/2 xl:-translate-x-1/2">
                <a
                  href="mailto:support@sotercare.com"
                  className="transition-colors hover:text-white"
                >
                  support@sotercare.com
                </a>
              </div>

              {/* Socials & Links */}
              <div className="flex flex-col items-center order-2 gap-6 md:flex-row md:gap-8 xl:order-3">
                <div className="flex items-center gap-4">
                  <a
                    href="tel:+94704888440"
                    className="transition-colors hover:text-white"
                  >
                    +94 70 4888 440
                  </a>

                  <a
                    href="https://www.instagram.com/sotercare_"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow SoterCare on Instagram"
                    className="p-2 transition-colors rounded-full hover:text-white hover:bg-white/10"
                  >
                    <Instagram size={20} />
                  </a>

                  <a
                    href="https://www.linkedin.com/company/sotercare/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Connect with SoterCare on LinkedIn"
                    className="p-2 transition-colors rounded-full hover:text-white hover:bg-white/10"
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