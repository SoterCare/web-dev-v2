import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Activity, BrainCircuit, Zap, HeartPulse, Droplets, BellRing } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {

    }, { scope: containerRef });

    return (
        <section id="features" ref={containerRef} className="bg-[var(--bg-body)] relative z-10 w-full overflow-hidden">
            {/* Dotted Background */}
            <div className="dotted-bg absolute inset-0 z-0 h-full w-full"></div>
            {/* --- Section 3: Core Features --- */}
            <div className="w-full relative z-10 flex items-center justify-center px-8 pt-24 md:pt-32 pb-8 feature-section-reveal">
                <div className="w-full max-w-7xl mx-auto flex flex-col justify-center h-full">
                    <div className="flex flex-col gap-12">
                        <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-base font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
                            Features
                        </span>
                        <h2 className="text-5xl md:text-7xl font-bold text-left">Core Features</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: '1. Proactive "Risky Movement" Detection',
                                    desc: 'Unlike standard alarms that ring after a crash, SoterCare uses Machine Learning to identify "pre-fall" behaviors, such as unsteady attempts to stand, sending proactive warnings to caregivers.',
                                    Icon: Activity,
                                    color: 'text-blue-500',
                                    span: 'md:col-span-2'
                                },
                                {
                                    title: '4. AI-Powered Health Summaries',
                                    desc: 'We convert complex data into simple English. Integrated LLM generates daily summaries.',
                                    Icon: BrainCircuit,
                                    color: 'text-purple-500',
                                    span: 'md:col-span-1'
                                },
                                {
                                    title: '2. Instant Hard Fall Detection',
                                    desc: 'For immediate safety, we use a high-speed Threshold-Based Algorithm to detect sudden impacts and hard falls instantly.',
                                    Icon: Zap,
                                    color: 'text-orange-500',
                                    span: 'md:col-span-1'
                                },
                                {
                                    title: '5. Continuous Vitals Monitoring',
                                    desc: 'A 24/7 health guardian. We monitor Heart Rate and SpO2 in real-time, instantly alerting you to dangerous spikes or drops.',
                                    Icon: HeartPulse,
                                    color: 'text-red-500',
                                    span: 'md:col-span-2'
                                },
                                {
                                    title: '3. Discrete Hygiene Management',
                                    desc: 'Real-time urinary incident detection using conductivity sensors. Alerts are sent discreetly.',
                                    Icon: Droplets,
                                    color: 'text-blue-400',
                                    span: 'md:col-span-2'
                                },
                                {
                                    title: '6. Smart Alert Management',
                                    desc: 'Reduce false alarms with our "Recycle Bin." Easily flag incorrect alerts to retrain the system.',
                                    Icon: BellRing,
                                    color: 'text-yellow-500',
                                    span: 'md:col-span-1'
                                },
                            ].map((feature, i) => (
                                <div key={i} className={`bg-bg-card p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-black/5 relative overflow-hidden group ${feature.span} flex flex-col justify-between`}>
                                    <div>
                                        <feature.Icon className={`absolute -bottom-4 -right-4 ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity w-32 h-32 rotate-12`} />
                                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
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
