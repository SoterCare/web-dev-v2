"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, ArrowRight, Mail } from 'lucide-react';

const BlogFooter = () => {
    return (
        <footer className="bg-bg-body py-8 px-4 w-full">
            <div className="w-full mx-auto max-w-[98%] text-white rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between shadow-2xl">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <Image
                        src="/assets/footer_1BNW.png"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-[#a0cbdb]/90" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 md:p-16 flex flex-col gap-16">

                    {/* Top Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

                        {/* Brand Column */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <Link href="/" className="inline-block">
                                <Image
                                    src="/assets/SoterCare-Primary-logo-white.png"
                                    alt="SoterCare"
                                    width={180}
                                    height={40}
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>
                            <p className="text-white/80 text-lg leading-relaxed max-w-sm">
                                Wellness Simplified. Empowering seniors with AI-driven care and peace of mind for families everywhere.
                            </p>
                        </div>

                        {/* Links Column */}
                        <div className="lg:col-span-3 lg:col-start-6 flex flex-col gap-6">
                            <h4 className="font-bold text-xl">Explore</h4>
                            <nav className="flex flex-col gap-4 text-white/80">
                                <Link href="/#product" className="hover:text-white hover:translate-x-1 transition-all w-fit">Product</Link>
                                <Link href="/#features" className="hover:text-white hover:translate-x-1 transition-all w-fit">Features</Link>
                                <Link href="/#team" className="hover:text-white hover:translate-x-1 transition-all w-fit">Team</Link>
                                <Link href="/blog" className="hover:text-white hover:translate-x-1 transition-all w-fit font-semibold text-white">Blog</Link>
                            </nav>
                        </div>

                        {/* Newsletter Column */}
                        <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-6">
                            <h4 className="font-bold text-xl">Stay Updated</h4>
                            <p className="text-white/80">
                                Subscribe to our newsletter for the latest updates on elderly care technology and wellness tips.
                            </p>
                            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full bg-white text-text placeholder:text-text-muted/70 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                                        required
                                    />
                                </div>
                                <button type="submit" className="bg-[#2f2f2f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2 group">
                                    Subscribe <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-white/20"></div>

                    {/* Bottom Section */}
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-white/70 text-sm">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            <p>&copy; {new Date().getFullYear()} SoterCare. All Rights Reserved.</p>
                            <div className="flex gap-6">
                                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                                <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <a href="https://www.instagram.com/sotercare_" target="_blank" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all text-white">
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.linkedin.com/company/sotercare/" target="_blank" className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all text-white">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default BlogFooter;
