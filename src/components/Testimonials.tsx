import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Daughter",
    rating: 5,
    text: "This system has been a lifesaver for my family. I can check on my mom anytime, and the alerts give me peace of mind when I'm at work."
  },
  {
    name: "Michael Chen",
    role: "Son",
    rating: 5,
    text: "The fall detection feature is incredible. We were alerted immediately when dad slipped, and the ambulance arrived within minutes."
  },
  {
    name: "Emily Davis",
    role: "Caregiver",
    rating: 4,
    text: "Very user-friendly app. The health reports help us adjust medication and diet effectively. Highly recommended for elderly care."
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-bg-body relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
             <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-x font-bold uppercase tracking-widest text-foreground/60">
               Feedback
             </span>
          </div>
          <h2 className="tracking-tight">
            Trusted by Families
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-bg-card p-10 rounded-[1rem] shadow-m hover:-translate-y-[2px] transition-all duration-300 border-none">
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={`${i < testimonial.rating ? 'text-text fill-text' : 'text-gray-200'} mr-1`} 
                  />
                ))}
              </div>
              <p className="leading-relaxed mb-8">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-bg-panel rounded-full flex items-center justify-center text-text font-bold mr-4 shadow-[inset_0_2px_4px_#00000010] border-b border-white">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-text tracking-tight">{testimonial.name}</h4>
                  <p className="text-xs text-text-muted uppercase tracking-wider font-bold">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
