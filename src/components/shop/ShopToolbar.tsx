import React from "react";
import { LayoutGrid, Grid3X3, List, ChevronDown } from "lucide-react";

type ShopToolbarProps = {
  totalResults: number;
  showingResults: number;
  sortOption: string;
  setSortOption: (val: string) => void;
  viewMode: 'grid' | 'large-grid' | 'list';
  setViewMode: (mode: 'grid' | 'large-grid' | 'list') => void;
};

const ShopToolbar: React.FC<ShopToolbarProps> = ({ 
  totalResults, 
  showingResults, 
  sortOption, 
  setSortOption,
  viewMode,
  setViewMode
}) => {
  return (
    /* 🌟 RESPONSIVE FLEX: Column on mobile, Row on md+ screens. Balanced alignment. */
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 pb-8 mb-8 md:mb-12 border-b border-pink-100/50 px-2">
      
      {/* Container for Switcher & Count - Stacks vertically on tiny screens, horizontally on sm+ */}
      <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 w-full md:w-auto">
        
        {/* VIEW SWITCHER */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-pink-50 shadow-sm shrink-0">
          
          <button 
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              viewMode === 'grid' 
                ? 'bg-[#1a1a1a] text-white shadow-lg scale-105' 
                : 'text-gray-300 hover:text-pink-500 hover:bg-pink-50'
            }`}
          >
            <LayoutGrid size={18} strokeWidth={2.5} />
          </button>

          <button 
            onClick={() => setViewMode('large-grid')}
            title="Compact View"
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              viewMode === 'large-grid' 
                ? 'bg-[#1a1a1a] text-white shadow-lg scale-105' 
                : 'text-gray-300 hover:text-pink-500 hover:bg-pink-50'
            }`}
          >
            <Grid3X3 size={18} strokeWidth={2.5} />
          </button>

          <button 
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              viewMode === 'list' 
                ? 'bg-[#1a1a1a] text-white shadow-lg scale-105' 
                : 'text-gray-300 hover:text-pink-500 hover:bg-pink-50'
            }`}
          >
            <List size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* RESULTS COUNT - Center text on mobile for balance */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 leading-none mb-1.5 italic">
                Inventory
            </p>
            <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Showing {showingResults} <span className="mx-1 text-pink-200">/</span> {totalResults} Blooms
            </p>
        </div>
      </div>

      {/* SORT DROPDOWN - Full width on mobile for easier selection */}
      <div className="relative group w-full md:w-auto min-w-[200px]">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400">
           <ChevronDown size={14} strokeWidth={3} />
        </div>
        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full appearance-none bg-[#fff5f7] border-none pl-10 pr-6 py-4 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 cursor-pointer focus:ring-4 focus:ring-pink-50 transition-all shadow-inner italic"
        >
          <option value="Default">Standard Catalog</option>
          <option value="Price Low → High">Price: Low to High</option>
          <option value="Price High → Low">Price: High to Low</option>
          <option value="Newest">Newest Arrivals</option>
        </select>
      </div>

    </div>
  );
};

export default ShopToolbar;