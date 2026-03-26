import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  totalProducts: number;
  productsPerPage: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  totalProducts,
  productsPerPage,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (totalPages <= 1) return null;

  const handleClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 mt-16 md:mt-24 mb-12 md:mb-16 px-4">
      {/* Subtle Divider */}
      <div className="w-16 md:w-24 h-[1px] bg-pink-200/50 mb-2 md:mb-4" />

      <div className="flex items-center gap-2 md:gap-4 w-full justify-center">
        {/* Previous Button */}
        <button
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 md:w-12 md:h-12 flex shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-white border border-pink-50 text-gray-400 hover:text-pink-500 hover:border-pink-500 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* 🌟 RESPONSIVE NUMBER CARDS: Scrollable on small screens, centered on desktop */}
        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar py-2 px-1 max-w-[240px] sm:max-w-none">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => handleClick(n)}
              className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black transition-all duration-500 uppercase italic tracking-tighter border
                ${
                  currentPage === n
                    ? "bg-[#1a1a1a] border-[#1a1a1a] text-white shadow-xl md:shadow-2xl shadow-gray-300 md:-translate-y-1"
                    : "bg-white border-pink-50 text-gray-400 hover:border-pink-500 hover:text-pink-500"
                }`}
            >
              {n.toString().padStart(2, "0")}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 md:w-12 md:h-12 flex shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-white border border-pink-50 text-gray-400 hover:text-pink-500 hover:border-pink-500 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
        >
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Page Context - Adjusted tracking for mobile */}
      <div className="flex items-center gap-3 md:gap-4">
         <span className="h-[1px] w-6 md:w-8 bg-gray-100" />
         <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-300 italic">
            Discovery {currentPage} of {totalPages}
         </p>
         <span className="h-[1px] w-6 md:w-8 bg-gray-100" />
      </div>
    </div>
  );
};

export default Pagination;