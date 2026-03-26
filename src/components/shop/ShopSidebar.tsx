import React, { useState } from "react";
import { Search, Filter, XCircle, X, ChevronRight } from "lucide-react";

interface ShopSidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (val: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (val: string[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (val: string[]) => void;
}

const categories = ["Roses", "Tulips", "Sunflowers", "Lilies", "Orchids", "Peonies", "Mixed Bouquets", "Funeral"];
const colors = [
  { name: "Red", hex: "#e11d48" },
  { name: "Pink", hex: "#f472b6" },
  { name: "White", hex: "#ffffff" },
  { name: "Yellow", hex: "#facc15" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Orange", hex: "#fb923c" }
];
const sizes = ["S", "M", "X", "XL", "XXL"];

const ShopSidebar: React.FC<ShopSidebarProps> = ({
  searchQuery, setSearchQuery,
  selectedCategories, setSelectedCategories,
  selectedColors, setSelectedColors,
  selectedSizes, setSelectedSizes,
}) => {
  // 🌟 State to control the mobile slide-out drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCheckboxChange = (value: string, selected: string[], setSelected: (val: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSearchQuery("");
  };

  const hasFilters = selectedCategories.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || searchQuery !== "";

  return (
    <>
      {/* 📱 MOBILE ACTION BUTTON: Fixed or inline button to trigger the hidden sidebar */}
      <div className="lg:hidden mb-8">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="w-full flex items-center justify-between bg-white border border-pink-100 p-5 rounded-[2rem] shadow-xl shadow-pink-50/50 group active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-pink-500 p-2 rounded-xl text-white shadow-lg shadow-pink-200">
              <Filter size={16} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-800 italic">Refine Selection</span>
            {hasFilters && <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />}
          </div>
          <ChevronRight size={18} className="text-pink-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 🌟 THE SIDEBAR (Desktop: Block | Mobile: Slide-over Overlay) */}
      <div className={`
        fixed inset-0 z-[2000] lg:relative lg:inset-auto lg:z-auto
        ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-500 ease-in-out
      `}>
        
        {/* Mobile Backdrop */}
        {isDrawerOpen && (
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm lg:hidden" 
            onClick={() => setIsDrawerOpen(false)} 
          />
        )}

        {/* Sidebar Body */}
        <div className="
          relative w-[85%] max-w-sm h-full bg-white lg:bg-transparent 
          lg:w-full lg:max-w-none lg:h-auto overflow-y-auto lg:overflow-visible
          p-8 lg:p-0 space-y-12 shadow-2xl lg:shadow-none
        ">
          
          {/* Mobile Header */}
          <div className="flex justify-between items-center lg:hidden mb-10 border-b border-gray-50 pb-6">
            <div>
              <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">Filters</h3>
              <p className="text-[9px] font-bold text-pink-400 uppercase tracking-widest mt-1">Refine your bouquet</p>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400"><X size={24} /></button>
          </div>

          {/* Filter By Header (Desktop) */}
          <div className="hidden lg:flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-800 italic">Filter By</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-[9px] font-black uppercase text-pink-500 hover:text-black transition-colors flex items-center gap-1">
                <XCircle size={12} /> Clear All
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-pink-400 transition-colors" size={16} />
            <input
              type="text"
              placeholder="SEARCH BLOOMS..."
              className="w-full bg-[#fff5f7] border-none p-4 pl-10 rounded-2xl text-[10px] font-bold text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-pink-100 transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sections (Categories, Colors, Sizes) */}
          <div className="space-y-12">
            
            {/* Categories */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 flex items-center gap-2">
                <div className="w-4 h-[1px] bg-pink-500" /> Categories
              </h3>
              <div className="grid grid-cols-1 gap-y-4">
                {categories.map((cat) => (
                  <label key={cat} className="flex group items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border-2 border-pink-100 rounded-lg checked:bg-pink-500 checked:border-pink-500 transition-all cursor-pointer shadow-sm"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCheckboxChange(cat, selectedCategories, setSelectedCategories)}
                    />
                    <span className={`ml-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${selectedCategories.includes(cat) ? 'text-pink-600' : 'text-gray-400 group-hover:text-pink-400'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 flex items-center gap-2">
                <div className="w-4 h-[1px] bg-pink-500" /> Color Palette
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {colors.map((c) => (
                  <label key={c.name} className="flex group items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border-2 border-pink-100 rounded-full checked:ring-2 checked:ring-pink-500 checked:ring-offset-2 transition-all cursor-pointer shrink-0"
                      style={{ backgroundColor: c.hex, borderColor: c.name === 'White' ? '#fce7f3' : c.hex }}
                      checked={selectedColors.includes(c.name)}
                      onChange={() => handleCheckboxChange(c.name, selectedColors, setSelectedColors)}
                    />
                    <span className={`ml-3 text-[11px] font-bold uppercase tracking-widest transition-colors truncate ${selectedColors.includes(c.name) ? 'text-pink-600' : 'text-gray-400 group-hover:text-pink-400'}`}>
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 flex items-center gap-2">
                <div className="w-4 h-[1px] bg-pink-500" /> Dimensions
              </h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleCheckboxChange(s, selectedSizes, setSelectedSizes)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border
                      ${selectedSizes.includes(s) 
                        ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white shadow-lg' 
                        : 'bg-white border-pink-50 text-gray-400 hover:border-pink-500 hover:text-pink-500'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="pt-10 lg:hidden">
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-pink-500 text-white py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-pink-200 active:scale-95 transition-all italic"
              >
                Apply Filters
              </button>
              {hasFilters && (
                <button onClick={clearFilters} className="w-full mt-4 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                  Reset Everything
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSidebar;