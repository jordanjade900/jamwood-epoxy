
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '../constants';
import { PageId } from '../App';
import { CartItem } from '../types';

interface ProductDetailsProps {
  productId: string | null;
  onNavigate: (page: PageId) => void;
  onAddToCart: (item: CartItem) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onNavigate, onAddToCart }) => {
  const product = PRODUCTS.find(p => p.id === productId);
  
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-black uppercase mb-8">Product Not Found</h2>
        <button 
          onClick={() => onNavigate('gallery')}
          className="px-8 py-3 bg-[#22d3ee] text-black font-bold uppercase tracking-widest rounded-lg"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  const allImages = [product.image, ...(product.additionalImages || [])];
  const selectedSize = product.options ? product.options[selectedSizeIdx] : { label: 'Standard', priceModifier: 0 };
  const isInquiry = selectedSize.label.toLowerCase().includes('inquiry') || selectedSize.label.toLowerCase().includes('custom');
  const currentPrice = product.basePriceNum + selectedSize.priceModifier;

  const handleAddToCart = () => {
    if (isInquiry) {
      onNavigate('contact');
      return;
    }
    onAddToCart({
      cartId: `${product.id}-${selectedSize.label}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      size: selectedSize.label,
      price: currentPrice,
      quantity: quantity
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => onNavigate('gallery')}
        className="group flex items-center gap-3 text-stone-500 hover:text-[#22d3ee] transition-colors mb-12 outline-none"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span className="text-xs font-black uppercase tracking-[0.3em]">Back to Collection</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24">
        {/* Left: Immersive Media */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <div className="aspect-square md:aspect-[16/10] lg:aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 bg-[#121212] shadow-2xl relative">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === img ? 'border-[#22d3ee] scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Content & Specs */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <span className="text-[#22d3ee] text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Signature Series</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-stone-400 text-sm md:text-base lg:text-lg leading-relaxed font-light mb-8">
              {product.description}
            </p>
          </div>

          {/* Configuration */}
          <div className="space-y-10 border-t border-white/5 pt-10">
            {/* Size Selection */}
            {product.options && (
              <div>
                <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-4 font-black">Choose Dimension</h4>
                <div className="flex flex-wrap gap-3">
                  {product.options.map((opt, idx) => (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedSizeIdx(idx)}
                      className={`px-4 md:px-6 py-3 rounded-xl text-[9px] md:text-[10px] uppercase font-black tracking-widest transition-all border ${
                        selectedSizeIdx === idx 
                          ? 'bg-[#22d3ee] text-black border-[#22d3ee]' 
                          : 'bg-white/5 text-stone-400 border-white/10 hover:border-[#22d3ee]/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Price Display */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              {!isInquiry ? (
                <>
                  <div>
                    <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-4 font-black">Quantity</h4>
                    <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-xl p-2 w-fit">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-[#22d3ee] text-xl"
                      >
                        -
                      </button>
                      <span className="text-base md:text-lg font-black w-8 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-[#22d3ee] text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <h4 className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2 font-black">Subtotal</h4>
                    <p className="text-3xl md:text-4xl font-black text-[#22d3ee]">
                      JMD ${(currentPrice * quantity).toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <div className="p-4 md:p-6 bg-[#22d3ee]/5 border border-[#22d3ee]/20 rounded-xl">
                    <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#22d3ee] font-black">Custom Project Notice</p>
                    <p className="text-stone-400 text-xs md:text-sm mt-2 leading-relaxed">
                      Bespoke kitchen layouts require professional onsite measurements and material consultation. Select 'Request Quote' to start your commission.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="pt-4 space-y-4">
              <button 
                onClick={handleAddToCart}
                className={`w-full py-5 font-black uppercase tracking-[0.3em] rounded-xl transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.2)] text-xs md:text-sm ${
                  isInquiry 
                    ? 'bg-white text-black hover:bg-[#22d3ee]' 
                    : 'bg-[#22d3ee] text-black hover:bg-[#76c893]'
                }`}
              >
                {isInquiry ? 'Request Custom Quote' : 'Add to Cart'}
              </button>
              
              {!isInquiry && (
                <button 
                  onClick={() => onNavigate('contact')}
                  className="w-full py-5 bg-transparent border border-white/10 text-white font-black uppercase tracking-[0.3em] rounded-xl hover:bg-white/5 transition-all text-xs md:text-sm"
                >
                  Inquire for Custom Version
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
