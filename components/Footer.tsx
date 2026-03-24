import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-white/5" aria-label="Site Footer">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-black text-xl tracking-tighter mb-2">
            <span className="text-[#76c893]">JAMWOOD</span>
            <span className="text-[#22d3ee]">EPOXY</span>
          </span>
          <p className="text-stone-500 text-[10px] uppercase tracking-widest">
            © 2024 Jamwood Epoxy. All Rights Reserved.
          </p>
        </div>

        <nav className="flex gap-8" aria-label="Social Media">
          <a 
            href="https://www.instagram.com/jamwoodepoxy_ja" 
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Jamwood Epoxy on Instagram"
            className="text-sm text-stone-500 hover:text-white transition-colors uppercase tracking-widest outline-none focus-visible:text-[#22d3ee] font-bold"
          >
            Instagram
          </a>
        </nav>

        <p className="text-stone-500 text-xs italic">
          "Elegance Sealed In Every Grain"
        </p>
      </div>
    </footer>
  );
};

export default Footer;