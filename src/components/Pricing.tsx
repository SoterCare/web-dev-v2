'use client';

import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: 50,
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
    name: 'Basic',
    price: 50,
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
    name: 'Premium',
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
    <section id="pricing" className="py-24 bg-transparent relative z-10 font-urw">
       {/* Background decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[20%] right-[-5%] w-[800px] h-[800px] bg-white rounded-full blur-[100px] opacity-40 mix-blend-multiply"></div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-block mb-6">
             <span className="bg-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-foreground/60 shadow-clay-inset">
               Pricing
             </span>
          </div>
          <h2 className="text-8xl md:text-6xl font-normal text-foreground mb-10 tracking-tighter">
            Simple Pricing, <br/> No Surprises
          </h2>
          
          <div className="inline-flex bg-[#F5F5F7] p-2 rounded-full shadow-clay-inset items-center relative">
            <button 
              onClick={() => setIsYearly(false)}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${!isYearly ? 'bg-white text-foreground shadow-clay' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${isYearly ? 'bg-white text-foreground shadow-clay' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan, index) => {
             const price = isYearly ? Math.floor(plan.price * 12 * 0.7) : plan.price; // 30% off roughly
             const period = isYearly ? '/yr' : '/mo';

             return (
              <div 
                key={index} 
              >
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-foreground mb-4">{plan.name}</h3>
                  <div className="flex items-baseline">
                     <span className="text-6xl font-black text-foreground tracking-tighter">${price}</span>
                     <span className="text-muted ml-2 font-bold text-lg">{period}</span>
                  </div>
                  <p className="text-muted text-base mt-6 font-normal leading-relaxed">{plan.description}</p>
                </div>
                
                <button className={`w-full py-5 rounded-full font-bold mb-10 transition-all duration-300 flex items-center justify-center group ${
                  plan.buttonVariant === 'primary' 
                    ? 'bg-foreground text-white hover:scale-105 shadow-lg shadow-black/30' 
                    : 'bg-white border border-gray-100 text-foreground hover:bg-gray-50 shadow-clay hover:shadow-clay-floating'
                }`}>
                  Get Started <ArrowRight size={18} className={`ml-2 transition-transform group-hover:translate-x-1 ${plan.buttonVariant === 'primary' ? 'opacity-100' : 'opacity-70'}`} />
                </button>

                <div className="border-t border-gray-100 pt-10 flex-1">
                   <ul className="space-y-5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mt-0.5 mr-4 flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <Check size={12} className="text-foreground" strokeWidth={4} />
                        </div>
                        <span className="text-gray-600 text-sm font-medium">{feature}</span>
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
