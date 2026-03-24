
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageId } from '../App';

interface FAQProps {
  onNavigate: (page: PageId) => void;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group outline-none"
      >
        <span className={`text-sm md:text-base font-bold uppercase tracking-widest transition-colors ${isOpen ? 'text-[#22d3ee]' : 'text-stone-300 group-hover:text-white'}`}>
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          className={`text-2xl font-light transition-colors ${isOpen ? 'text-[#22d3ee]' : 'text-stone-600'}`}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-stone-400 text-sm md:text-base leading-relaxed font-light max-w-3xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC<FAQProps> = ({ onNavigate }) => {
  const faqs = [
    {
      question: "Do you ship island-wide in Jamaica?",
      answer: "We offer flat-rate handcrafted delivery within Kingston and St. Andrew for JMD $5,000. For orders outside these parishes or for large bespoke installations like dining tables or doors, an additional logistical fee will apply. We will provide a specific quote based on your exact location and installation complexity."
    },
    {
      question: "How do I maintain the epoxy and wood finish?",
      answer: "Maintenance is simple. Use a soft microfiber cloth with mild soap and water for regular cleaning. Avoid harsh chemicals or abrasive sponges. Our pieces are finished with high-quality oils and UV-stable resins to prevent yellowing and ensure long-term durability."
    },
    {
      question: "Can I provide my own wood for a custom piece?",
      answer: "Absolutely. We love working with family heirlooms or trees that have fallen on your property. We'll need to assess the moisture content and structural integrity before we can begin the stabilizing and resin process."
    },
    {
      question: "What is the typical lead time for a custom table?",
      answer: "A standard custom river table takes between 4 to 6 weeks. This includes the stabilization period, multiple precision resin pours, and our intensive 12-stage diamond polishing process."
    },
    {
      question: "Is the resin food safe and heat resistant?",
      answer: "Our finishing resins are 100% food safe once fully cured, making them perfect for dining tables and cutting boards. While the resin is heat resistant up to 135°F (57°C), we always recommend using coasters or placemats for items straight from the oven to preserve the mirror-like finish."
    }
  ];

  return (
    <section className="py-32 bg-[#1c1c1c] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Common <span className="text-[#22d3ee]">Inquiries</span>
          </h2>
          <div className="h-1 w-12 bg-[#76c893] mx-auto mb-6" />
          <p className="text-stone-500 text-xs uppercase tracking-[0.3em]">Everything you need to know about our craft</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-white/5"
        >
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center"
        >
          <p className="text-stone-400 text-sm mb-4">Have a more specific question about a dream project?</p>
          <button 
            onClick={() => onNavigate('contact')}
            className="text-[#22d3ee] font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
          >
            Contact our Studio &rarr;
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
