import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center mb-10">
             <span className="text-xs font-bold text-foreground/60 bg-white px-6 py-2 rounded-full uppercase tracking-widest shadow-clay-inset">
               Health & Safety Monitoring
             </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-8 leading-[1.1]">
            Smart Elderly Care <br/>
            <span className="text-foreground">Monitoring System</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
            Advanced real-time health monitoring ensuring safety and peace of mind for your loved ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="w-full sm:w-auto px-10 py-5 bg-foreground text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20 flex items-center justify-center gap-2 group tracking-wide">
              Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-foreground hover:bg-gray-50 rounded-full font-bold transition-all shadow-clay hover:shadow-clay-floating flex items-center justify-center gap-2">
              <Play size={18} className="fill-current" /> Watch Demo
            </button>
          </div>
        </div>
      </div>
      
      {/* Background Decorative Elements - Subtle ripples */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-white rounded-full blur-3xl opacity-40 mix-blend-overlay"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-white rounded-full blur-3xl opacity-40 mix-blend-overlay"></div>
      </div>
    </section>
  );
};

export default Hero;
