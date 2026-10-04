"use client";

import { useEffect, useRef, useState } from "react";

interface ModelFrameProps {
  src: string;
  title: string;
}

// Each 3D model pulls in three.js and starts a WebGL render loop. Mounting it only when it is
// about to scroll into view keeps that cost out of the scroll through the sections above it.
const ModelFrame = ({ src, title }: ModelFrameProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full max-w-[640px] h-[400px] md:h-[560px] md:-my-10 [mask-image:linear-gradient(to_bottom,#000_88%,transparent)]"
    >
      {near && (
        <iframe
          src={src}
          title={title}
          className="w-full h-full border-0 bg-transparent"
        />
      )}
    </div>
  );
};

export default ModelFrame;
