import Link from 'next/link';
import { Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-[#F5F5F7]/80 backdrop-blur-xl border-b border-white/20 transition-all duration-300 font-urw">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
             <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-black text-foreground tracking-tighter">
                  SoterCare
                </span>
             </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            <Link href="#" className="text-foreground/60 hover:text-foreground transition-colors font-bold text-sm tracking-wide uppercase">
              Home
            </Link>
            <Link href="#features" className="text-foreground/60 hover:text-foreground transition-colors font-bold text-sm tracking-wide uppercase">
              Features
            </Link>
            <Link href="#blog" className="text-foreground/60 hover:text-foreground transition-colors font-bold text-sm tracking-wide uppercase">
              Blog
            </Link>
            <Link href="#about" className="text-foreground/60 hover:text-foreground transition-colors font-bold text-sm tracking-wide uppercase">
              About us
            </Link>
            <Link href="#contact" className="text-foreground/60 hover:text-foreground transition-colors font-bold text-sm tracking-wide uppercase">
              Contact us
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button className="bg-foreground text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-black/20 hover:shadow-black/40 hover:-translate-y-0.5">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-foreground p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
