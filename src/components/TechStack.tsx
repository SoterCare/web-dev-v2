"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const technologies = [
  { name: "Next.js", src: "/assets/tech-logos/nextjs.webp" },
  { name: "React Native", src: "/assets/tech-logos/reactnative.webp" },
  { name: "NestJS", src: "/assets/tech-logos/nestjs.webp" },
  { name: "Flask", src: "/assets/tech-logos/flask.webp" },
  { name: "PostgreSQL", src: "/assets/tech-logos/postgresql.webp" },
  { name: "TensorFlow", src: "/assets/tech-logos/edgeimpulse.webp" },
  { name: "Raspberry Pi", src: "/assets/tech-logos/raspberry-pi.webp" },
  { name: "ESP", src: "/assets/tech-logos/ESP.webp" },
];

const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const part1Ref = useRef<HTMLDivElement>(null);
  const part2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to([part1Ref.current, part2Ref.current], {
        xPercent: -100,
        repeat: -1,
        duration: 30,
        ease: "none",
      });
    },
    { scope: containerRef },
  );

  const row = (keyPrefix: string) =>
    technologies.map((tech, index) => (
      <div
        key={`${keyPrefix}-${index}`}
        className="mx-4 md:mx-12 relative h-10 w-10 sm:h-16 sm:w-16 md:h-20 md:w-20 aspect-square flex items-center justify-center"
      >
        <Image
          src={tech.src}
          alt={keyPrefix === "a" ? tech.name : ""}
          fill
          sizes="(max-width: 768px) 64px, 80px"
          className="object-contain"
        />
      </div>
    ));

  return (
    <div className="relative z-10 w-full -mt-2 md:-mt-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full">
        <div className="w-full flex items-center overflow-hidden rounded-[1rem] md:rounded-[1.5rem]">
          <div className="flex-shrink-0 px-4 sm:px-10 py-4 sm:py-8 z-10 relative">
            <span className="font-bold text-sm md:text-2xl text-text whitespace-nowrap">
              Tech Stack
            </span>
          </div>
          <div
            className="flex-1 flex overflow-hidden py-4 sm:py-8 max-w-full relative"
            ref={containerRef}
            style={{
              maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            }}
          >
            <div className="flex flex-shrink-0 items-center min-w-full" ref={part1Ref}>
              {row("a")}
            </div>
            <div className="flex flex-shrink-0 items-center min-w-full" ref={part2Ref} aria-hidden="true">
              {row("b")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;
