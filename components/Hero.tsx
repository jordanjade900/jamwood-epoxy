
import React from 'react';
import { motion } from 'framer-motion';
import { PageId } from '../App';

interface HeroProps {
  onNavigate: (page: PageId) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#1c1c1c] flex flex-col items-center justify-center text-white select-none py-20 lg:py-0">
      
      {/* Background Geometric Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Smokey Gray Slabs */}
        <div 
          className="absolute -top-[10%] -left-[5%] w-[70%] h-[120%] bg-[#222222] transform -rotate-6 border-r border-white/5 shadow-2xl"
          style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
          aria-hidden="true"
        />
        <div 
          className="absolute top-[10%] right-[-10%] w-[50%] h-[90%] bg-[#1e1e1e] transform rotate-3 border-l border-white/5 shadow-2xl"
          style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}
          aria-hidden="true"
        />
        
        {/* Subtle Warm Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-900/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-900/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      </div>

      {/* Noise Overlays */}
      <div className="absolute inset-0 z-10 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" aria-hidden="true" />

      {/* Main Branding Container */}
      <div className="relative z-20 container mx-auto px-4 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="flex flex-col lg:flex-row items-center justify-center gap-2 md:gap-4 lg:gap-10 w-full">
            <h1 className="text-[14vw] md:text-[10vw] lg:text-[11rem] font-black tracking-tight lg:tracking-tighter leading-[0.9] lg:leading-[0.85] grain-text uppercase">
              JAMWOOD
            </h1>
            <div className="relative flex items-center justify-center">
              <motion.span 
                role="text"
                animate={{ textShadow: ["0 0 10px rgba(34,211,238,0.3)", "0 0 25px rgba(34,211,238,0.6)", "0 0 10px rgba(34,211,238,0.3)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="block text-[14vw] md:text-[10vw] lg:text-[11rem] font-black tracking-tight lg:tracking-tighter leading-[0.9] lg:leading-[0.85] epoxy-cyan uppercase italic"
              >
                EPOXY
              </motion.span>
              <div className="absolute -bottom-6 left-0 w-full h-12 bg-gradient-to-b from-cyan-400/20 to-transparent blur-xl pointer-events-none" aria-hidden="true" />
            </div>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-8 md:mt-12 lg:mt-12 text-[0.6rem] md:text-xs lg:text-sm tracking-[0.4em] md:tracking-[0.6em] text-stone-400 font-light uppercase px-4 max-w-2xl"
          >
            Artisanal Furniture • Sustainable Craft • Deep Grain Elegance
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-10 md:mt-14 lg:mt-16 flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-xs sm:max-w-none justify-center px-4"
          >
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="group relative px-10 lg:px-12 py-4 lg:py-5 bg-transparent border border-[#22d3ee]/50 text-[#22d3ee] text-[0.75rem] md:text-sm lg:text-base font-bold uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:border-[#22d3ee] hover:text-black outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            >
              <span className="relative z-10">Discover Collection</span>
              <div className="absolute inset-0 bg-[#22d3ee] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" aria-hidden="true" />
            </button>
            
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-10 lg:px-12 py-4 lg:py-5 bg-white/5 border border-white/10 text-white text-[0.75rem] md:text-sm lg:text-base font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            >
              Get a Quote
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator - clicks to go to about page */}
      <motion.button
        type="button"
        aria-label="Scroll to About Section"
        animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer hidden md:block p-4 outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee] rounded-full"
        onClick={() => onNavigate('about')}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-stone-500 to-transparent mx-auto" aria-hidden="true" />
      </motion.button>
    </section>
  );
};

export default Hero;
