import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, ChevronUp } from "lucide-react"; // Removed Youtube

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#fff5f7] text-gray-800 pt-16 md:pt-32 pb-10 md:pb-16 border-t border-pink-100/50 relative overflow-hidden">
      
      {/* Ghost Watermark */}
      <div className="hidden lg:block absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
        <h2 className="text-[15rem] font-black italic uppercase leading-none tracking-tighter text-pink-900">
          Blooms
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-16 md:mb-20 text-center md:text-left">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6 flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-gray-900">
              Nesviera
            </h2>
            <div className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-pink-400/80 leading-loose">
              <p>© 2026 Nesviera's Blooms.</p>
              <p>Hand-curated botanical masterpieces.</p>
            </div>
          </div>

          {/* ABOUT US */}
          <div>
            <h3 className="text-[10px] font-black mb-6 md:mb-10 uppercase tracking-[0.3em] text-gray-400">About Us</h3>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-600">
              <li><Link to="/about" className="hover:text-pink-500 transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-pink-500 transition-colors">Store Location</Link></li>
              <li className="hidden md:block"><Link to="/my-account" className="hover:text-pink-500 transition-colors">Order Tracking</Link></li>
            </ul>
          </div>

          {/* USEFUL LINKS */}
          <div className="hidden sm:block">
            <h3 className="text-[10px] font-black mb-10 uppercase tracking-[0.3em] text-gray-400">Useful Links</h3>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-600">
              <li className="hover:text-pink-500 cursor-pointer transition-colors">Returns</li>
              <li className="hover:text-pink-500 cursor-pointer transition-colors">Support Policy</li>
              <li className="hover:text-pink-500 cursor-pointer transition-colors">Size Guide</li>
              <li className="hover:text-pink-500 cursor-pointer transition-colors">FAQs</li>
            </ul>
          </div>

          {/* FOLLOW US */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[10px] font-black mb-6 md:mb-10 uppercase tracking-[0.3em] text-gray-400">Follow Us</h3>
            <ul className="flex flex-row md:flex-col justify-center gap-6 text-gray-400">
              <li>
                <a 
                  href="https://www.facebook.com/nesvierasflowershop" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 group"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-pink-500 group-hover:text-white transition-all">
                    <Facebook size={14} />
                  </div>
                  <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-pink-500">Facebook</span>
                </a>
              </li>

              <li>
                <a href="#" className="flex items-center gap-3 group">
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-pink-500 group-hover:text-white transition-all">
                    <Instagram size={14} />
                  </div>
                  <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-pink-500">Instagram</span>
                </a>
              </li>
            </ul>
          </div>

          {/* SUBSCRIBE */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[10px] font-black mb-6 md:mb-10 uppercase tracking-[0.3em] text-gray-400">Newsletter</h3>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-100/50 w-full max-w-[320px]">
                <div className="relative">
                  <input
                      type="email"
                      placeholder="EMAIL"
                      className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-[10px] font-black tracking-widest focus:ring-2 focus:ring-pink-200 transition-all placeholder:text-gray-300 uppercase shadow-inner"
                  />
                  <button className="mt-4 w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-pink-500 transition-all italic">
                      Submit →
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-pink-200/30 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-pink-300 text-center">
              Apalit • Pampanga • Philippines
            </p>
            <div className="flex gap-4 opacity-30 grayscale scale-75 md:scale-100">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-3" alt="Paypal" />
            </div>
        </div>
      </div>

      {/* 🚀 SCROLL TO TOP */}
      {isVisible && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-white text-pink-500 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl hover:bg-pink-500 hover:text-white transition-all z-50 group border border-pink-50"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;
