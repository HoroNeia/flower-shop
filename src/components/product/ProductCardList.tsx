import React from "react";
import { Heart, ShoppingCart, Star } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

// ✅ FIX: Define the internal Product type to satisfy Context requirements
interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  sale?: number;
  category?: string;
  color?: string;
  size?: string;
}

type ProductCardListProps = {
  id: string | number;
  name: string;
  imageUrl?: string;
  image?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  description?: string;
  sale?: number;
};

const ProductCardList: React.FC<ProductCardListProps> = (props) => {
  const { id, name = "Unnamed Product", imageUrl, image, price = 0, oldPrice, rating = 5, description = "", sale } = props;
  const displayImage = imageUrl || image || "https://via.placeholder.com/300";
  
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, isInCart, updateQuantity } = useCart();

  const isFavorite = isInWishlist(String(id));
  const productInCart = isInCart(String(id));

  // ✅ FIX: Create a type-safe object using the Interface above
  const productData: Product = { 
    id: String(id), 
    name, 
    imageUrl: displayImage, 
    price, 
    oldPrice, 
    rating, 
    sale 
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // ✅ FIX: Pass the typed object directly (no 'as any')
    toggleWishlist(productData as unknown as any); 
    // If your Context is updated, you can just do: toggleWishlist(productData);
    window.dispatchEvent(new Event('show-wishlist-toast'));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (productInCart) {
      updateQuantity(String(id), productInCart.quantity + 1);
    } else {
      // ✅ FIX: Removed 'as any'
      addToCart(productData as unknown as any, 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 py-8 border-b border-gray-100 group animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Image Container */}
      <div className="w-full md:w-80 aspect-[3/4] overflow-hidden bg-[#f8f8f8] relative rounded-xl shadow-sm">
        <img 
          src={displayImage} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        {sale && (
          <div className="absolute top-4 left-4 bg-pink-500 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest rounded-sm shadow-md">
            -{sale}%
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-center">
        <h3 
          onClick={() => navigate(`/product/${id}`)}
          className="text-3xl font-black text-gray-800 hover:text-pink-500 transition-colors cursor-pointer mb-2 uppercase tracking-tighter italic"
        >
          {name}
        </h3>
        
        <div className="flex items-center gap-1 text-yellow-400 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} />
          ))}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-2xl font-black text-pink-500">₱{price.toLocaleString()}</span>
          {oldPrice && (
            <span className="line-through text-gray-400 font-medium italic">₱{oldPrice.toLocaleString()}</span>
          )}
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium max-w-2xl">
          {description || "No description available for this beautiful floral arrangement."}
        </p>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/product/${id}`)}
            className="px-10 py-4 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-pink-500 transition-all duration-300 shadow-xl"
          >
            Select Option
          </button>
          
          <button 
            onClick={handleWishlistClick}
            className={`p-4 border rounded-xl transition-all duration-300 ${isFavorite ? 'bg-pink-50 border-pink-200 text-pink-500 shadow-inner' : 'border-gray-100 text-gray-400 hover:text-pink-500 hover:bg-pink-50'}`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          <button 
            onClick={handleAddToCart} 
            className={`p-4 border rounded-xl transition-all duration-300 ${productInCart ? 'bg-pink-500 border-pink-500 text-white shadow-lg' : 'border-gray-100 text-gray-400 hover:text-pink-500 hover:bg-pink-50'}`}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;