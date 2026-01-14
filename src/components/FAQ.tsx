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
    <section id="faq" className="py-24 bg-bg-body relative z-10 overflow-hidden">
      {/* Dotted Background */}
      <div className="absolute inset-0 z-0 h-[120%] w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] -top-[10%]"></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-x font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
            Support
          </span>
          <h2 className="tracking-tight">
            FAQs
          </h2>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-gradient-to-b from-[#fafafa] to-[#f7f7f7] shadow-m rounded-[32px] overflow-hidden transition-all duration-300 border border-white/60 ${openIndex === index ? 'scale-[1.02]' : 'hover:-translate-y-1'
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
