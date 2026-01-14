import Image from 'next/image';
import React from 'react';
import { Activity, BrainCircuit, Zap, HeartPulse, Droplets, BellRing } from 'lucide-react';

const Features = () => {
    return (
        <section className="py-18 bg-[var(--bg-body)] overflow-hidden relative z-10">
            {/* Dotted Background */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] "></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* --- Section 1: IoT Device --- */}
                <div className="mb-32">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-text">IoT Device</h2>

                    <div className="flex flex-col gap-10">
                        {/* Item 1: The Thigh Node */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                                <h3 className="text-2xl font-bold mb-4">The Thigh Node</h3>
                                <p className="text-text-muted text-lg max-w-md">
                                    A discreet, upper-thigh wearable that monitors body motion and hygiene, acting as the primary guardian for detecting falls and incontinence without requiring camera surveillance.
                                </p>
                            </div>
                            <div className="md:w-1/2 flex justify-center md:justify-start">
                                <Image
                                    src="/assets/features/the-thigh-node.png"
                                    alt="The Thigh Node"
                                    width={300}
                                    height={200}
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Item 2: The Wrist Node */}
                        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
                            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                                <h3 className="text-2xl font-bold mb-4">The Wrist Node</h3>
                                <p className="text-text-muted text-lg max-w-md">
                                    A lightweight, comfortable wrist wearable designed for 24/7 continuous vital sign tracking, ensuring health monitoring redundancy even if the primary thigh node is inactive.
                                </p>
                            </div>
                            <div className="md:w-1/2 flex justify-center md:justify-end">
                                <Image
                                    src="/assets/features/the-wrist-node.png"
                                    alt="The Wrist Node"
                                    width={300}
                                    height={200}
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Item 3: The Edge Gateway */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                                <h3 className="text-2xl font-bold mb-4">The Edge Gateway</h3>
                                <p className="text-text-muted text-lg max-w-md">
                                    The intelligent central hub that processes machine learning models locally, ensuring instant alerts and offline safety even when internet connectivity is lost or unstable.
                                </p>
                            </div>
                            <div className="md:w-1/2 flex justify-center md:justify-start">
                                <Image
                                    src="/assets/features/the-edge-gateway.png"
                                    alt="The Edge Gateway"
                                    width={300}
                                    height={200}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Section 2: Mobile App --- */}
                <div className="mb-32">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-text">Mobile App</h2>
                    <div className="relative flex justify-center items-center min-h-[600px] w-full">
                        {/* Central Image */}
                        <div className="relative z-10 max-w-4xl w-full">
                            <Image
                                src="/assets/features/UI-Mockup.png"
                                alt="Mobile App UI Mockup"
                                width={1000}
                                height={800}
                                className="w-full h-auto object-contain"
                            />
                        </div>

                        {/* Floating Labels - Hidden on small mobile, visible on md+ */}
                        {/* Left Side */}
                        <div className="absolute top-[20%] left-[5%] md:left-[10%] lg:left-[15%] z-20 hidden md:block">
                            <div className="bg-bg-card shadow-m py-4 px-8 rounded-2xl">
                                <span className="text-xl font-bold text-text">Real-Time Dashboard</span>
                            </div>
                        </div>
                        <div className="absolute top-[48%] left-[0%] md:left-[5%] lg:left-[10%] z-20 hidden md:block">
                            <div className="bg-bg-card shadow-m py-4 px-8 rounded-2xl">
                                <span className="text-xl font-bold text-text">Visual Suggestion</span>
                            </div>
                        </div>
                        <div className="absolute bottom-[20%] left-[5%] md:left-[10%] lg:left-[15%] z-20 hidden md:block">
                            <div className="bg-bg-card shadow-m py-4 px-8 rounded-2xl">
                                <span className="text-xl font-bold text-text">Activity Timeline</span>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="absolute top-[22%] right-[5%] md:right-[10%] lg:right-[15%] z-20 hidden md:block">
                            <div className="bg-bg-card shadow-m py-4 px-8 rounded-2xl">
                                <span className="text-xl font-bold text-text">Medical-Grade Data Export</span>
                            </div>
                        </div>
                        <div className="absolute top-[52%] right-[0%] md:right-[5%] lg:right-[10%] z-20 hidden md:block">
                            <div className="bg-bg-card shadow-m py-4 px-8 rounded-2xl">
                                <span className="text-xl font-bold text-text">Modern Design</span>
                            </div>
                        </div>
                        <div className="absolute bottom-[25%] right-[5%] md:right-[10%] lg:right-[15%] z-20 hidden md:block">
                            <div className="bg-bg-card shadow-m py-4 px-8 rounded-2xl">
                                <span className="text-xl font-bold text-text">Modern and Simple UI</span>
                            </div>
                        </div>

                        {/* Mobile View: Stacked Labels (Optional, but good for completeness if requested, otherwise just hidden is cleaner for mockup) 
                            For now, keeping them hidden on mobile to avoid effortless clutter over the image. 
                        */}
                    </div>
                </div>

                {/* --- Section 3: Core Features --- */}
                {/* --- Section 3: Core Features --- */}
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-text">Core Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                        {/* Feature 1 */}
                        <div className="md:col-span-7 bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[2rem] p-8 flex flex-col gap-4 relative overflow-hidden">
                            <h3 className="text-2xl font-bold relative z-10">1. Proactive "Risky Movement" Detection</h3>
                            <p className="text-text-muted text-lg leading-relaxed relative z-10">
                                Unlike standard alarms that ring after a crash, SoterCare uses Machine Learning to identify "pre-fall" behaviors, such as unsteady attempts to stand, sending proactive warnings to caregivers.
                            </p>
                            <Activity className="absolute -bottom-6 -right-6 text-blue-500 opacity-[0.07] rotate-12" size={140} />
                        </div>

                        {/* Feature 4 */}
                        <div className="md:col-span-5 bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[2rem] p-8 flex flex-col gap-4 relative overflow-hidden">
                            <h3 className="text-2xl font-bold relative z-10">4. AI-Powered Health Summaries</h3>
                            <p className="text-text-muted text-lg leading-relaxed relative z-10">
                                We convert complex data into simple English. Our integrated LLM (Large Language Model) generates daily summaries of health trends, risks, and recommendations.
                            </p>
                            <BrainCircuit className="absolute -bottom-6 -right-6 text-purple-500 opacity-[0.07] rotate-12" size={140} />
                        </div>

                        {/* Feature 2 */}
                        <div className="md:col-span-5 bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[2rem] p-8 flex flex-col gap-4 relative overflow-hidden">
                            <h3 className="text-2xl font-bold relative z-10">2. Instant Hard Fall Detection</h3>
                            <p className="text-text-muted text-lg leading-relaxed relative z-10">
                                For immediate safety, we use a high-speed Threshold-Based Algorithm to detect sudden impacts and hard falls instantly.
                            </p>
                            <Zap className="absolute -bottom-6 -right-6 text-orange-500 opacity-[0.07] rotate-12" size={140} strokeWidth={1} />
                        </div>

                        {/* Feature 5 */}
                        <div className="md:col-span-7 bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[2rem] p-8 flex flex-col gap-4 relative overflow-hidden">
                            <h3 className="text-2xl font-bold relative z-10">5. Continuous Vitals Monitoring</h3>
                            <p className="text-text-muted text-lg leading-relaxed relative z-10">
                                A 24/7 health guardian. We monitor Heart Rate and SpO2 in real-time, instantly alerting you to dangerous spikes or drops that periodic checks miss.
                            </p>
                            <HeartPulse className="absolute -bottom-6 -right-6 text-red-500 opacity-[0.07] rotate-12" size={140} />
                        </div>

                        {/* Feature 3 */}
                        <div className="md:col-span-6 bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[2rem] p-8 flex flex-col gap-4 relative overflow-hidden">
                            <h3 className="text-2xl font-bold relative z-10">3. Discrete Hygiene Management</h3>
                            <p className="text-text-muted text-lg leading-relaxed relative z-10">
                                Real-time urinary incident detection using conductivity sensors. Alerts are sent discreetly to the caregiver’s app to prevent skin infections and maintain the user's dignity.
                            </p>
                            <Droplets className="absolute -bottom-6 -right-6 text-blue-400 opacity-[0.07] rotate-12" size={140} />
                        </div>

                        {/* Feature 6 */}
                        <div className="md:col-span-6 bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[2rem] p-8 flex flex-col gap-4 relative overflow-hidden">
                            <h3 className="text-2xl font-bold relative z-10">6. Smart Alert Management</h3>
                            <p className="text-text-muted text-lg leading-relaxed relative z-10">
                                Reduce false alarms with our "Recycle Bin." Easily flag incorrect alerts to retrain the system, making it smarter and more accurate over time.
                            </p>
                            <BellRing className="absolute -bottom-6 -right-6 text-yellow-500 opacity-[0.07] rotate-12" size={140} />
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default Features;
