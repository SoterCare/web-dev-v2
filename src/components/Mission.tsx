'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const technologies = [
  { name: 'Next.js', src: '/assets/tech-logos/nextjs.png' },
  { name: 'React Native', src: '/assets/tech-logos/reactnative.png' },
  { name: 'NestJS', src: '/assets/tech-logos/nestjs.png' },
  { name: 'Flask', src: '/assets/tech-logos/flask.png' },
  { name: 'PostgreSQL', src: '/assets/tech-logos/postgresql.png' },
  { name: 'TensorFlow', src: '/assets/tech-logos/edgeimpulse.png' },
  { name: 'Raspberry Pi', src: '/assets/tech-logos/raspberry-pi.png' },
  { name: 'ESP', src: '/assets/tech-logos/ESP.png' },
];

const Mission = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const part1Ref = useRef<HTMLDivElement>(null);
  const part2Ref = useRef<HTMLDivElement>(null);

  const textRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const missionText = '"' + "We believe caring for those who raised us should be an act of love, not a source of stress. Our technology acts as a gentle guardian, watching over your parents’ well-being so you can step back from the role of 'caregiver' and simply enjoy being their child again." + '"';
  const words = missionText.split(" ");

  useGSAP(() => {
    // Marquee Animation
    gsap.to([part1Ref.current, part2Ref.current], {
      xPercent: -100,
      repeat: -1,
      duration: 30,
      ease: "none",
    });

    // Text Reveal Animation
    if (textRef.current && sectionRef.current) {

      const textElements = textRef.current.querySelectorAll('.word');

      // Trigger 1: Fade Animation (Starts earlier)
      gsap.fromTo(textElements,
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "+=300%",
            scrub: 1,
          }
        }
      );

      // Trigger 2: Pinning (Starts at top)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
      });
    }
  }, { scope: containerRef });

  return (
    <section ref={sectionRef} className="pt-32 pb-0 bg-bg-body overflow-hidden relative z-10 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 mb-0 text-center max-w-5xl relative z-10" ref={textRef}>
        <div className="text-4xl md:text-6xl font-medium mb-8 text-text opacity-100">
          {words.map((word, i) => (
            <span key={i} className="word inline-block mr-[0.25em] opacity-10">
              {word}
            </span>
          ))}
        </div>
      </div>


      {/* Static Dotted Background (Independent) */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>

      {/* Tech Stack Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-transparent border border-white/10 flex items-center overflow-hidden rounded-[1.5rem]">
          {/* Label */}
          <div className="flex-shrink-0 px-6 sm:px-10 py-8 z-10 bg-bg-transparent relative border-r border-white/5">
            <span className="font-bold md:text-2xl text-text uppercase tracking-widest whitespace-nowrap">
              Tech Stack
            </span>
          </div>

          {/* Slider with Fade Mask */}
          <div
            className="flex-1 flex overflow-hidden py-8 max-w-full relative"
            ref={containerRef}
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
            }}
          >
            <div className="flex flex-shrink-0 items-center min-w-full" ref={part1Ref}>
              {technologies.map((tech, index) => (
                <div key={index} className="mx-8 md:mx-12 relative h-16 w-16 md:h-20 md:w-20 aspect-square flex items-center justify-center opacity-100 grayscale-0 transition-all duration-300">
                  <Image
                    src={tech.src}
                    alt={tech.name}
                    fill
                    sizes="(max-width: 768px) 64px, 80px"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-shrink-0 items-center min-w-full" ref={part2Ref}>
              {technologies.map((tech, index) => (
                <div key={`clone-${index}`} className="mx-8 md:mx-12 relative h-16 w-16 md:h-20 md:w-20 aspect-square flex items-center justify-center opacity-100 grayscale-0 transition-all duration-300">
                  <Image
                    src={tech.src}
                    alt={tech.name}
                    fill
                    sizes="(max-width: 768px) 64px, 80px"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
