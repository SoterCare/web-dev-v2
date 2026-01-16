import Image from 'next/image';
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Product = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // No horizontal scroll logic needed.
    // We kept the import just in case, but no active GSAP hooks for layout.

    return (
        <section id="product" ref={containerRef} className="bg-[var(--bg-body)] relative z-20 -mt-1 w-full overflow-hidden">
            {/* Dotted Background */}
            <div className="dotted-bg absolute inset-0 z-0 h-full w-full"></div>

            <div className="relative z-10 flex flex-col w-full">

                {/* --- Section 1: IoT Devices --- */}
                <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 pt-24 md:pt-32">
                    <div className="w-full max-w-7xl mx-auto flex flex-col gap-12 justify-center">
                        {/* Header */}
                        <div className="flex flex-col gap-2 w-full">
                            <span className="bg-bg-card px-8 md:px-10 py-2 md:py-3 rounded-[2rem] flex items-center justify-center mb-2 md:mb-4 shadow-m border-none text-sm md:text-base font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
                                Product
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-8xl font-bold text-center md:text-left leading-none tracking-tight">
                                IoT Devices
                            </h2>
                        </div>

                        {/* IoT Grid */}
                        <div className="flex flex-col gap-8 md:gap-12 pl-0 md:pl-10">
                            {/* Item 1 */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                                <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                                    <h3 className="text-3xl font-bold mb-4">The Thigh Node</h3>
                                    <p className="text-text-muted text-lg max-w-md">
                                        A discreet, upper-thigh wearable that monitors body motion and hygiene, acting as the primary guardian for detecting falls and incontinence.
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

                            {/* Item 2 */}
                            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-16">
                                <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                                    <h3 className="text-3xl font-bold mb-4">The Wrist Node</h3>
                                    <p className="text-text-muted text-lg max-w-md">
                                        A lightweight, comfortable wrist wearable designed for 24/7 continuous vital sign tracking, ensuring redundancy.
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

                            {/* Item 3 */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
                                <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                                    <h3 className="text-3xl font-bold mb-4">The Edge Gateway</h3>
                                    <p className="text-text-muted text-lg max-w-md">
                                        The intelligent central hub that processes machine learning models locally, ensuring instant alerts and offline safety.
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
                <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 pt-20">
                    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
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

                            {/* Floating Labels */}
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
                </div>

            </div>
        </section>
    );
};

export default Product;
