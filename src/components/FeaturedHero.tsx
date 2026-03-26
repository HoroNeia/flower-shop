import React from "react";

// Assets
import example1 from "@/assets/example1.jpg";
import example2 from "@/assets/example2.jpg";
import example3 from "@/assets/example3.jpg";
import example4 from "@/assets/example4.jpg";
import example5 from "@/assets/example5.jpg";

const FeaturedHero = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
      {/* Optional Header for the Gallery */}
      <div className="text-center mb-10 md:mb-16">
        <span className="text-pink-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.4em] mb-2 block italic">
          Boutique Gallery
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter uppercase italic leading-none">
          CRAFTED WITH LOVE
        </h2>
      </div>

      {/* 🌟 LUXURY GRID LAYOUT */}
      {/* Changed h-auto to specific mobile heights to ensure the "Luxury" feel remains consistent */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[700px]">
        
        {/* Left Big Feature: Stacks on top for mobile, 5-columns on desktop */}
        <div className="md:col-span-5 h-[400px] md:h-full relative group overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-pink-100/50 shadow-sm">
          <img
            src={example5}
            alt="Feature"
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          />
          {/* Subtle Overlay Label - Scaled for mobile */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
             <span className="bg-white/90 backdrop-blur-md px-4 md:px-6 py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-800 shadow-lg">
                Signature Collection
             </span>
          </div>
        </div>

        {/* Right 2x2 Grid: Stacks under feature on mobile */}
        <div className="md:col-span-7 grid grid-cols-2 grid-rows-2 gap-4 md:gap-6 h-[400px] md:h-full">
          
          <div className="relative group overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-pink-100/30 shadow-sm">
            <img
              src={example1}
              alt="Example 1"
              className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
            />
          </div>

          <div className="relative group overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-pink-100/30 shadow-sm">
            <img
              src={example2}
              alt="Example 2"
              className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
            />
          </div>

          <div className="relative group overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-pink-100/30 shadow-sm">
            <img
              src={example3}
              alt="Example 3"
              className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
            />
          </div>

          <div className="relative group overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-pink-100/30 shadow-sm">
            <img
              src={example4}
              alt="Example 4"
              className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
            />
          </div>

        </div>

      </div>

      {/* Boutique Slogan Bottom */}
      <div className="mt-12 flex justify-center items-center gap-4 md:gap-6 text-center">
         {/* Hide decorative lines on very small screens to prevent wrapping */}
         <div className="hidden sm:block h-[1px] w-12 md:w-20 bg-pink-100" />
         <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-300 italic px-2">
            Nesviera Floral Artistry
         </p>
         <div className="hidden sm:block h-[1px] w-12 md:w-20 bg-pink-100" />
      </div>
    </div>
  );
};

export default FeaturedHero;