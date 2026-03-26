import React, { useState } from "react";
import { MessageSquare, Info, FileText } from "lucide-react";

type ProductTabsProps = {
  description?: string;
  category?: string;
  size?: string;
};

const ProductTabs: React.FC<ProductTabsProps> = ({ description, category, size }) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description", icon: <FileText size={14} /> },
    { id: "additional", label: "Additional Info", icon: <Info size={14} /> },
    { id: "reviews", label: "Reviews (0)", icon: <MessageSquare size={14} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-20 mt-10 md:mt-20">
      
      {/* --- TAB NAVIGATION --- */}
      {/* 🌟 RESPONSIVE FIX: Added overflow-x-auto and no-scrollbar so tabs don't squish on small phones */}
      <div className="flex justify-start md:justify-center items-center gap-6 md:gap-10 border-b border-gray-100 mb-8 md:mb-12 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-1 flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all relative shrink-0 ${
              activeTab === tab.id
                ? "text-pink-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 animate-in fade-in slide-in-from-left-2" />
            )}
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT --- */}
      <div className="max-w-4xl mx-auto min-h-[150px] animate-in fade-in duration-500">
        {activeTab === "description" && (
          <div className="space-y-6">
            <p className="text-gray-500 leading-relaxed font-medium text-center text-sm md:text-base px-2">
              {description || "No description provided for this specific arrangement."}
            </p>
            <p className="text-[9px] md:text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center px-4">
              Care Instructions: Keep in a cool environment and change water every 2 days.
            </p>
          </div>
        )}

        {activeTab === "additional" && (
          <div className="flex justify-center">
            {/* 🌟 RESPONSIVE GRID: 1 column on mobile, 2 columns on tablet/desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-6 md:gap-y-4 bg-gray-50 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 w-full sm:w-auto">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[8px] md:text-[9px] font-black text-pink-400 uppercase tracking-widest">Category</p>
                <p className="text-xs md:text-sm font-bold text-gray-700 uppercase">{category || "Floral"}</p>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[8px] md:text-[9px] font-black text-pink-400 uppercase tracking-widest">Available Sizes</p>
                <p className="text-xs md:text-sm font-bold text-gray-700 uppercase">{size || "S, M, L"}</p>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[8px] md:text-[9px] font-black text-pink-400 uppercase tracking-widest">Longevity</p>
                <p className="text-xs md:text-sm font-bold text-gray-700 uppercase">5-7 Days</p>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[8px] md:text-[9px] font-black text-pink-400 uppercase tracking-widest">Origin</p>
                <p className="text-xs md:text-sm font-bold text-gray-700 uppercase">Local Harvest</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <MessageSquare className="text-gray-300" size={20} />
            </div>
            <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">No reviews yet</p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">Be the first to share your experience with this bouquet!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;