import React, { useState } from "react";
import { X, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext"; 
import { useCart } from "@/context/CartContext"; 

// ✅ FIX: Defined a specific type instead of using 'any'
type ProductType = {
  id: string | number;
  name: string;
  price: number;
  imageUrl: string;
  oldPrice?: number;
  rating?: number;
};

type ModalProps = {
  product: ProductType;
  onClose: () => void;
};

const QuickViewModal: React.FC<ModalProps> = ({ product, onClose }) => {
  // ✅ FIX: Removed 'const navigate = useNavigate();' because it was unused
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  const [quantity, setQuantity] = useState(1);

  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(String(product.id));
  
  const { addToCart } = useCart(); 

  const thumbnails = [
    product.imageUrl,
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=500",
    "https://images.unsplash.com/photo-1556012018-501537ad10c4?q=80&w=500",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=500",
  ];

  const handleAddToCart = () => {
    // We cast to any here if the CartContext expects a slightly different shape, 
    // but the props are now safely handled.
    addToCart(product as any, quantity); 
    window.dispatchEvent(new Event('open-mini-cart'));
    onClose(); 
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product as any);
    window.dispatchEvent(new Event('show-wishlist-toast'));
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 md:p-4">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] md:max-h-none overflow-y-auto md:overflow-hidden rounded-2xl md:rounded-sm relative flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[1010] p-2 bg-white/80 backdrop-blur-md rounded-full md:bg-transparent hover:rotate-90 transition-transform duration-300"
        >
          <X className="w-6 h-6 text-gray-500 md:text-gray-400" />
        </button>

        {/* LEFT: Image & Thumbnails */}
        <div className="w-full md:w-1/2 bg-[#f9f9f9] p-4 md:p-6 flex flex-col items-center justify-center md:justify-between border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[400px]">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="max-h-[300px] md:max-h-[450px] w-full object-contain transition-all duration-500" 
            />
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-6 overflow-x-auto no-scrollbar max-w-full px-2">
            {thumbnails.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-14 h-14 md:w-16 md:h-16 shrink-0 border-2 cursor-pointer transition-all ${
                  selectedImage === img ? "border-pink-500 shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2 md:mb-3 uppercase tracking-tighter italic leading-none">
              {product.name}
            </h2>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xl md:text-2xl font-black text-pink-500 italic">
                ₱{product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-gray-300 line-through text-base md:text-lg font-bold italic">
                  ₱{product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex gap-1 text-yellow-400 mb-6 text-xs">
               {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
            </div>

            <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-8 font-medium">
              Experience the elegance of our hand-picked floral collection. Perfect for gifting or bringing a touch of nature into your home.
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50 overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-white transition text-gray-400 font-black">-</button>
                  <span className="px-4 py-3 font-black w-10 text-center text-xs text-gray-700">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-white transition text-gray-400 font-black">+</button>
              </div>
              
              <button 
                onClick={handleWishlistToggle}
                className={`p-3.5 border rounded-xl transition-all ${
                  isFavorite 
                    ? "bg-pink-50 border-pink-200 text-pink-500" 
                    : "border-gray-100 text-gray-400 hover:text-pink-500 hover:bg-pink-50"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} strokeWidth={2.5} />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#1a1a1a] text-white py-4 md:py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-pink-500 transition-all shadow-xl shadow-gray-200 italic"
            >
              Add To Bag — ₱{(product.price * quantity).toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;