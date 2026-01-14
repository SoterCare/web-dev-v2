'use client';

import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'mo',
    description: 'For basic monitoring needs',
    features: [
      'Real-time monitoring',
      'Daily health reports',
      'Basic alerts',
      'Mobile app access',
    ],
    buttonVariant: 'outline'
  },
  {
    name: 'Pro',
    price: 10,
    period: 'mo',
    description: 'For basic monitoring needs',
    features: [
      'Real-time monitoring',
      'Daily health reports',
      'Basic alerts',
      'Mobile app access',
    ],
    buttonVariant: 'outline'
  },
  {
    name: 'Enterprice',
    price: 120,
    period: 'mo',
    description: 'Complete care package with dedicated support',
    features: [
      'All Standard features',
      'Dedicated health assistant',
      'Unlimited doctor consultations',
      'Smart home integration',
      'Priority ambulance dispatch'
    ],
    buttonVariant: 'outline'
  }
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-bg-body relative z-10">
      {/* Shorten the background decoration or allow it to blend */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] right-[-5%] w-[800px] h-[800px] bg-white rounded-full blur-[100px] opacity-40 mix-blend-multiply"></div>
      </div>
      {/* Dotted Background */}
      <div className="absolute inset-0 z-0 h-[120%] w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] -top-[10%]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-x font-bold uppercase tracking-widest text-foreground/60">
              Pricing
            </span>
          </div>
          <h2 className="mb-4 tracking-tighter">
            Simple Pricing, No Surprises
          </h2>

          <div className="inline-flex bg-bg-card shadow-m p-2 rounded-full items-center relative">
            <button
              onClick={() => setIsYearly(false)}
              className={`relative z-10 px-8 py-2 rounded-full text-m font-bold transition-all duration-300 ${!isYearly ? 'text-foreground bg-bg-card shadow-m' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative z-10 px-8 py-2 rounded-full text-m font-bold transition-all duration-300 ${isYearly ? 'text-foreground bg-bg-card shadow-m' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Yearly [10% OFF]
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan, index) => {
            const price = isYearly ? Math.floor(plan.price * 12 * 0.9) : plan.price; // 10% off roughly
            const period = isYearly ? '/yr' : '/mo';

            return (
              <div
                key={index}
                className="bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[2rem] p-8"
              >
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-foreground mb-4">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-6xl font-medium text-foreground tracking-tighter">${price}</span>
                    <span className="text-muted ml-2 font-bold text-lg">{period}</span>
                  </div>
                  <p className="text-muted text-base mt-6 font-normal leading-relaxed">{plan.description}</p>
                </div>

                <button className="w-full py-5 bg-bg-card shadow-m rounded-full font-bold mb-10 transition-all duration-300 flex items-center justify-center group">
                  Get Started <ArrowRight size={18} className={`ml-2 transition-transform group-hover:translate-x-1`} />
                </button>

                <div className="border-t border-gray-100 pt-2 flex-1">
                  <ul className="space-y-5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mt-0.5 mr-4 rounded-full bg-gray-100 flex items-center justify-center">
                          <Check size={12} className="text-foreground" strokeWidth={4} />
                        </div>
                        <span className="text-gray-600 text-lg font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
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
