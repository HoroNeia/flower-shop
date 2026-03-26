import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1523694553227-ec11707ef59b?q=80&w=2070&auto=format&fit=crop",
    tag: "Seasonal Selection",
    title: "FRESH SPRING BLOOMS",
    subtitle: "Hand-curated peonies and rare roses for your most precious moments.",
  },
  {
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=2080&auto=format&fit=crop",
    tag: "Luxury Collection",
    title: "TIMELESS ELEGANCE",
    subtitle: "Deep crimson bouquets designed to leave a lasting botanical impression.",
  },
  {
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2070&auto=format&fit=crop",
    tag: "Direct Delivery",
    title: "GARDEN TO DOOR",
    subtitle: "Eco-friendly arrangements delivered fresh from our Apalit fields.",
  },
];

const CarouselWithNavbar = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  return (
    <div 
      className="relative w-full h-[90vh] md:h-[95vh] overflow-hidden group bg-gray-950" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 🌸 LUXURY OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-20 pointer-events-none"></div>

      {/* Floating Navbar - Adjusted top spacing for mobile */}
      <div className="absolute top-6 md:top-10 left-0 w-full z-50 animate-in fade-in slide-in-from-top-4 duration-1000 px-4 md:px-0">
        <Navbar />
      </div>

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 flex items-center justify-center ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Background Image with Ken Burns Effect */}
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-linear ${
              index === currentSlide ? "scale-110" : "scale-100"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-pink-900/10 mix-blend-multiply"></div>
          </div>

          {/* Centered Content - Responsive padding and width */}
          <div className="relative z-30 text-center text-white px-6 w-full max-w-5xl mt-12 md:mt-0">
            <span className={`inline-block text-pink-400 font-black text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] mb-4 md:mb-6 italic transition-all duration-1000 delay-300 ${
              index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}>
              {slide.tag}
            </span>

            {/* 🌟 RESPONSIVE TYPOGRAPHY: Scale text based on screen size */}
            <h1 className={`text-3xl sm:text-5xl md:text-8xl font-black mb-4 md:mb-8 tracking-tighter uppercase italic leading-[1] md:leading-[0.9] transition-all duration-1000 delay-500 ${
              index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}>
              {slide.title}
            </h1>

            <p className={`text-xs md:text-lg font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-200 max-w-[280px] md:max-w-2xl mx-auto mb-8 md:mb-12 transition-all duration-1000 delay-700 leading-relaxed ${
              index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}>
              {slide.subtitle}
            </p>

            {/* Boutique Button - Slightly smaller on mobile */}
            <button 
              onClick={() => navigate("/shop")}
              className={`group relative h-12 md:h-16 px-8 md:px-12 bg-white text-black text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all duration-700 delay-1000 italic ${
                index === currentSlide ? "translate-y-0 opacity-100 shadow-2xl" : "translate-y-10 opacity-0"
              }`}
            >
              <span className="absolute inset-0 w-0 bg-pink-500 transition-all duration-500 ease-out group-hover:w-full"></span>
              <span className="relative z-10 group-hover:text-white transition-colors">Discover Collection →</span>
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Hidden on small mobile to avoid thumb-clashing */}
      <button 
        onClick={prevSlide} 
        className="hidden md:flex absolute top-1/2 left-6 lg:left-10 z-40 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-white/20 items-center justify-center text-white/50 hover:text-white hover:border-white hover:bg-white/10 transition-all duration-500 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0"
      >
        <ChevronLeftIcon className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>
      <button 
        onClick={nextSlide} 
        className="hidden md:flex absolute top-1/2 right-6 lg:right-10 z-40 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-white/20 items-center justify-center text-white/50 hover:text-white hover:border-white hover:bg-white/10 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0"
      >
        <ChevronRightIcon className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      {/* Boutique Progress Indicators - Hidden on mobile to keep the frame clean */}
      <div className="hidden sm:flex absolute bottom-12 left-12 flex-col space-y-4 z-40">
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
              currentSlide === index ? "w-12 bg-pink-500" : "w-6 bg-white/20"
            }`} />
          </button>
        ))}
      </div>

      {/* Visual Accents - Hidden on small mobile */}
      <div className="hidden md:block absolute bottom-12 right-12 z-40">
         <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.5em] [writing-mode:vertical-lr] italic">
            Nesviera • Botanical Luxury
         </p>
      </div>

      {/* 📱 MOBILE PAGINATION DOTS: Minimalist replacement for side numbers */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-2 md:hidden">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className={`h-1 transition-all duration-500 rounded-full ${index === currentSlide ? "w-8 bg-pink-500" : "w-2 bg-white/30"}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselWithNavbar;