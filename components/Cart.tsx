
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../types';
import { PageId } from '../App';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (cartId: string) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onNavigate: (page: PageId) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onNavigate }) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-[#0d0d0d] border-l border-white/5 z-[80] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Your Bag</h2>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">
                  {items.length} {items.length === 1 ? 'Unique Item' : 'Unique Items'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 text-stone-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-widest text-stone-400">Your bag is empty</h3>
                  <button 
                    onClick={() => { onNavigate('gallery'); onClose(); }}
                    className="mt-6 text-[#22d3ee] text-[10px] font-black uppercase tracking-[0.3em] border-b border-[#22d3ee] pb-1"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartId} className="flex gap-6 group">
                    <div className="w-24 h-24 bg-stone-900 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm uppercase tracking-tight">{item.name}</h4>
                          <button onClick={() => onRemove(item.cartId)} className="text-stone-600 hover:text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">{item.size}</p>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3 bg-white/5 rounded-md px-2 py-1">
                          <button onClick={() => onUpdateQuantity(item.cartId, -1)} className="text-stone-500 hover:text-[#22d3ee]">-</button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.cartId, 1)} className="text-stone-500 hover:text-[#22d3ee]">+</button>
                        </div>
                        <p className="text-sm font-black text-[#22d3ee]">JMD ${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-[#0a0a0a]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs uppercase tracking-widest text-stone-500">Estimated Total</span>
                  <span className="text-2xl font-black text-white">JMD ${total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => { onNavigate('checkout'); onClose(); }}
                  className="w-full py-5 bg-[#22d3ee] text-black font-black uppercase tracking-[0.3em] rounded-xl hover:bg-[#76c893] transition-all"
                >
                  Proceed to Checkout
                </button>
                <p className="text-center text-[9px] text-stone-600 uppercase tracking-widest mt-4">
                  Standard shipping calculated at next step
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
