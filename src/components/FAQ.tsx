'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How is SoterCare different from a standard SOS panic button?",
    answer: "Unlike panic buttons that require you to press them after an accident, SoterCare is proactive. It uses AI to detect \"risky movements\" (like unassisted standing) and alerts caregivers before a fall happens. It also works automatically if the user is unconscious."
  },
  {
    question: "Will the system work if my home Wi-Fi goes down?",
    answer: "Yes. SoterCare has an Offline Safety Mode. The central hub processes alerts locally, triggering instant buzzers and lights for falls even without internet. Data syncs to the cloud automatically once Wi-Fi is restored."
  },
  {
    question: "How does the \"Recycle Bin\" feature help with false alarms?",
    answer: "It helps reduce annoying alerts. If you get a false alarm, you can mark it as \"False\" in the app. This moves it to the Recycle Bin and uses that data to retrain our system, making it smarter and more accurate for you over time."
  },
  {
    question: "Is the urinary incontinence alert discreet?",
    answer: "Yes. To protect dignity, there are no loud \"bathroom\" alarms. The system detects moisture and sends a private, silent notification to the caregiver’s phone. A small blue light on the hub provides a discreet visual cue."
  },
  {
    question: "What happens if one of the wearable bands runs out of battery?",
    answer: "The thigh and wrist bands work independently. If one battery dies, the other keeps monitoring. For example, if the thigh band stops, the wristband continues to track heart rate and oxygen levels seamlessly."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="py-24 bg-bg-body relative z-10 overflow-hidden">
      {/* Dotted Background */}
      <div className="absolute inset-0 z-0 h-[120%] w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] -top-[10%]"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-sm border-none text-xs font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
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
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-foreground text-xl tracking-tight">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-gray-400 flex-shrink-0 ml-4 bg-gray-100 rounded-full p-1 shadow-sm" size={32} />
                ) : (
                  <ChevronDown className="text-gray-400 flex-shrink-0 ml-4 bg-gray-100 rounded-full p-1 shadow-sm" size={32} />
                )}
              </button>

              <div
                className={`px-8 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-48 opacity-100 pb-8' : 'max-h-0 opacity-0'
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
