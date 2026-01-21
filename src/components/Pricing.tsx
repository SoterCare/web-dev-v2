'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'mo',
    description: 'Essential monitoring for peace of mind.',
    features: [
      'Real-time monitoring',
      'Mobile app access',
      'Basic fall alerts',
      'Standard support'
    ],
    buttonVariant: 'outline'
  },
  {
    name: 'Pro',
    price: 3.29,
    period: 'mo',
    description: 'Advanced insights for proactive care.',
    features: [
      'Everything in Free',
      'AI Health Summaries',
      'Risk Prediction Models',
      '30-Day History',
      'Priority Alerts'
    ],
    buttonVariant: 'default'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Under development. Available for commercial level elderly nursing homes.',
    features: [
      'Everything in Pro',
      'Dedicated Support',
      'Unlimited History',
      'API Access',
      'Multi-user Management'
    ],
    buttonVariant: 'outline'
  }
];

const Pricing = () => {
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
          onEnter: () => localStorage.setItem('pricing-animated', 'true')
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="pricing" ref={sectionRef} className="pt-24 md:pt-32 pb-24 bg-transparent relative z-10 overflow-hidden">
      {/* Shorten the background decoration or allow it to blend */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] right-[-5%] w-[800px] h-[800px] bg-white rounded-full blur-[100px] opacity-40 mix-blend-multiply"></div>
      </div>
      {/* Dotted Background removed (global) */}

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-base font-bold uppercase tracking-widest text-foreground/60">
              Pricing
            </span>
          </div>
          <h2 className="mb-4 tracking-tighter text-4xl md:text-5xl font-bold">
            Simple Pricing, No Surprises
          </h2>
        </div>

        {/* --- Pre-Order Section --- */}
        <div className="w-full max-w-4xl mx-auto mb-20">
          <div className="bg-bg-card rounded-[2.5rem] shadow-xl border border-black/5 overflow-hidden flex flex-col md:flex-row relative">
            <div className="absolute top-0 right-0 p-4 z-10">
              <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Early Bird</span>
            </div>

            <div className="p-6 md:p-12 md:w-2/3 flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-4">Get the SoterCare Kit</h3>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                The essential hardware to keep your loved ones safe. Includes the Thigh Node, Wrist Node, and the Edge Gateway for seamless, offline-ready monitoring.
              </p>
              <div className="flex items-center gap-6">
                <span className="text-4xl font-bold">$329</span>
                <span className="text-text-muted text-sm uppercase font-semibold tracking-wider">One-time payment</span>
              </div>
            </div>

            <div className="bg-black/5 p-10 md:p-12 md:w-1/3 flex flex-col justify-center items-center gap-6 border-l border-white/50">
              <button className="w-full py-4 bg-bg-card text-foreground rounded-full font-bold hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2">
                Pre-Order Now <ArrowRight size={20} />
              </button>
              <p className="text-xs text-center text-text-muted">We are still under development, so the pre-order is not available yet.</p>
            </div>
          </div>
        </div>


        {/* --- Feature Comparison Plans --- */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-10">Choose your subscription plan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isCustom = typeof plan.price === 'string';
            const priceDisplay = plan.price;
            const period = isCustom ? '' : '/mo';

            return (
              <div
                key={index}
                className="bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[2rem] p-8 border border-white/50 relative"
              >
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-foreground tracking-tight">{typeof priceDisplay === 'number' ? `$${priceDisplay}` : priceDisplay}</span>
                    <span className="text-muted ml-1 font-medium text-sm">{period}</span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed min-h-[40px]">{plan.description}</p>
                </div>

                <div className="border-t border-black/5 pt-8 flex-1">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mt-0.5 mr-3 flex-shrink-0">
                          <Check size={16} className="text-foreground" strokeWidth={3} />
                        </div>
                        <span className="text-gray-600 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {index === 2 && (
                    <a
                      href="mailto:support@sotercare.com"
                      className="w-full py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center group text-sm bg-bg-card shadow-m text-foreground hover:bg-white"
                    >
                      Contact Sales <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
