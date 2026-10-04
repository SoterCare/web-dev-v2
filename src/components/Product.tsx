"use client";

import React, { useEffect } from "react";
import ModelFrame from "@/components/ModelFrame";

// The hardware behind the four steps. Rendered inside the How it works section.
const Product = () => {
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
    <div id="product" className="scroll-mt-24 md:scroll-mt-28 w-full flex flex-col gap-0">
      {/* Thigh node: Monitor */}
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
          <ModelFrame
            src="/models/thigh-node.html"
            title="Interactive 3D model of the SoterCare Thigh Node wearable"
          />
        </div>
      </div>

      {/* Ward gateway: Alert and Analyse */}
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
          <div className="w-full flex flex-col items-center md:items-end">
            <ModelFrame
              src="/models/edge-gateway.html"
              title="Interactive 3D model of the SoterCare gateway prototype"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Product;
