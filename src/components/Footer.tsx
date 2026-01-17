import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const containerRef = useRef<HTMLElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.fromTo(mainContentRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
      .fromTo(bottomBarRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        "-=0.6" // Stagger overlap
      );
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="bg-bg-body py-8 px-4 h-full">
      <div className="w-full mx-auto max-w-[98%] text-white rounded-[2.5rem] relative overflow-hidden min-h-[85vh] flex flex-col justify-between">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/assets/footer_1BNW.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#a0cbdb]/80" />
        </div>

        {/* Content Wrapper specifically z-index relative to appear above background */}
        <div className="relative z-10 flex flex-col flex-grow justify-between">

          {/* Main Content Center */}
          <div ref={mainContentRef} className="flex-grow flex flex-col items-center justify-center p-8 text-center mt-20">
            <h2 className="mb-4 md:mb-2 leading-[1.1] md:leading-[1]">
              <span className="block text-2xl sm:text-4xl md:text-[4vh] font-medium opacity-80 text-[#2f2f2f] leading-none">
                That&apos;s our story
              </span>
              <span className="block text-2xl sm:text-4xl md:text-[8vh] font-medium opacity-90 text-white leading-none mt-4 md:mt-6">
                Wellness Simplified.
              </span>
            </h2>
            <Link
              href="#"
              className="bg-bg-card shadow-m text-text px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-3"
            >
              <Play size={20} fill="currentColor" />
              Watch a Demo
            </Link>
          </div>

          {/* Bottom Bar */}
          <div ref={bottomBarRef} className="w-full px-8 pb-8 pt-20">
            <div className="border-t border-white pt-8 flex flex-col xl:flex-row justify-between items-center text-sm md:text-base gap-6 md:gap-4 relative text-[#fafafa]">
              {/* Copyright */}
              <div className="order-3 xl:order-1 text-center xl:text-left w-full xl:w-auto">
                &copy; {new Date().getFullYear()} SoterCare. | All Rights Reserved.
              </div>

              {/* Contact Info */}
              <div className="order-1 xl:order-2 flex flex-col md:flex-row gap-4 md:gap-8 items-center xl:absolute xl:left-1/2 xl:-translate-x-1/2">
                <a href="mailto:sotercare@gmail.com" className="hover:text-white transition-colors">
                  sotercare@gmail.com
                </a>
              </div>

              {/* Socials & Links */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 order-2 xl:order-3 items-center">
                <div className="flex gap-4 items-center">
                  <a href="tel:+94704888440" className="hover:text-white transition-colors">
                    +94 70 4888 440
                  </a>
                  <a href="https://www.instagram.com/sotercare_" target="_blank" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                    <Instagram size={20} />
                  </a>
                  <a href="https://www.linkedin.com/company/sotercare/" target="_blank" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
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
