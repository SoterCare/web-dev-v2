'use client';

const Newsletter = () => {
  return (
    <section className="py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="mb-6 tracking-tight">
          Stay Connected
        </h2>
        <p className="mb-12 max-w-xl mx-auto">
           Sign up to get the latest updates, care tips, and exclusive offers directly to your inbox.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-bg-card p-3 rounded-[32px] shadow-m border-none">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 px-8 py-4 rounded-3xl bg-bg-panel border-none outline-none text-text placeholder:text-text-muted focus:ring-0 shadow-[inset_0_2px_4px_#00000010]"
            required
          />
          <button 
            type="submit" 
            className="px-10 py-4 bg-text hover:scale-105 text-bg-body rounded-full font-bold shadow-m transition-all"
          >
            Subscribe
          </button>
        </form>
      </div>

       {/* Decorative blurred circles - Monochrome */}
       <div className="absolute top-0 left-0 -ml-24 -mt-24 w-80 h-80 bg-gray-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
       <div className="absolute bottom-0 right-0 -mr-24 -mb-24 w-80 h-80 bg-gray-200 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
    </section>
  );
};

export default Newsletter;
