import Image from 'next/image';
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Activity, BrainCircuit, Zap, HeartPulse, Droplets, BellRing } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Product = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // --- Background Parallax ---
        gsap.to(bgRef.current, {
            y: "30%", // Move background slightly vertically
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        });

        // --- Generic Fade Up Animation for Sections/Items ---
        const sections = gsap.utils.toArray<HTMLElement>('.feature-section-reveal');
        sections.forEach((section) => {
            gsap.fromTo(section,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%", // Reveal when top of section hits 80% viewport
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, { scope: containerRef });

    return (
        <section id="product" ref={containerRef} className="bg-[var(--bg-body)] relative z-10 w-full overflow-hidden -mt-1">
            {/* Dotted Background - Parallax Ref */}
            <div ref={bgRef} className="absolute inset-0 z-0 h-[120%] w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] -top-[10%]"></div>

            <div className="flex flex-col w-full relative z-10 text-text max-w-7xl mx-auto px-4 md:px-8 py-20 gap-20 md:gap-32">
                <div className="flex flex-col gap-2 w-full">
                <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-x font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
                    Product
                </span>

                    {/* --- Section 1: IoT Devices --- */}
                    <div className="flex flex-col gap-12 feature-section-reveal">
                        <h2 className="text-5xl md:text-8xl font-bold text-center md:text-left leading-none tracking-tight">
                            IoT Devices
                        </h2>

                        <div className="flex flex-col gap-16 md:gap-6 pl-0 md:pl-10">
                            {/* Item 1: The Thigh Node */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                                <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                                    <h3 className="text-3xl font-bold mb-4">The Thigh Node</h3>
                                    <p className="text-text-muted text-lg max-w-md">
                                        A discreet, upper-thigh wearable that monitors body motion and hygiene, acting as the primary guardian for detecting falls and incontinence without requiring camera surveillance.
                                    </p>
                                </div>
                                <div className="md:w-1/2 flex justify-center md:justify-start">
                                    <Image
                                        src="/assets/features/the-thigh-node.png"
                                        alt="The Thigh Node"
                                        width={300}
                                        height={220}
                                        className="object-contain hover:scale-105 transition-transform duration-500 will-change-transform"
                                    />
                                </div>
                            </div>

                            {/* Item 2: The Wrist Node */}
                            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-16">
                                <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                                    <h3 className="text-3xl font-bold mb-4">The Wrist Node</h3>
                                    <p className="text-text-muted text-lg max-w-md">
                                        A lightweight, comfortable wrist wearable designed for 24/7 continuous vital sign tracking, ensuring health monitoring redundancy even if the primary thigh node is inactive.
                                    </p>
                                </div>
                                <div className="md:w-1/2 flex justify-center md:justify-end">
                                    <Image
                                        src="/assets/features/the-wrist-node.png"
                                        alt="The Wrist Node"
                                        width={300}
                                        height={220}
                                        className="object-contain hover:scale-105 transition-transform duration-500 will-change-transform"
                                    />
                                </div>
                            </div>

                            {/* Item 3: The Edge Gateway */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                                <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                                    <h3 className="text-3xl font-bold mb-4">The Edge Gateway</h3>
                                    <p className="text-text-muted text-lg max-w-md">
                                        The intelligent central hub that processes machine learning models locally, ensuring instant alerts and offline safety even when internet connectivity is lost or unstable.
                                    </p>
                                </div>
                                <div className="md:w-1/2 flex justify-center md:justify-start">
                                    <Image
                                        src="/assets/features/the-edge-gateway1.png"
                                        alt="The Edge Gateway"
                                        width={300}
                                        height={220}
                                        className="object-contain hover:scale-105 transition-transform duration-500 will-change-transform"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Section 2: Mobile App --- */}
                <div className="flex flex-col items-center feature-section-reveal relative pt-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center">Mobile App</h2>

                    <div className="relative w-full max-w-7xl mx-auto min-h-[700px] flex items-center justify-center">
                        {/* Central Image */}
                        <div className="relative z-10 max-w-lg md:max-w-3xl w-full">
                            <Image
                                src="/assets/features/UI-Mockup.png"
                                alt="Mobile App UI Mockup"
                                width={1200}
                                height={1000}
                                className="w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </div>

                        {/* Floating Labels - Positioned absolutely around the center image */}
                        {[
                            { text: "Real-Time Dashboard", pos: "top-10 left-[5%] md:left-[15%]" },
                            { text: "Visual Suggestion", pos: "top-[40%] left-[0%] md:left-[5%]" },
                            { text: "Activity Timeline", pos: "bottom-20 left-[5%] md:left-[15%]" },
                            { text: "Medical-Grade Data Export", pos: "top-20 right-[5%] md:right-[15%]" },
                            { text: "Modern Design", pos: "top-[45%] right-[0%] md:right-[5%]" },
                            { text: "Simple UI", pos: "bottom-32 right-[5%] md:right-[15%]" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`absolute ${item.pos} z-20 hidden md:block`}
                            >
                                <div className="bg-bg-card/80 backdrop-blur-md shadow-lg border border-white/20 py-3 px-6 rounded-2xl whitespace-nowrap hover:scale-110 transition-transform cursor-default">
                                    <span className="text-xl font-semibold text-text">{item.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Section 3: Core Features --- */}
                <div className="w-full flex items-center justify-center p-8 feature-section-reveal">
                    <div className="w-full max-w-7xl mx-auto flex flex-col justify-center h-full">
                        <div className="flex flex-col gap-12">
                            <h2 className="text-5xl md:text-7xl font-bold text-right">Core Features</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    {
                                        title: '1. Proactive "Risky Movement" Detection',
                                        desc: 'Unlike standard alarms that ring after a crash, SoterCare uses Machine Learning to identify "pre-fall" behaviors, such as unsteady attempts to stand, sending proactive warnings to caregivers.',
                                        Icon: Activity,
                                        color: 'text-blue-500'
                                    },
                                    {
                                        title: '4. AI-Powered Health Summaries',
                                        desc: 'We convert complex data into simple English. Our integrated LLM (Large Language Model) generates daily summaries of health trends, risks, and recommendations.',
                                        Icon: BrainCircuit,
                                        color: 'text-purple-500'
                                    },
                                    {
                                        title: '2. Instant Hard Fall Detection',
                                        desc: 'For immediate safety, we use a high-speed Threshold-Based Algorithm to detect sudden impacts and hard falls instantly.',
                                        Icon: Zap,
                                        color: 'text-orange-500'
                                    },
                                    {
                                        title: '5. Continuous Vitals Monitoring',
                                        desc: 'A 24/7 health guardian. We monitor Heart Rate and SpO2 in real-time, instantly alerting you to dangerous spikes or drops that periodic checks miss.',
                                        Icon: HeartPulse,
                                        color: 'text-red-500'
                                    },
                                    {
                                        title: '3. Discrete Hygiene Management',
                                        desc: 'Real-time urinary incident detection using conductivity sensors. Alerts are sent discreetly to the caregiver\'s app to prevent skin infections and maintain the user\'s dignity.',
                                        Icon: Droplets,
                                        color: 'text-blue-400'
                                    },
                                    {
                                        title: '6. Smart Alert Management',
                                        desc: 'Reduce false alarms with our "Recycle Bin." Easily flag incorrect alerts to retrain the system, making it smarter and more accurate over time.',
                                        Icon: BellRing,
                                        color: 'text-yellow-500'
                                    },
                                ].map((feature, i) => (
                                    <div key={i} className="bg-bg-card p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-black/5 relative overflow-hidden group">
                                        <feature.Icon className={`absolute -bottom-4 -right-4 ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity w-32 h-32 rotate-12`} />
                                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                        <p className="text-text-muted leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Product;
