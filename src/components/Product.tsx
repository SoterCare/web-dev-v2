'use client';

import Image from 'next/image';
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Product = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
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
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="product"
      ref={sectionRef}
      className="relative z-20 w-full -mt-1 overflow-hidden bg-transparent"
    >
      {/* Dotted Background removed (global) */}

      <div ref={contentRef} className="relative z-10 flex flex-col w-full">
        {/* --- Section 1: IoT Devices --- */}
        <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 pt-24 md:p-8 md:pt-32">
          <div className="flex flex-col justify-center w-full gap-12 mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col w-full gap-2">
              <span className="bg-bg-card px-8 md:px-10 py-2 md:py-3 rounded-[2rem] flex items-center justify-center mb-2 md:mb-4 shadow-m border-none text-sm md:text-base font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
                Product
              </span>
              <h2 className="text-4xl font-bold leading-none tracking-tight text-center md:text-5xl lg:text-8xl md:text-left">
                IoT Devices
              </h2>
            </div>

            {/* IoT Grid */}
            <div className="flex flex-col gap-8 pl-0 md:gap-12 md:pl-10">
              {/* Item 1 */}
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-16">
                <div className="flex flex-col items-center text-center md:w-1/2 md:items-end md:text-right">
                  <h3 className="mb-4 text-3xl font-bold">The Thigh Node</h3>
                  <p className="max-w-md text-lg text-text-muted">
                    A discreet, upper-thigh wearable that monitors body motion and hygiene, acting as the primary guardian for detecting falls and incontinence.
                  </p>
                </div>
                <div className="flex justify-center md:w-1/2 md:justify-start">
                  <Image
                    src="/assets/features/the-thigh-node.png"
                    alt="The Thigh Node"
                    width={300}
                    height={220}
                    style={{ width: 'auto', height: 'auto' }}
                    className="object-contain transition-transform duration-500 hover:scale-105 will-change-transform"
                  />
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row-reverse md:gap-16">
                <div className="flex flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
                  <h3 className="mb-4 text-3xl font-bold">The Wrist Node</h3>
                  <p className="max-w-md text-lg text-text-muted">
                    A lightweight, comfortable wrist wearable designed for 24/7 continuous vital sign tracking, ensuring redundancy.
                  </p>
                </div>
                <div className="flex justify-center md:w-1/2 md:justify-end">
                  <Image
                    src="/assets/features/the-wrist-node.png"
                    alt="The Wrist Node"
                    width={300}
                    height={220}
                    style={{ width: 'auto', height: 'auto' }}
                    className="object-contain transition-transform duration-500 hover:scale-105 will-change-transform"
                  />
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-16">
                <div className="flex flex-col items-center text-center md:w-1/2 md:items-end md:text-right">
                  <h3 className="mb-4 text-3xl font-bold">The Edge Gateway</h3>
                  <p className="max-w-md text-lg text-text-muted">
                    The intelligent central hub that processes machine learning models locally, ensuring instant alerts and offline safety.
                  </p>
                </div>
                <div className="flex justify-center md:w-1/2 md:justify-start">
                  <Image
                    src="/assets/features/the-edge-gateway1.png"
                    alt="The Edge Gateway"
                    width={300}
                    height={220}
                    style={{ width: 'auto', height: 'auto' }}
                    className="object-contain transition-transform duration-500 hover:scale-105 will-change-transform"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Section 2: Mobile App --- */}
        <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 pt-20 md:p-8">
          <div className="flex flex-col items-center justify-center w-full mx-auto max-w-7xl">
            <h2 className="mb-10 text-4xl font-bold text-center md:text-6xl md:mb-16">
              Mobile App
            </h2>

            <div className="relative w-full max-w-7xl mx-auto min-h-auto md:min-h-[700px] flex flex-col md:block items-center justify-center">
              {/* Central Image */}
              <div className="relative z-10 w-full max-w-lg mx-auto md:max-w-3xl md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                <Image
                  src="/assets/features/UI-Mockup.png"
                  alt="Mobile App UI Mockup"
                  width={1200}
                  height={1000}
                  className="object-contain w-full h-auto drop-shadow-2xl"
                />
              </div>

              {/* Mobile List View */}
              <div className="z-20 flex flex-col w-full gap-4 mt-8 md:hidden">
                {[
                  {
                    text: 'Recycle Bin',
                    description:
                      'A unique "Human-in-the-Loop" feature that allows caregivers to flag false alarms—such as a heavy sit-down mistaken for a fall—moving them to a recycle bin to retrain the AI model.',
                  },
                  {
                    text: 'AI-Powered Summaries',
                    description:
                      'Integrates a Large Language Model (LLM) to instantly convert complex sensor data into clear, natural language reports.',
                  },
                  {
                    text: 'Real-Time Vitals',
                    description:
                      "Provides an immediate, high-visibility snapshot of the user's current status by displaying live Heart Rate, Blood Oxygen (SpO2), and Body Temperature.",
                  },
                  {
                    text: 'Password-less Auth',
                    description:
                      'Lowers the technical barrier for elderly or non-tech-savvy caregivers by replacing complex passwords with simple One-Time Passwords (OTP) and Google Sign-In.',
                  },
                  {
                    text: 'Data Export',
                    description:
                      'Empowers caregivers to share accurate, data-driven insights with healthcare professionals by generating downloadable PDF or CSV reports.',
                  },
                  {
                    text: 'System Timeline',
                    description:
                      'Offers complete transparency by logging not just health incidents but also system reliability events like "Gateway Disconnected".',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-6 border shadow-sm bg-bg-card rounded-2xl border-black/5"
                  >
                    <h3 className="mb-2 text-xl font-bold">{item.text}</h3>
                    <p className="text-sm leading-relaxed text-text-muted">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop Floating Labels */}
              {[
                {
                  text: 'Recycle Bin',
                  description:
                    'A unique "Human-in-the-Loop" feature that allows caregivers to flag false alarms—such as a heavy sit-down mistaken for a fall—moving them to a recycle bin to retrain the AI model, thereby constantly improving system accuracy and reducing alert fatigue.',
                  pos: 'top-10 left-[5%] md:left-[15%]',
                },
                {
                  text: 'AI-Powered Health Summaries',
                  description:
                    'Integrates a Large Language Model (LLM) to instantly convert complex sensor data into clear, natural language reports, acting as a personal "medical interpreter" that summarizes daily health trends, risks, and events in plain English for non-technical users.',
                  pos: 'top-[40%] left-[0%] md:left-[5%]',
                },
                {
                  text: 'Real-Time Vitals Dashboard',
                  description:
                    "Provides an immediate, high-visibility snapshot of the user's current status by displaying live Heart Rate, Blood Oxygen (SpO2), and Body Temperature, ensuring caregivers can verify critical health metrics at a single glance.",
                  pos: 'bottom-20 left-[5%] md:left-[15%]',
                },
                {
                  text: 'Password-less Authentication',
                  description:
                    'Lowers the technical barrier for elderly or non-tech-savvy caregivers by replacing complex passwords with simple One-Time Passwords (OTP) and Google Sign-In, ensuring secure and frustration-free access to the system.',
                  pos: 'top-10 right-[5%] md:right-[15%]',
                },
                {
                  text: 'Medical-Grade Data Export',
                  description:
                    'Empowers caregivers to share accurate, data-driven insights with healthcare professionals by generating downloadable PDF or CSV reports of falls, vitals, and activity history with a single tap, facilitating better medical consultations.',
                  pos: 'top-[40%] right-[0%] md:right-[5%]',
                },
                {
                  text: 'Comprehensive System Timeline',
                  description:
                    'Offers complete transparency by logging not just health incidents (like falls or hygiene alerts) but also system reliability events (like "Gateway Disconnected"), giving a holistic, chronological view of both patient safety and device performance.',
                  pos: 'bottom-20 right-[5%] md:right-[15%]',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`absolute ${item.pos} z-20 hidden md:block group hover:z-50`}
                >
                  <div className="px-6 py-3 transition-all duration-300 ease-out border cursor-default bg-bg-card/90 backdrop-blur-md shadow-m border-white/20 rounded-2xl w-fit">
                    <div className="flex flex-col items-start">
                      <span className="block text-xl font-semibold transition-all text-text whitespace-nowrap group-hover:mb-2">
                        {item.text}
                      </span>
                      <p className="w-0 overflow-hidden text-sm leading-relaxed whitespace-normal transition-all duration-300 ease-in-out opacity-0 text-text-muted max-h-0 group-hover:max-h-80 group-hover:opacity-100 group-hover:w-72">
                        {item.description}
                      </p>
                    </div>
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