import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom"; // 🌟 ADDED

/* ---------------- SLIDE DATA ---------------- */
const slides = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1594967383210-b962776c1f10?q=80&w=1920&auto=format&fit=crop",
    tag: "New Arrival",
    title: "CELEBRATE IN FULL BLOOM",
    description: "Our curated flower and balloon collections bring a burst of joy to every special moment.",
    cta: "Shop Collections",
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1549416878-b9ca95e26903?q=80&w=1920&auto=format&fit=crop",
    tag: "Luxury Sets",
    title: "JOY IN EVERY DETAIL",
    description: "Carefully crafted arrangements designed to make unforgettable smiles happen.",
    cta: "Discover More",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1502977249166-d61877c8b2a8?q=80&w=1920&auto=format&fit=crop",
    tag: "Boutique Choice",
    title: "BURSTING WITH COLOR",
    description: "A harmonious blend of nature's best and playful, elegant balloons.",
    cta: "View Gallery",
  },
];

const BloomsBalloonsHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); // 🌟 INITIALIZED

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[100vh] md:h-[85vh] overflow-hidden bg-gray-950 group">
      
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear ${
              index === currentSlide ? "scale-110" : "scale-100"
            }`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 md:to-black/60" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-30 pointer-events-none mt-10 md:mt-16">
            <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-pink-400 mb-4 italic transition-all duration-1000 delay-300 ${
              index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}>
              {slide.tag}
            </span>
            
            <h1 className={`text-4xl sm:text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic leading-[0.95] md:leading-[0.9] transition-all duration-1000 delay-500 ${
              index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}>
              {slide.title}
            </h1>

            <p className={`text-[10px] md:text-lg max-w-xs md:max-w-xl mb-10 md:mb-12 font-bold uppercase tracking-[0.2em] md:tracking-widest text-gray-200 transition-all duration-1000 delay-700 leading-relaxed ${
              index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}>
              {slide.description}
            </p>

            {/* 🌟 UPDATED BUTTON WITH NAVIGATION */}
            <button 
              onClick={() => navigate("/shop")} // 🌟 ACTION ADDED
              className={`pointer-events-auto group relative h-12 md:h-14 px-8 md:px-12 bg-white text-black text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-1000 delay-1000 italic ${
              index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}>
              <span className="absolute inset-0 w-0 bg-pink-500 transition-all duration-500 ease-out group-hover:w-full"></span>
              <span className="relative z-10 group-hover:text-white transition-colors">{slide.cta} →</span>
            </button>
          </div>
        </div>
      ))}

      {/* LUXURY CONTROLS */}
      <div className="absolute bottom-12 left-12 flex flex-col space-y-6 z-40 hidden lg:flex">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group flex items-center gap-4 focus:outline-none"
          >
            <span className={`text-[10px] font-black italic transition-all duration-500 ${
              currentSlide === index ? "text-pink-500 translate-x-2" : "text-white/30"
            }`}>
              0{index + 1}
            </span>
            <div className={`h-[1px] transition-all duration-700 ${
              currentSlide === index ? "w-16 bg-pink-500 shadow-[0_0_10px_#ec4899]" : "w-8 bg-white/20"
            }`} />
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-2 md:p-4 text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block">
        <ChevronLeftIcon className="w-8 h-8 md:w-12 md:h-12 stroke-1" />
      </button>
      
      <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-2 md:p-4 text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block">
        <ChevronRightIcon className="w-8 h-8 md:w-12 md:h-12 stroke-1" />
      </button>

      {/* MOBILE PAGINATION */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2 lg:hidden">
        {slides.map((_, index) => (
          <div key={index} className={`h-1 transition-all duration-500 rounded-full ${index === currentSlide ? "w-8 bg-pink-500" : "w-2 bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
};

export default BloomsBalloonsHero;