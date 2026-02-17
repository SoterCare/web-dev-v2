"use client";

import { useRef, useLayoutEffect } from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ReactLenis, useLenis } from 'lenis/react';

import Navbar from '@/components/Navbar';
import SplashScreen from '@/components/SplashScreen';
import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import Product from '@/components/Product';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Team from '@/components/Team';
import Footer from '@/components/Footer';

// ... imports ...

export default function LandingPage() {
    const bgRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();

    useGSAP(() => {
        if (!bgRef.current) return;

        gsap.to(bgRef.current, {
            y: -300, // Move up slowly (parallax effect)
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
    });

    // Handle hash scrolling with Lenis
    useLayoutEffect(() => {
        if (lenis && window.location.hash) {
            const hash = window.location.hash;
            const element = document.querySelector(hash);
            if (element) {
                // Determine if we need to offset for fixed header (e.g., Navbar)
                // Lenis might handle this if attributes are set, but let's be safe or use default
                // Using a slight delay to ensure layout is stable or just immediate
                setTimeout(() => {
                    lenis.scrollTo(hash, { offset: 0, immediate: true });
                }, 0);
            }
        }
    }, [lenis]);

    return (
        <main className="min-h-screen bg-[#fafafa] text-foreground selection:bg-blue-100 selection:text-blue-900 relative">
            <div ref={bgRef} className="fixed top-0 left-0 z-0 h-[200%] w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none will-change-transform"></div>
            <SplashScreen />
            <Navbar />
            <Hero />
            <Mission />
            <Product />
            <Features />
            <Pricing />
            <Team />
            <FAQ />
            <Footer />
        </main>
    );
}
