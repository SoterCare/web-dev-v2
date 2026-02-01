'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const SplashScreen = () => {
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        // Check session storage to see if we've already shown the splash screen
        const hasViewed = sessionStorage.getItem('hasViewedSplash');

        if (hasViewed) {
            setIsVisible(false);
            return;
        }

        if (!containerRef.current || !logoRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setIsVisible(false);
                sessionStorage.setItem('hasViewedSplash', 'true');
            }
        });

        // Initial setup
        gsap.set(containerRef.current, { yPercent: 0 });
        gsap.set(logoRef.current, { scale: 0.8, opacity: 0 });

        // Breathing/Pulse Animation (Simulating loading)
        tl.to(logoRef.current, {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power2.out"
        })
            .to(logoRef.current, {
                scale: 0.9,
                duration: 1,
                yoyo: true,
                repeat: 1, // Pulse once
                ease: "sine.inOut"
            })
            // Exit Animation - Slide Up Reveal
            .to(containerRef.current, {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut", // Smooth dramatic exit
                delay: 0.2
            });

    }, { scope: containerRef });

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center h-screen w-screen overflow-hidden"
        >
            <div className="relative w-28 h-28 md:w-40 md:h-40">
                <Image
                    ref={logoRef}
                    src="/assets/SoterCare-centered-logo.png"
                    alt="SoterCare Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
};

export default SplashScreen;
