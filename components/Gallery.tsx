
import React from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../constants';
import { PageId } from '../App';

interface GalleryProps {
  onNavigate: (page: PageId, productId?: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter">
            Our <span className="text-[#76c893]">Collection</span>
          </h2>
          <p className="text-[#22d3ee] text-xs md:text-sm tracking-[0.3em] uppercase mt-4">Real Client Commissions & Studio Work</p>
        </div>
        <div className="hidden lg:block h-px flex-1 mx-12 bg-white/10" aria-hidden="true" />
      </div>

      {/* Natural Variance Disclaimer - Enhanced Visibility & Defined Caution */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mb-20 p-6 md:p-10 lg:p-12 border-4 border-[#22d3ee] bg-[#22d3ee]/10 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 shadow-[0_0_60px_rgba(34,211,238,0.15)] relative overflow-hidden"
      >
        {/* Decorative background pulse */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#22d3ee]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
        
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-[#22d3ee] flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(34,211,238,0.5)]">
          <svg className="w-8 h-8 md:w-12 md:h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h4 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-[0.1em] text-[#22d3ee] mb-3 md:mb-4">
            Artisan Disclaimer
          </h4>
          <p className="text-sm md:text-base lg:text-lg text-white leading-relaxed uppercase tracking-wider font-extrabold max-w-5xl">
            Due to the organic nature of our materials, final products will naturally vary based on unique wood grain formations and the fluid flow of epoxy resin. No two pieces are ever identical, ensuring your commission is a true one-of-a-kind masterpiece.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {PRODUCTS.map((product, idx) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-[#262626] overflow-hidden rounded-xl border border-white/5 shadow-2xl"
          >
            <div 
              onClick={() => onNavigate('product-details', product.id)}
              className="aspect-[4/5] overflow-hidden relative cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`View details for ${product.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onNavigate('product-details', product.id);
                }
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-75 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" aria-hidden="true" />
              
              {/* Floating Price Tag */}
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full">
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#22d3ee] font-bold">Starts at {product.startingPrice}</span>
              </div>

              {/* Hover Overlay Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-12 h-12 rounded-full bg-[#22d3ee]/20 backdrop-blur-sm border border-[#22d3ee]/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#22d3ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 relative">
              <h3 className="text-xl md:text-2xl font-black tracking-tight mb-2 uppercase group-hover:text-[#22d3ee] transition-colors">
                {product.name}
              </h3>
              <p className="text-xs md:text-sm text-stone-500 font-light mb-6 leading-relaxed">
                {product.description}
              </p>
              <button 
                type="button"
                onClick={() => onNavigate('product-details', product.id)}
                aria-label={`View details for ${product.name}`}
                className="w-full py-3 md:py-4 bg-white/5 border border-white/10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black group-hover:bg-[#22d3ee] group-hover:text-black transition-all duration-500 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]"
              >
                Product Details
              </button>
            </div>
          </motion.article>
        ))}

        {/* Custom Order Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-1 bg-gradient-to-br from-[#2a2a2a] to-[#1c1c1c] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-10 md:p-12 text-center group"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#76c893]/10 transition-colors" aria-hidden="true">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-[#76c893]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-bold uppercase tracking-widest mb-4">Custom Commission</h3>
          <p className="text-xs md:text-sm text-stone-500 font-light mb-8">
            Have a specific piece of wood or a unique color in mind? We love creating one-of-a-kind projects.
          </p>
          <button 
            type="button"
            onClick={() => onNavigate('contact')}
            aria-label="Start a custom collaboration"
            className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#22d3ee] border-b border-[#22d3ee] pb-1 hover:text-white hover:border-white transition-all outline-none focus-visible:border-white"
          >
            Start Collaboration
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Gallery;