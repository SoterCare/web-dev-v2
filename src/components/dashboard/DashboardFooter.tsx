import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Instagram, Linkedin } from 'lucide-react';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white mt-auto mt-12">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-medium text-[var(--text-muted)]">
        
        {/* Copyright */}
        <div className="text-center md:text-left">
          <span>&copy; {currentYear} SoterCare. All Rights Reserved.</span>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <Link href="mailto:support@sotercare.com" className="hover:text-[var(--text)] transition-colors flex items-center gap-2">
            <Mail size={16} />
            support@sotercare.com
          </Link>
          <a href="tel:+94704888440" className="hover:text-[var(--text)] transition-colors flex items-center gap-2">
            <Phone size={16} />
            +94 70 4888 440
          </a>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-4">
          <Link href="https://www.instagram.com/sotercare_" target="_blank" className="hover:text-[var(--text)] transition-colors p-2 hover:bg-gray-100 rounded-full">
            <Instagram size={18} />
          </Link>
          <Link href="https://www.linkedin.com/company/sotercare/" target="_blank" className="hover:text-[var(--text)] transition-colors p-2 hover:bg-gray-100 rounded-full">
            <Linkedin size={18} />
          </Link>
        </div>

      </div>
    </footer>
  );
}
