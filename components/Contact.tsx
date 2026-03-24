
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_vbbd9gu';
    const adminTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_m3dktcg';
    const customerTemplateId = import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'An_E9NyGbuiNuZNrJ';

    if (!serviceId || !adminTemplateId || !publicKey) {
      console.warn("EmailJS is not fully configured. Simulating success UI...");
      setIsSending(true);
      await new Promise(r => setTimeout(r, 1500));
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // 0. Save to Firestore
      const formData = new FormData(formRef.current!);
      await addDoc(collection(db, 'contactMessages'), {
        name: formData.get('name'),
        email: formData.get('email'),
        project_type: formData.get('project_type'),
        message: formData.get('message'),
        createdAt: serverTimestamp()
      });

      // 1. Send to Admin
      await emailjs.sendForm(
        serviceId,
        adminTemplateId,
        formRef.current!,
        publicKey
      );

      // 2. Send Confirmation to Customer (if template ID is provided)
      if (customerTemplateId) {
        const formData = new FormData(formRef.current!);
        const templateParams = {
          name: formData.get('name'),
          email: formData.get('email'),
          project_type: formData.get('project_type'),
          message: formData.get('message'),
          reply_to: 'jamwoodepoxy@gmail.com'
        };

        await emailjs.send(
          serviceId,
          customerTemplateId,
          templateParams,
          publicKey
        );
      }

      setIsSubmitted(true);
      formRef.current?.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission Error:', err);
      setError("There was a problem sending your request. Please WhatsApp us at 876-873-7778 for immediate help.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
            Start Your <span className="text-[#22d3ee]">Project</span>
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed font-light mb-12">
            Every piece we make is a collaboration between nature and your vision. Tell us about the space you want to transform, and let's create something extraordinary together.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-lg border border-white/5 group-hover:border-[#76c893]/30 transition-colors" aria-hidden="true">
                <svg className="w-6 h-6 text-[#76c893]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">Email Us</p>
                <a href="mailto:jamwoodepoxy@gmail.com" className="text-lg font-bold hover:text-[#22d3ee] transition-colors">jamwoodepoxy@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-lg border border-white/5 group-hover:border-[#76c893]/30 transition-colors" aria-hidden="true">
                <svg className="w-6 h-6 text-[#76c893]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">Call / WhatsApp</p>
                <a href="https://wa.me/18768737778" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:text-[#22d3ee] transition-colors">876-873-7778</a>
              </div>
            </div>
            
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-lg border border-white/5 group-hover:border-[#76c893]/30 transition-colors" aria-hidden="true">
                <svg className="w-6 h-6 text-[#76c893]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2} />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">Instagram</p>
                <a href="https://www.instagram.com/jamwoodepoxy_ja" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:text-[#22d3ee] transition-colors">@jamwoodepoxy_ja</a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-[#1a1a1a] p-10 rounded-2xl border border-white/5 shadow-2xl"
              >
                <form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-stone-500 font-black">Full Name</label>
                    <input 
                      id="name" 
                      name="name" 
                      type="text" 
                      required 
                      autoComplete="name"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#22d3ee] transition-all text-white placeholder-stone-800" 
                      placeholder="John Doe" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-stone-500 font-black">Email Address</label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      autoComplete="email"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#22d3ee] transition-all text-white placeholder-stone-800" 
                      placeholder="john@example.com" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="project_type" className="block text-[10px] uppercase tracking-widest text-stone-500 font-black">Project Specialty</label>
                    <div className="relative">
                      <select 
                        id="project_type" 
                        name="project_type" 
                        required
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#22d3ee] transition-all appearance-none text-white"
                      >
                        <option value="Dinner Table">Dinner Table</option>
                        <option value="Round Table">Coffee / Round Table</option>
                        <option value="Benches">Handcrafted Bench</option>
                        <option value="Artisan Candle Base">Artisan Candle Base</option>
                        <option value="Entrance Door">Artisan Entrance Door</option>
                        <option value="Custom Request">Bespoke Custom Request</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-[10px] uppercase tracking-widest text-stone-500 font-black">Vision Details</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={4} 
                      required 
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#22d3ee] transition-all text-white placeholder-stone-800 resize-none" 
                      placeholder="Share dimensions, preferred wood, or resin colors..."
                    ></textarea>
                  </div>

                  {error && (
                    <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold leading-relaxed">{error}</p>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSending}
                    className="w-full py-5 bg-[#22d3ee] text-black font-black uppercase tracking-[0.3em] rounded-xl transition-all outline-none focus-visible:ring-4 focus-visible:ring-white/20 flex items-center justify-center gap-3 hover:bg-[#76c893] disabled:opacity-50 disabled:hover:bg-[#22d3ee] active:scale-[0.98] shadow-lg shadow-cyan-900/10"
                  >
                    {isSending ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Quote...
                      </>
                    ) : 'Send Quote'}
                  </button>
                  <p className="text-[9px] text-stone-600 uppercase tracking-widest text-center font-bold">
                    Direct Secure Transmission to jamwoodepoxy@gmail.com
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1a1a] p-12 rounded-2xl border border-[#76c893]/20 shadow-2xl flex flex-col items-center justify-center text-center h-full"
              >
                <div className="w-20 h-20 bg-[#76c893]/10 rounded-full flex items-center justify-center mb-8 border border-[#76c893]/30">
                  <svg className="w-10 h-10 text-[#76c893]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Quote Requested</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-10 max-w-xs">
                  Your vision has been sent to our inbox. An artisan will review your requirements and reach out within 24 business hours.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-[#22d3ee] border-b border-[#22d3ee] pb-1 hover:text-white hover:border-white transition-colors"
                >
                  Request another quote
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Contact;
