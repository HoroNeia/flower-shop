import React, { useState } from "react";
import { Heart, Eye } from "lucide-react"; // 🌟 Optimized imports
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import QuickViewModal from "@/components/shop/QuickViewModal";

type ProductCardProps = {
  id: string | number;
  name: string;
  imageUrl?: string;
  image?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  sale?: number;
};

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { id, name, imageUrl, image, price, oldPrice, rating = 5, sale } = props;
  const displayImage = imageUrl || image || "https://via.placeholder.com/300";
  
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(String(id));

  const handleSelectOption = () => {
    navigate(`/product/${id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({ id, name, imageUrl: displayImage, price, oldPrice, rating, sale } as any);
    window.dispatchEvent(new Event('show-wishlist-toast'));
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      {/* 🌟 CONTAINER: Removed fixed widths. It now naturally fills the Grid cell. */}
      <div className="group relative flex flex-col bg-transparent transition-all duration-500 w-full h-full">
        
        {/* --- IMAGE CONTAINER --- */}
        {/* 🌟 RESPONSIVE: Aspect ratio keeps height consistent even as the grid narrows. */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-white rounded-[1.25rem] md:rounded-[2rem] border border-pink-100/30 shadow-sm group-hover:shadow-xl md:group-hover:-translate-y-1 transition-all duration-700">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />

          {/* Luxury Sale Badge */}
          {sale && (
            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
              <span className="bg-[#1a1a1a] text-white text-[7px] md:text-[8px] font-black px-2 py-1 uppercase rounded-full shadow-lg tracking-widest">
                -{sale}%
              </span>
            </div>
          )}

          {/* --- ACTION OVERLAY --- */}
          {/* 🌟 UI FIX: Hidden on mobile to keep the clean look, slides up on desktop. */}
          <div className="absolute inset-0 bg-black/5 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute bottom-3 md:bottom-5 left-0 right-0 flex justify-center items-center gap-1.5 md:gap-2 md:translate-y-20 md:group-hover:translate-y-0 transition-transform duration-500 z-30 px-2">
            <button 
              onClick={handleWishlistClick}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-xl transition-all duration-300 ${
                isFavorite ? "bg-pink-500 text-white" : "bg-white text-gray-400 hover:text-pink-500"
              }`}
            >
              <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>

            <button
              onClick={handleSelectOption}
              className="flex-1 md:flex-none px-3 md:px-5 h-8 md:h-10 bg-[#1a1a1a] text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest rounded-xl shadow-xl hover:bg-pink-500 transition-all italic"
            >
              Details
            </button>

            <button 
              onClick={handleQuickView} 
              className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 bg-white text-gray-400 rounded-xl items-center justify-center shadow-xl hover:text-pink-500 transition-all"
            >
              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* --- TEXT CONTENT --- */}
        <div className="pt-3 md:pt-5 pb-2 flex flex-col items-center text-center px-1">
          <h3 
            onClick={handleSelectOption}
            className="text-[10px] md:text-[12px] font-black text-gray-800 hover:text-pink-500 transition-all cursor-pointer w-full truncate uppercase tracking-tight italic leading-tight"
          >
            {name}
          </h3>
          
          {/* Rating Dots */}
          <div className="mt-1.5 md:mt-2 flex justify-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-0.5 h-0.5 md:w-1 md:h-1 rounded-full ${i < rating ? 'bg-pink-400' : 'bg-gray-200'}`} 
              />
            ))}
          </div>

          <div className="mt-2 md:mt-3 flex flex-wrap items-center justify-center gap-1.5 md:gap-3">
            <span className="font-black text-pink-500 text-sm md:text-base tracking-tighter italic">
              ₱{(price || 0).toLocaleString()}
            </span>
            {oldPrice && (
              <span className="line-through text-gray-300 text-[10px] md:text-xs font-bold tracking-tighter italic">
                ₱{Number(oldPrice || 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <QuickViewModal 
          product={{...props, imageUrl: displayImage}} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default ProductCard;