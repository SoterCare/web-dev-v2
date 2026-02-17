'use client';

import { useState, useRef } from 'react'; // Consolidated import
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // Added import
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { name: 'Product', href: '#product' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Blog', href: '#blog' },
  { name: 'Team', href: '#team' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const getLinkHref = (href: string) => {
    if (isHome) return href;
    return `/${href}`;
  };

  useGSAP(() => {
    gsap.fromTo(navRef.current,
      {
        width: "85%", // Initial "Longer" state
        maxWidth: "1280px"
      },
      {
        width: "95%", // Mobile default basically, or constrained desktop
        maxWidth: "900px", // Shorter state (current max-w-5xl)
        duration: 0.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: document.body,
          start: "+=300",
          end: "+=330",
          scrub: true,
        }
      }
    );


  }, []);

  return (
    <nav ref={navRef} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="bg-bg-card shadow-m border border-white/10 shadow-lg rounded-[1.5rem] px-6 py-4 flex justify-between items-center transition-all duration-300 relative z-50">

        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-2" scroll={isHome ? true : false}>
            <Image
              src="/assets/SoterCare-Primary-logo-brandblue.png"
              alt="SoterCare"
              width={0}
              height={0}
              sizes="100vw"
              className="h-10 w-auto object-contain"
              style={{ width: 'auto', height: '40px' }}
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={getLinkHref(link.href)}
              className="text-[#797979] hover:text-[black] transition-colors text-base font-medium"
              scroll={false}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <Link href="mailto:support@sotercare.com" className="bg-bg-card shadow-m text-foreground px-6 py-2 rounded-[1rem] font-bold text-base transition-all hover:scale-105 active:scale-95" scroll={false}>
            Get In Touch
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            className="text-[#797979] hover:text-[black] p-2 transition-transform active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`absolute top-full mt-2 left-0 w-full bg-bg-card shadow-m border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            href={getLinkHref(link.href)}
            className="text-text-muted hover:text-text hover:bg-black/5 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
            onClick={() => setIsOpen(false)}
            scroll={false}
          >
            {link.name}
          </Link>
        ))}
        <Link
          href="mailto:support@sotercare.com"
          className="bg-bg-panel shadow-m text-foreground px-6 py-3 rounded-xl font-bold text-lg text-center mt-2 transition-all active:scale-95"
          onClick={() => setIsOpen(false)}
          scroll={false}
        >
          Get In Touch
        </Link>
      </div>
    </nav>
  );
};


export default Navbar;
