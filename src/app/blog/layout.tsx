'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Navbar from '@/components/Navbar';
import SplashScreen from '@/components/SplashScreen';
import Footer from '@/components/Footer';

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const bgRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!bgRef.current) return;

        gsap.to(bgRef.current, {
            y: -300,
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
        <div className="min-h-screen bg-[#fafafa] text-foreground selection:bg-blue-100 selection:text-blue-900 relative">
            <div ref={bgRef} className="fixed top-0 left-0 z-0 h-[200%] w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none will-change-transform"></div>
            <SplashScreen />
            <Navbar />
            <div className="pt-32 relative z-10 min-h-screen pb-20">
                {children}
            </div>
            <Footer />
        </div>
    );
}
