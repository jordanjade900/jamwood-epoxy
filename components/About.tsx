
import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative aspect-square md:aspect-[4/5] bg-stone-900 overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop"
          alt="Artisan working"
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <h2 className="text-4xl md:text-6xl font-black text-[#76c893] uppercase tracking-tighter">
          From Roots To Rebirth
        </h2>
        <div className="h-1 w-20 bg-[#22d3ee]" />
        
        <div className="space-y-6 text-lg text-stone-400 leading-relaxed font-light">
          <p>
            Here at Jamwood Epoxy we bring new life to fallen and discarded trees. We specialize in crafting stunning, one-of-a-kind pieces that not only showcase the natural beauty of the wood but also highlight the unique character of each tree's story.
          </p>
          <p>
            From sleek, modern furniture to intricate decorative accents, our creations are perfect for those who value sustainability, creativity and individuality.
          </p>
          <p>
            By repurposing unwanted and casted aside trees, we're helping to reduce waste and promote a more circular approach to woodworking. Come visit us and discover the potential in what's been left behind.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-8">
          <div>
            <h4 className="text-[#22d3ee] font-black text-3xl">100%</h4>
            <p className="text-xs uppercase tracking-widest text-stone-500 mt-2">Sustainable Sourcing</p>
          </div>
          <div>
            <h4 className="text-[#22d3ee] font-black text-3xl">Unique</h4>
            <p className="text-xs uppercase tracking-widest text-stone-500 mt-2">Handcrafted Identity</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
