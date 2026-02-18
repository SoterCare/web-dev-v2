"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';

const BlogFooter = () => {
    return (
        <footer className="w-full py-12 px-8 bg-bg-panel relative z-10 border-t border-black/5">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Logo & Copyright */}
                <div className="flex flex-col items-center md:items-start gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/assets/SoterCare-Primary-logo-brandblue.png"
                            alt="SoterCare"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="h-8 w-auto object-contain"
                            style={{ width: 'auto', height: '32px' }}
                        />
                    </Link>
                    <p className="text-text-muted text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} SoterCare. All Rights Reserved.
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-text-muted">
                    <Link href="/#product" className="hover:text-text transition-colors">Product</Link>
                    <Link href="/#features" className="hover:text-text transition-colors">Features</Link>
                    <Link href="/#pricing" className="hover:text-text transition-colors">Pricing</Link>
                    <Link href="/#team" className="hover:text-text transition-colors">Team</Link>
                    <Link href="/blog" className="hover:text-text transition-colors">Blog</Link>
                </div>

                {/* Socials & Contact */}
                <div className="flex flex-col items-center md:items-end gap-2">
                    <div className="flex gap-4">
                        <a href="https://www.instagram.com/sotercare_" target="_blank" className="text-text-muted hover:text-text transition-colors">
                            <Instagram size={20} />
                        </a>
                        <a href="https://www.linkedin.com/company/sotercare/" target="_blank" className="text-text-muted hover:text-text transition-colors">
                            <Linkedin size={20} />
                        </a>
                    </div>
                    <a href="mailto:support@sotercare.com" className="text-sm text-text-muted hover:text-text transition-colors">
                        support@sotercare.com
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default BlogFooter;
