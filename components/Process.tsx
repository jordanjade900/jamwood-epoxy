
import React from 'react';
import { motion } from 'framer-motion';
import { PROCESS_STEPS } from '../constants';

const Process: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black mb-4"
        >
          From Tree to Treasure
        </motion.h2>
        <p className="text-stone-400 tracking-widest uppercase">Our careful process ensures each piece is perfect</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {PROCESS_STEPS.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="text-center group"
          >
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-full bg-[#1e293b] flex items-center justify-center text-4xl font-black text-[#22d3ee] border border-white/10 group-hover:bg-[#22d3ee] group-hover:text-black transition-colors duration-500">
                {step.number}
              </div>
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#22d3ee]/20 blur-xl scale-0 group-hover:scale-150 transition-transform duration-700" />
            </div>
            <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">{step.title}</h3>
            <p className="text-stone-400 font-light leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Process;
