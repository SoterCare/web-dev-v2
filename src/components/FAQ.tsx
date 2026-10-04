'use client';

import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqs } from '@/lib/faqs';

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(contentRef.current,
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
          onEnter: () => localStorage.setItem('faq-animated', 'true')
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="faqs" ref={sectionRef} className="pt-12 md:pt-16 pb-12 md:pb-16 bg-transparent relative z-10 overflow-hidden">
      {/* Dotted Background removed (global) */}

      <div ref={contentRef} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-base font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
            Support
          </span>
          <h2 className="tracking-tight">
            FAQs
          </h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[32px] overflow-hidden transition-all duration-300 border border-white/60 ${openIndex === index ? 'scale-[1.02]' : 'hover:-translate-y-1'
                }`}
            >
              <button
                className="w-full flex items-center justify-between p-4 md:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a0cbdb] focus-visible:ring-offset-2 rounded-[32px]"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="font-bold text-foreground text-xl tracking-tight">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-gray-400 flex-shrink-0 ml-4 bg-gray-100 rounded-full p-1 shadow-sm" size={32} />
                ) : (
                  <ChevronDown className="text-gray-400 flex-shrink-0 ml-4 bg-gray-100 rounded-full p-1 shadow-sm" size={32} />
                )}
              </button>

              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`px-8 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-80 opacity-100 pb-8' : 'max-h-0 opacity-0'
                  }`}
              >
                <p className="leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
