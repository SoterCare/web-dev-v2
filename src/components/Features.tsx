'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Activity, BrainCircuit, Zap, HeartPulse, Droplets, BellRing, LayoutDashboard } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(contentRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                    onEnter: () => localStorage.setItem('features-animated', 'true')
                }
            }
        );
    }, { scope: sectionRef });

    return (
        <section id="features" ref={sectionRef} className="scroll-mt-24 md:scroll-mt-28 bg-transparent relative z-10 w-full overflow-hidden">
            {/* Dotted Background removed (global) */}
            {/* --- Section 3: Core Features --- */}
            <div ref={contentRef} className="w-full relative z-10 flex items-center justify-center px-8 pt-16 md:pt-24 pb-8 feature-section-reveal">
                <div className="w-full max-w-7xl mx-auto flex flex-col justify-center h-full">
                    <div className="flex flex-col gap-12">
                        <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-base font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
                            Features
                        </span>
                        <h2 className="text-5xl md:text-7xl font-bold text-left">Core Features</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Gait Analysis ML Model',
                                    desc: 'A unified Machine Learning model that monitors movement and posture transitions. It specifically detects when a patient is attempting to stand up or sit down, sending real-time alerts to caregivers to prevent accidents during high-risk transitions.',
                                    Icon: Activity,
                                    color: 'text-blue-500',
                                    span: 'md:col-span-2'
                                },
                                {
                                    title: 'AI-Powered Health Summaries',
                                    desc: 'We convert complex data into simple English. Integrated LLM generates daily summaries.',
                                    Icon: BrainCircuit,
                                    color: 'text-purple-500',
                                    span: 'md:col-span-1'
                                },
                                {
                                    title: 'Instant Hard Fall Detection',
                                    desc: 'For immediate safety, we use a high-speed Threshold-Based Algorithm to detect sudden impacts and hard falls instantly.',
                                    Icon: Zap,
                                    color: 'text-orange-500',
                                    span: 'md:col-span-1'
                                },
                                {
                                    title: 'Quick Web Dashboard Access',
                                    desc: 'Access your health data instantly from any device. Log in to our secure web dashboard for detailed analytics, historical data, and real-time vitals monitoring.',
                                    Icon: LayoutDashboard,
                                    color: 'text-indigo-500',
                                    span: 'md:col-span-2'
                                },
                                {
                                    title: 'Discrete Hygiene Management',
                                    desc: 'Real-time urinary incident detection using conductivity sensors. Alerts are sent discreetly.',
                                    Icon: Droplets,
                                    color: 'text-blue-400',
                                    span: 'md:col-span-2'
                                },
                                {
                                    title: 'Smart Alert Management',
                                    desc: 'Reduce false alarms with our "Recycle Bin." Easily flag incorrect alerts to retrain the system.',
                                    Icon: BellRing,
                                    color: 'text-yellow-500',
                                    span: 'md:col-span-1'
                                },
                            ].map((feature, i) => (
                                <div key={i} className={`bg-bg-card p-8 rounded-3xl shadow-sm transition-all border border-black/5 relative overflow-hidden group ${feature.span} flex flex-col justify-between`}>
                                    <div>
                                        <feature.Icon className={`absolute -bottom-4 -right-4 ${feature.color} opacity-5 group-hover:opacity-30 transition-opacity w-32 h-32 rotate-12`} />
                                        <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                        <p className="text-text-muted leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
