
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageId } from '../App';
import { useAuth } from './FirebaseProvider';
import { loginWithGoogle, logout } from '../firebase';

interface NavbarProps {
  isScrolled: boolean;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  cartCount: number;
  onOpenCart: () => void;
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, currentPage, onNavigate, cartCount, onOpenCart, isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const navLinks: { name: string; id: PageId }[] = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Process', id: 'process' },
    { name: 'Gallery', id: 'gallery' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Orders', id: 'orders' });
  }

  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 ${
          isScrolled ? 'bg-black/90 backdrop-blur-xl py-2 border-b border-white/5' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <button 
            type="button"
            aria-label="Back to Home"
            className="flex items-center gap-2 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee] rounded-md"
            onClick={() => handleNavigate('home')}
          >
            <img 
              src="https://i.postimg.cc/wvQ0r90h/jwood-epoxy-transparent-logo.png" 
              alt="Jamwood Epoxy Logo" 
              className="h-16 md:h-24 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                aria-current={currentPage === link.id ? 'page' : undefined}
                onClick={() => handleNavigate(link.id)}
                className={`text-[0.7rem] uppercase tracking-[0.25em] font-bold transition-all relative outline-none focus-visible:text-white ${
                  currentPage === link.id ? 'text-[#22d3ee]' : 'text-stone-400 hover:text-white'
                }`}
              >
                {link.name}
                {currentPage === link.id && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#22d3ee]"
                  />
                )}
              </button>
            ))}
            
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 text-stone-400 hover:text-[#22d3ee] transition-colors outline-none group"
              aria-label="Open shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#22d3ee] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('contact')}
              className={`px-6 py-2 text-[0.7rem] uppercase tracking-[0.2em] font-black transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm ${
                currentPage === 'contact' 
                  ? 'bg-white text-black' 
                  : 'bg-[#22d3ee] text-black hover:bg-[#76c893]'
              }`}
            >
              Get Quote
            </button>

            {/* Auth Button */}
            <div className="ml-4 border-l border-white/10 pl-6">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                    alt={user.displayName || 'User'} 
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                  <button 
                    onClick={() => logout()}
                    className="text-[0.6rem] uppercase tracking-widest text-stone-500 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => loginWithGoogle()}
                  className="text-[0.7rem] uppercase tracking-[0.2em] font-bold text-stone-400 hover:text-[#22d3ee] transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Cart & Menu Trigger */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 text-stone-400"
              aria-label="Open shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#22d3ee] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              type="button"
              className="text-white p-2 outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6 text-[#22d3ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/98 backdrop-blur-3xl md:hidden flex flex-col items-center justify-center p-8"
          >
            <div className="flex flex-col items-center gap-6 w-full max-w-xs">
              {navLinks.map((link, i) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`text-lg font-bold uppercase tracking-[0.3em] ${currentPage === link.id ? 'text-[#22d3ee]' : 'text-stone-500'}`}
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => handleNavigate('contact')}
                className="w-full py-4 border border-[#22d3ee]/40 text-[#22d3ee] text-[10px] font-black uppercase tracking-[0.3em]"
              >
                Start A Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
