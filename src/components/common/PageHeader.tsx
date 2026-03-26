import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react"; 

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  // 🌟 Logic preserved exactly as you requested
  const floralCategories = [
    "Roses", "Tulips", "Sunflowers", "Lilies", 
    "Orchids", "Peonies", "Mixed Bouquets"
  ];
  
  const displayTitle = floralCategories.includes(title) 
    ? `${title} Image` 
    : title;

  return (
    /* 🌟 RESPONSIVE PADDING: Reduced pt on mobile so content starts sooner */
    <div className="w-full bg-[#fff5f7] pt-20 md:pt-32 pb-8 md:pb-10 border-b border-pink-100/30 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">

        {/* Breadcrumb - Adjusted tracking for narrow screens */}
        <nav className="flex justify-center items-center gap-2 md:gap-3 mb-3">
          <Link 
            to="/" 
            className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.4em] hover:text-pink-500 transition-colors italic"
          >
            Home
          </Link>
          <ChevronRight size={10} className="text-pink-200" />
          <span className="text-[9px] md:text-[11px] font-black text-pink-500 uppercase tracking-[0.2em] md:tracking-[0.4em] italic truncate max-w-[200px] md:max-w-none">
            {displayTitle}
          </span>
        </nav>

        {/* Page Title - Fluid Font Sizes */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-[1.1] md:leading-none">
          {displayTitle}
        </h1>

        <div className="flex justify-center items-center mt-4">
            <div className="w-10 md:w-12 h-[2px] bg-pink-500/20 rounded-full" />
        </div>

      </div>

      {/* Subtle background flair - hidden on mobile to avoid overflow issues */}
      <div className="hidden md:block absolute -bottom-10 -right-10 opacity-[0.02] pointer-events-none select-none">
         <span className="text-[12rem] font-black italic uppercase tracking-tighter">Nesviera</span>
      </div>
    </div>
  );
};

export default PageHeader;