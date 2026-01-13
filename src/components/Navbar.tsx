'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="bg-black/40 backdrop-blur-md border border-white/10 shadow-lg rounded-[1.5rem] px-6 py-4 flex justify-between items-center transition-all duration-300 relative z-50">
        
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
           <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/img/SoterCare-Primary-logo-white.png"
                alt="SoterCare"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
           </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#" className="text-white/80 hover:text-white transition-colors text-base font-medium">
            Home
          </Link>
          <Link href="#features" className="text-white/80 hover:text-white transition-colors text-base font-medium">
            Features
          </Link>
          <Link href="#pricing" className="text-white/80 hover:text-white transition-colors text-base font-medium">
            Pricing
          </Link>
          <Link href="#faqs" className="text-white/80 hover:text-white transition-colors text-base font-medium">
            FAQs
          </Link>
          <Link href="#team" className="text-white/80 hover:text-white transition-colors text-base font-medium">
            Team
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <Link href="#contact" className="bg-white text-foreground px-6 py-2 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95">
            Get In Touch
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            className="text-white p-2 transition-transform active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`absolute top-full mt-2 left-0 w-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg rounded-[2rem] p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
          <Link 
            href="#" 
            className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="#features" 
            className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="#pricing" 
            className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            href="#faqs" 
            className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
            onClick={() => setIsOpen(false)}
          >
            FAQs
          </Link>
          <Link 
            href="#team" 
            className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all font-medium text-lg text-center"
            onClick={() => setIsOpen(false)}
          >
            Team
          </Link>
          <Link 
            href="#contact" 
            className="bg-white text-foreground px-6 py-3 rounded-xl font-bold text-lg text-center mt-2 transition-all active:scale-95"
            onClick={() => setIsOpen(false)}
          >
            Get In Touch
          </Link>
      </div>
    </nav>
  );
};

export default Navbar;
