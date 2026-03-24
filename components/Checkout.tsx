
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { CartItem } from '../types';
import { PageId } from '../App';
import { PRODUCTS } from '../constants';

interface CheckoutProps {
  cart: CartItem[];
  onClearCart: () => void;
  onNavigate: (page: PageId) => void;
}

type PaymentMethod = 'bank_transfer' | 'cash';

const PARISHES = [
  'Kingston',
  'St. Andrew',
  'St. Catherine',
  'Clarendon',
  'Manchester',
  'St. Elizabeth',
  'Westmoreland',
  'Hanover',
  'St. James',
  'Trelawny',
  'St. Ann',
  'St. Mary',
  'Portland',
  'St. Thomas'
];

const Checkout: React.FC<CheckoutProps> = ({ cart, onClearCart, onNavigate }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedParish, setSelectedParish] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const baseShipping = 5000; 
  const total = subtotal + baseShipping;

  const isOutsideStAndrew = useMemo(() => {
    if (!selectedParish) return false;
    return selectedParish !== 'Kingston' && selectedParish !== 'St. Andrew';
  }, [selectedParish]);

  // Calculate the minimum delivery date based on cart lead times
  const minDeliveryDate = useMemo(() => {
    let maxWeeks = 1;
    cart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (product && product.leadTimeWeeks > maxWeeks) {
        maxWeeks = product.leadTimeWeeks;
      }
    });
    const date = new Date();
    date.setDate(date.getDate() + (maxWeeks * 7));
    return date;
  }, [cart]);

  // Calendar logic helpers
  const [calendarMonth, setCalendarMonth] = useState(new Date(minDeliveryDate));
  
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding for start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [calendarMonth]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate && step === 'info') {
      alert("Please select a preferred delivery date from our Artisan Calendar.");
      return;
    }
    
    if (step === 'info') {
      setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 'payment') {
      setLoading(true);

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_vbbd9gu';
      const orderAdminTemplateId = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID || 'template_d7ymtpf';
      const orderCustomerTemplateId = import.meta.env.VITE_EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'An_E9NyGbuiNuZNrJ';

      if (!serviceId || !orderAdminTemplateId || !publicKey) {
        console.warn("EmailJS is not fully configured for orders. Simulating success...");
        setTimeout(() => {
          setLoading(false);
          setStep('success');
          onClearCart();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
        return;
      }

      try {
        const formData = new FormData(formRef.current!);
        const orderDetails = cart.map(item => `${item.name} (${item.size}) x${item.quantity} - JMD $${(item.price * item.quantity).toLocaleString()}`).join('\n');
        
        const templateParams = {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          address: `${formData.get('address1')}, ${formData.get('address2') || ''}, ${formData.get('parish')}`,
          deliveryDate: selectedDate?.toLocaleDateString(),
          paymentMethod: paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash',
          orderDetails: orderDetails,
          subtotal: `JMD $${subtotal.toLocaleString()}`,
          shipping: `JMD $${baseShipping.toLocaleString()}`,
          total: `JMD $${total.toLocaleString()}`,
          reply_to: 'jamwoodepoxy@gmail.com'
        };

        // 1. Save to Firestore
        const orderData = {
          userId: auth.currentUser?.uid || 'anonymous',
          customerName: `${formData.get('firstName')} ${formData.get('lastName')}`,
          email: formData.get('email'),
          phone: formData.get('phone'),
          shippingAddress: {
            address1: formData.get('address1'),
            address2: formData.get('address2'),
            parish: formData.get('parish')
          },
          items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            image: item.image
          })),
          subtotal,
          shipping: baseShipping,
          total,
          deliveryDate: selectedDate?.toISOString(),
          paymentMethod,
          status: 'pending',
          createdAt: serverTimestamp(),
          orderId: `ORD-${Date.now()}`
        };

        await addDoc(collection(db, 'orders'), orderData);

        // 2. Send to Admin
        await emailjs.send(
          serviceId,
          orderAdminTemplateId,
          templateParams,
          publicKey
        );

        // 2. Send Confirmation to Customer
        if (orderCustomerTemplateId) {
          await emailjs.send(
            serviceId,
            orderCustomerTemplateId,
            templateParams,
            publicKey
          );
        }

        setLoading(false);
        setStep('success');
        onClearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Order Submission Error:', err);
        alert("There was a problem processing your order. Please contact us directly.");
        setLoading(false);
      }
    }
  };

  const isDateDisabled = (date: Date) => {
    return date < minDeliveryDate || date.getDay() === 0; // Sundays off
  };

  const changeMonth = (offset: number) => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + offset, 1));
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-black uppercase mb-8">Your bag is empty</h2>
        <button 
          type="button"
          onClick={() => onNavigate('gallery')}
          className="px-8 py-4 bg-[#22d3ee] text-black font-bold uppercase tracking-widest rounded-lg hover:bg-[#76c893] transition-colors"
        >
          Browse Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12">
      <AnimatePresence mode="wait">
        {step === 'success' ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#76c893]/20 rounded-full flex items-center justify-center mx-auto mb-10 text-[#76c893]">
              <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Order Placed</h2>
            <p className="text-stone-400 text-base md:text-lg max-w-lg mx-auto mb-12 leading-relaxed">
              Success! Your order has been received. Our artisans will contact you shortly to confirm your <strong>{paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash Payment'}</strong> and finalize the delivery for <strong>{selectedDate?.toLocaleDateString(undefined, { dateStyle: 'long' })}</strong>.
            </p>
            <button 
              type="button"
              onClick={() => onNavigate('home')}
              className="px-12 py-5 bg-[#22d3ee] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#76c893] transition-all"
            >
              Return Home
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Interactive Form */}
            <div className="space-y-10">
              <div className="flex gap-4">
                <div className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${step === 'info' || step === 'payment' ? 'bg-[#22d3ee]' : 'bg-white/10'}`} />
                <div className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${step === 'payment' ? 'bg-[#22d3ee]' : 'bg-white/10'}`} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={step} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6">
                    {step === 'info' ? 'Shipping Details' : 'Payment Choice'}
                  </h2>

                  <form onSubmit={handleOrder} className="space-y-8" ref={formRef}>
                    {step === 'info' ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <input required name="firstName" placeholder="First Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-[#22d3ee] outline-none transition-all placeholder-stone-600" />
                          <input required name="lastName" placeholder="Last Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-[#22d3ee] outline-none transition-all placeholder-stone-600" />
                        </div>
                        <input required name="email" type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-[#22d3ee] outline-none transition-all placeholder-stone-600" />
                        <input name="phone" type="tel" placeholder="Phone Number (Optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-[#22d3ee] outline-none transition-all placeholder-stone-600" />
                        
                        <div className="space-y-6">
                          <input required name="address1" placeholder="Street Line 1" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-[#22d3ee] outline-none transition-all placeholder-stone-600" />
                          <input name="address2" placeholder="Street Line 2 (Optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-[#22d3ee] outline-none transition-all placeholder-stone-600" />
                          
                          <div className="relative">
                            <select 
                              required 
                              name="parish" 
                              value={selectedParish}
                              onChange={(e) => setSelectedParish(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-[#22d3ee] outline-none transition-all appearance-none text-stone-300"
                            >
                              <option value="" disabled className="bg-stone-900">Select Parish</option>
                              {PARISHES.map(parish => (
                                <option key={parish} value={parish} className="bg-stone-900">{parish}</option>
                              ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>

                          {isOutsideStAndrew && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-amber-500/80 uppercase tracking-widest font-bold px-2">
                              Note: Orders outside of Kingston and St. Andrew will require an additional logistical fee.
                            </motion.p>
                          )}
                        </div>
                        
                        {/* Artisan Calendar Section */}
                        <div className="pt-4">
                          <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#22d3ee] mb-4">Preferred Delivery Window</h3>
                          <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="text-sm font-bold uppercase tracking-widest">
                                {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                              </h4>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:text-[#22d3ee] transition-colors text-xl">&larr;</button>
                                <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:text-[#22d3ee] transition-colors text-xl">&rarr;</button>
                              </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className="text-[10px] text-stone-600 font-bold">{day}</div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {calendarDays.map((date, i) => (
                                <div key={i} className="aspect-square flex items-center justify-center">
                                  {date ? (
                                    <button
                                      type="button"
                                      disabled={isDateDisabled(date)}
                                      onClick={() => setSelectedDate(date)}
                                      className={`w-full h-full text-xs rounded-lg transition-all flex items-center justify-center ${
                                        selectedDate?.toDateString() === date.toDateString()
                                          ? 'bg-[#22d3ee] text-black font-bold scale-110 shadow-lg'
                                          : isDateDisabled(date)
                                          ? 'text-stone-800 cursor-not-allowed'
                                          : 'text-stone-300 hover:bg-white/10'
                                      }`}
                                    >
                                      {date.getDate()}
                                    </button>
                                  ) : <div />}
                                </div>
                              ))}
                            </div>

                            {/* Delivery Time Note */}
                            <div className="mt-8 p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                              <div className="flex items-center gap-3 mb-2">
                                <svg className="w-4 h-4 text-[#22d3ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <h4 className="text-[10px] text-[#22d3ee] font-black uppercase tracking-[0.2em]">Standard Delivery Hours</h4>
                              </div>
                              <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold leading-relaxed">
                                Our artisans deliver between <span className="text-white">9:00 AM and 5:00 PM</span>. For orders finalized after 5:00 PM, please expect delivery on the following business day.
                              </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5">
                              <h4 className="text-[10px] text-[#22d3ee] font-black uppercase tracking-[0.2em] mb-4 leading-relaxed">Full production process requires and the time for the items are as follows:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-[9px] text-stone-500 uppercase tracking-widest font-bold">
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Dinner Table</span><span className="text-stone-300">3 Weeks</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Coffee table</span><span className="text-stone-300">3 Weeks</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Benches</span><span className="text-stone-300">3 Weeks</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Cutting Board</span><span className="text-stone-300">1 Week</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Doors</span><span className="text-stone-300">4 Weeks</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Wall Pieces</span><span className="text-stone-300">2 Weeks</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-1"><span>Candles</span><span className="text-stone-300">1 Week</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('bank_transfer')}
                            className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 ${paymentMethod === 'bank_transfer' ? 'bg-[#22d3ee]/10 border-[#22d3ee]' : 'bg-white/5 border-white/10 opacity-50'}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'bank_transfer' ? 'bg-[#22d3ee] text-black' : 'bg-stone-800'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v20m4-20v20m4-20v20M3 21h18M3 10h18M3 7l9-4 9 4v3H3V7z" /></svg>
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest">Bank Transfer</p>
                              <p className="text-[9px] text-stone-500 uppercase mt-1">Direct Bank Deposit</p>
                            </div>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cash')}
                            className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 ${paymentMethod === 'cash' ? 'bg-[#76c893]/10 border-[#76c893]' : 'bg-white/5 border-white/10 opacity-50'}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'cash' ? 'bg-[#76c893] text-black' : 'bg-stone-800'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest">Cash</p>
                              <p className="text-[9px] text-stone-500 uppercase mt-1">Payment on Delivery/Pickup</p>
                            </div>
                          </button>
                        </div>

                        {paymentMethod === 'bank_transfer' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 bg-black/40 border border-[#22d3ee]/30 rounded-3xl"
                          >
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#22d3ee] mb-6">Jamwood Epoxy Bank Details:</h4>
                            <div className="space-y-4 text-xs font-bold uppercase tracking-widest">
                              <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-stone-500">Bank Name</span><span className="text-white">JMMB BANK</span></div>
                              <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-stone-500">Account Name</span><span className="text-white">Jamwood Epoxy</span></div>
                              <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-stone-500">Account Number</span><span className="text-white">006000205028</span></div>
                              <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-stone-500">Account Type</span><span className="text-white">Savings</span></div>
                              <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-stone-500">Branch</span><span className="text-white">Haughton</span></div>
                            </div>
                            <p className="mt-6 text-[9px] text-stone-500 italic leading-relaxed">
                              * Please send a screenshot of the transfer confirmation to jamwoodepoxy@gmail.com once complete. Our artisans will begin production once the transfer is verified.
                            </p>
                          </motion.div>
                        )}

                        {paymentMethod === 'cash' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 bg-black/40 border border-[#76c893]/30 rounded-3xl"
                          >
                            <p className="text-[10px] text-stone-300 uppercase tracking-widest leading-relaxed">
                              You have selected <strong>Cash on Delivery/Pickup</strong>. An artisan will contact you to coordinate the drop-off and verify the collection of funds.
                            </p>
                          </motion.div>
                        )}

                        <button 
                          type="button"
                          onClick={() => setStep('info')}
                          className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors"
                        >
                          &larr; Back to Shipping
                        </button>
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 bg-[#22d3ee] text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#76c893] transition-all flex items-center justify-center shadow-[0_20px_40px_rgba(34,211,238,0.1)] active:scale-[0.98] text-xs md:text-sm"
                    >
                      {loading ? (
                        <svg className="animate-spin h-6 w-6 text-black" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : step === 'info' ? 'Continue to Payment' : `Place Order (JMD $${total.toLocaleString()})`}
                    </button>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Summary Sidebar */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-10 h-fit lg:sticky lg:top-32 shadow-2xl">
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter mb-8 border-b border-white/5 pb-6">Order Summary</h3>
              <div className="space-y-6 mb-10 max-h-[30vh] md:max-h-[40vh] overflow-y-auto no-scrollbar">
                {cart.map(item => (
                  <div key={item.cartId} className="flex justify-between items-center text-sm">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-[0.5]" />
                      </div>
                      <div>
                        <p className="font-bold text-white leading-tight uppercase tracking-tight text-xs md:text-sm">{item.name}</p>
                        <p className="text-[9px] md:text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">{item.size} × {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-black text-stone-300 text-xs md:text-sm">JMD ${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                <div className="flex justify-between text-[10px] md:text-xs uppercase tracking-widest text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">JMD ${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] md:text-xs uppercase tracking-widest text-stone-500">
                  <div className="flex flex-col">
                    <span>Base Shipping</span>
                    <span className="text-[8px] opacity-60">(Kingston & St. Andrew)</span>
                  </div>
                  <span className="font-bold text-white">JMD ${baseShipping.toLocaleString()}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between text-[10px] md:text-xs uppercase tracking-widest text-[#22d3ee]">
                    <span>Delivery Date</span>
                    <span className="font-bold">{selectedDate.toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl md:text-2xl font-black pt-6 border-t border-white/5">
                  <span className="tracking-tighter uppercase">Total</span>
                  <span className="text-[#22d3ee] drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">JMD ${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#76c893]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Location-Based Shipping Note</p>
                </div>
                <p className="text-[8px] leading-relaxed text-stone-500 uppercase tracking-widest">
                  Orders outside of Kingston and St. Andrew will require an additional logistical fee.
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
