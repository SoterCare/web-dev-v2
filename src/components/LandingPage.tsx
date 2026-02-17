"use client";

import { useRef } from 'react';

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

interface LandingPageProps {
    blogSection?: React.ReactNode;
}

export default function LandingPage({ blogSection }: LandingPageProps) {
    const bgRef = useRef<HTMLDivElement>(null);

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
            {blogSection}
            <Team />
            <FAQ />
            <Footer />
        </main>
    );
}
