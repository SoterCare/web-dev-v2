'use client';

import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-2 md:p-4 h-screen min-h-[600px] w-full">
      <section className="relative h-full w-full overflow-hidden flex flex-col justify-between pt-24 md:pt-32 pb-6 md:pb-8 px-4 sm:px-6 lg:px-8 rounded-[1.5rem] md:rounded-[1.5rem]">
      
      {/* Background Image & Noise */}
      <div className="absolute inset-0 w-full h-full z-0 font-sans">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url("/img/hero-background-test1.png")' }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto z-10 text-white">
          <h1 className="mb-4 md:mb-2 leading-[1.1] md:leading-[1]">
             <span className="block text-4xl sm:text-6xl md:text-[12vh] font-medium opacity-90 text-white leading-none">Smart Elderly Care</span>
             <span className="block text-2xl sm:text-4xl md:text-[8vh] font-medium opacity-90 text-white leading-none mt-2 md:-mt-1">Monitoring System</span>
          </h1>
          <span className="max-w-xs sm:max-w-xl mx-auto leading-relaxed text-sm sm:text-lg tracking-wide opacity-70 text-white px-2">
            Advanced real-time health monitoring ensuring safety and peace of mind for your loved ones.
          </span>
      </div>

      {/* Bottom Bar */}
      <div className="w-full flex justify-between items-end text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 z-10">
         <div className="w-20 sm:w-32 hidden sm:block">
            #SDGP
         </div>
         
         <div className="flex flex-col items-center gap-2 mx-auto sm:mx-0">
            <span className="bg-[linear-gradient(110deg,#e2e8f0,45%,#ffffff,55%,#e2e8f0)] bg-[length:250%_100%] bg-clip-text text-transparent animate-shine font-bold text-xs sm:text-sm whitespace-nowrap">
              Scroll to Explore
            </span>
            <ArrowDown size={14} className="text-white/50" />
         </div>

         <div className="w-20 sm:w-32 text-right hidden sm:block">
            IIT-CS-42
         </div>
      </div>
      </section>
    </div>
  );
};

export default Hero;
