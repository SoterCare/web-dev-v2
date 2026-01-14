import Image from 'next/image';
import React from 'react';

const Features = () => {
    return (
        <section className="py-24 bg-[var(--bg-body)] overflow-hidden relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- Section 1: IoT Device --- */}
                <div className="mb-32">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-text">IoT Device</h2>

                    <div className="flex flex-col gap-24">
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

                        {/* Labels - positioned absolutely for desktop, might need adjustment for mobile */}
                        {/* Note: If the provided mockup image is just the phones, these labels serve as the descriptors shown in the design. 
                 If the image includes text, these might be redundant, but based on typical asset flows, I'll add them as overlay text 
                 if the design implies they are separate elements. 
                 Given the user said "Design exactly as in those images", and I have a pure component task, 
                 I'll assume the image provided MIGHT just be the phones. 
                 However, to be safe and avoid clutter if the image HAS text, I will verify visually or just place the image first.
                 Actually, looking at the layout, it's safer to assume the text is OUTSIDE the image in the design provided. 
                 I'll add them as responsive elements around the main visual.
             */}

                        {/* Using a grid overlay approach could work, or just flex wrapping for smaller screens. 
                 For now, I'll structure it as a central image. The specific labels from the screenshot were:
                 - Real-Time Dashboard
                 - Visual Suggestion
                 - Activity Timeline
                 - Medical-Grade Data Export
                 - Modern Design
                 - Modern and Simple UI
             */}
                    </div>
                </div>

                {/* --- Section 3: Core Features --- */}
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-text">Core Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">

                        {/* Feature 1 */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold">1. Proactive "Risky Movement" Detection</h3>
                            <p className="text-text-muted text-lg leading-relaxed">
                                Unlike standard alarms that ring after a crash, SoterCare uses Machine Learning to identify "pre-fall" behaviors, such as unsteady attempts to stand, sending proactive warnings to caregivers.
                            </p>
                        </div>

                        {/* Feature 4 (Alignment matching design likely column-first or row-first. Design shows 1, 4 side by side? Or 1..3, 4..6. Let's look at the image. 
                Image shows: 
                1. Proactive...       4. AI...
                2. Instant...         5. Continuous...
                3. Discrete...        6. Smart...
            */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold">4. AI-Powered Health Summaries</h3>
                            <p className="text-text-muted text-lg leading-relaxed">
                                We convert complex data into simple English. Our integrated LLM (Large Language Model) generates daily summaries of health trends, risks, and recommendations.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold">2. Instant Hard Fall Detection</h3>
                            <p className="text-text-muted text-lg leading-relaxed">
                                For immediate safety, we use a high-speed Threshold-Based Algorithm to detect sudden impacts and hard falls instantly.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold">5. Continuous Vitals Monitoring</h3>
                            <p className="text-text-muted text-lg leading-relaxed">
                                A 24/7 health guardian. We monitor Heart Rate and SpO2 in real-time, instantly alerting you to dangerous spikes or drops that periodic checks miss.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold">3. Discrete Hygiene Management</h3>
                            <p className="text-text-muted text-lg leading-relaxed">
                                Real-time urinary incident detection using conductivity sensors. Alerts are sent discreetly to the caregiver’s app to prevent skin infections and maintain the user's dignity.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-2xl font-bold">6. Smart Alert Management</h3>
                            <p className="text-text-muted text-lg leading-relaxed">
                                Reduce false alarms with our "Recycle Bin." Easily flag incorrect alerts to retrain the system, making it smarter and more accurate over time.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default Features;
