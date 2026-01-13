'use client';

const ContactForm = () => {
  return (
    <section id="contact" className="py-24 bg-transparent relative z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Get in Touch
          </h2>
          <p className="text-muted font-normal text-lg">
            Send us a message and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="bg-bg-card rounded-[40px] shadow-m border-none p-10 md:p-14">
          <form className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-text mb-3 ml-2 uppercase tracking-wide">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-6 py-4 rounded-3xl border-none outline-none transition-all bg-bg-panel text-text focus:ring-0 shadow-[inset_0_2px_4px_#00000010] placeholder:text-text-muted"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-text mb-3 ml-2 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-6 py-4 rounded-3xl border-none outline-none transition-all bg-bg-panel text-text focus:ring-0 shadow-[inset_0_2px_4px_#00000010] placeholder:text-text-muted"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-text mb-3 ml-2 uppercase tracking-wide">Message</label>
              <textarea 
                id="message" 
                rows={4}
                className="w-full px-6 py-4 rounded-3xl border-none outline-none transition-all bg-bg-panel text-text focus:ring-0 shadow-[inset_0_2px_4px_#00000010] resize-none placeholder:text-text-muted"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full py-5 bg-text hover:scale-[1.02] active:scale-[0.98] text-bg-body font-bold rounded-full shadow-m transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
