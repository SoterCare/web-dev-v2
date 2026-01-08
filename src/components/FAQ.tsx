'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How does the monitoring device work?",
    answer: "Our smart band tracks vital signs like heart rate and movement. It connects to the mobile app to send real-time data to our cloud servers, which then update the dashboard for caregivers instantly."
  },
  {
    question: "What happens if there is an emergency?",
    answer: "In case of a fall or abnormal vitals, the system instantly sends alerts to designated contacts and emergency services (if enabled). The GPS location is shared immediately."
  },
  {
    question: "Is the device water-resistant?",
    answer: "Yes, our smart bands are IP67 water-resistant, meaning they can be worn while washing hands or showering, ensuring 24/7 protection."
  },
  {
    question: "Can I monitor multiple elderly people?",
    answer: "Absolutely! The app supports multiple profiles, allowing you to monitor several family members from a single dashboard."
  },
  {
    question: "Is there a contract or cancellation fee?",
    answer: "No, our plans are flexible. You can cancel your subscription at any time without any hidden fees."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-transparent relative z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="bg-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-foreground/60 shadow-clay-inset inline-block mb-4">
            Support
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-[32px] overflow-hidden transition-all duration-300 border border-white/60 ${
                openIndex === index ? 'shadow-clay-floating scale-[1.02]' : 'shadow-clay hover:shadow-clay-floating hover:-translate-y-1'
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-foreground text-lg tracking-tight">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-white flex-shrink-0 ml-4 bg-foreground rounded-full p-1 shadow-lg" size={32} />
                ) : (
                  <ChevronDown className="text-gray-400 flex-shrink-0 ml-4 bg-gray-100 rounded-full p-1 shadow-sm" size={32} />
                )}
              </button>
              
              <div 
                className={`px-8 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-48 opacity-100 pb-8' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-muted leading-relaxed font-normal text-lg">
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
