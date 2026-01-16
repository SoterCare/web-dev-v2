import Link from 'next/link';
import { Instagram, Linkedin, Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-bg-body py-8 px-4 h-full">
      <div className="w-full mx-auto max-w-[98%] bg-black text-white rounded-[2.5rem] relative overflow-hidden min-h-[85vh] flex flex-col justify-between">

        {/* Main Content Center */}
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center mt-20">
          <p className="text-gray-300 text-xl md:text-2xl font-light mb-4 tracking-wide">
            That&apos;s our story
          </p>
          <h2 className="text-5xl md:text-8xl font-normal tracking-tight mb-12 font-serif italic text-white/90">
            Wellness Simplified.
          </h2>
          <Link
            href="#"
            className="bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-3"
          >
            <Play size={20} fill="currentColor" />
            Watch a Demo
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="w-full px-8 pb-8 pt-20">
          <div className="border-t border-white/10 pt-8 flex flex-col xl:flex-row justify-between items-center text-sm md:text-base text-gray-400 gap-6 md:gap-4 relative">
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
    </footer>
  );
};

export default Footer;
