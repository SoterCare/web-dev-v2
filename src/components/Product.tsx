"use client";

import React, { useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { useSectionReveal } from "@/lib/useSectionReveal";

const iframeClass =
  "w-full max-w-[640px] h-[400px] md:h-[560px] md:-my-10 border-0 bg-transparent [mask-image:linear-gradient(to_bottom,#000_88%,transparent)]";

const Product = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, contentRef);

  // Forward wheel events from the 3D model iframes so Lenis keeps smooth-scrolling
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!e.data?.sotercareWheel) return;
      window.dispatchEvent(
        new WheelEvent("wheel", {
          deltaX: e.data.deltaX,
          deltaY: e.data.deltaY,
          deltaMode: e.data.deltaMode,
          bubbles: true,
          cancelable: true,
        }),
      );
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section
      id="product"
      ref={sectionRef}
      className="scroll-mt-24 md:scroll-mt-28 bg-transparent relative z-20 w-full overflow-hidden"
    >
      <div ref={contentRef} className="relative z-10 flex flex-col w-full">
        <div className="w-full flex flex-col items-center justify-center px-4 md:px-8 pt-16 md:pt-20 pb-0">
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-2 justify-center">
            <SectionHeader
              chip="Product"
              title="The Hardware"
              subtitle="One band per resident. One ward gateway per home."
            />

            <div className="flex flex-col gap-0 md:-mt-2">
              {/* Thigh node */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-8">
                <div className="order-2 md:order-none md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                  <h3 className="text-4xl md:text-5xl font-bold mb-4 md:mb-5">The Thigh Node</h3>
                  <p className="text-text-muted text-xl md:text-2xl leading-snug max-w-xl">
                    A soft thigh band worn under clothing, one per resident. Motion, moisture and
                    skin temperature sensors stream readings to the gateway over the home&apos;s
                    network. It charges over USB-C, and we are targeting a 7-day battery.
                  </p>
                </div>
                <div className="order-1 md:order-none w-full md:w-1/2 flex justify-center md:justify-start">
                  <iframe
                    src="/models/thigh-node.html"
                    title="Interactive 3D model of the SoterCare Thigh Node wearable"
                    loading="lazy"
                    className={iframeClass}
                  />
                </div>
              </div>

              {/* Ward gateway */}
              <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-2 md:gap-8 md:-mt-16">
                <div className="order-2 md:order-none md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 className="text-4xl md:text-5xl font-bold mb-4 md:mb-5">The Ward Gateway</h3>
                  <p className="text-text-muted text-xl md:text-2xl leading-snug max-w-xl">
                    A 15.6-inch touch screen for the whole home. It runs the gait model and the
                    alerts for every bed, works offline, and charges the nodes over USB-C. Its
                    overview screen shows every resident&apos;s status at once, so a carer sees who
                    is moving, resting, wet or needs help at a glance.
                  </p>
                </div>
                <div className="order-1 md:order-none w-full md:w-1/2 flex justify-center md:justify-end">
                  <iframe
                    src="/models/edge-gateway.html"
                    title="Interactive 3D model of the SoterCare Ward Gateway"
                    loading="lazy"
                    className={iframeClass}
                  />
                </div>
              </div>
            </div>

            {/* Backend and apps */}
            <div className="mt-6 md:mt-10 bg-bg-card rounded-3xl shadow-m p-8 md:p-10 max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Backend and apps</h3>
              <p className="text-text-muted text-lg leading-relaxed">
                The backend stores every reading and finds trends in gait, night stand-ups and
                moisture over weeks. Carers get alerts on their phones, families get the full
                picture in their own app, and AI writes the shift handover.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
