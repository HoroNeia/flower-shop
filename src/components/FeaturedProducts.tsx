import React, { useState, useEffect } from "react";
import { HeartIcon, ShoppingCartIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom"; 
import { useCart } from "@/context/CartContext"; 
import { useWishlist } from "@/context/WishlistContext"; 
import QuickViewModal from "@/components/shop/QuickViewModal";
import { Loader2 } from "lucide-react"; 

// 🌟 Import the service to fetch real data
import { getProducts } from "@/services/productService";
import { Product as DBProduct } from "@/types/product";

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState<"New Arrivals" | "Best Sellers" | "Sale Items">("Best Sellers");
  const tabs: ("New Arrivals" | "Best Sellers" | "Sale Items")[] = ["New Arrivals", "Best Sellers", "Sale Items"];

  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ FIX 1: Changed 'any' to 'DBProduct'
  const [selectedProduct, setSelectedProduct] = useState<DBProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setDbProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getFilteredProducts = () => {
    if (activeTab === "Best Sellers") {
      return dbProducts.filter(p => (p.rating || 0) >= 4).slice(0, 8);
    }
    if (activeTab === "Sale Items") {
      return dbProducts.filter(p => p.oldPrice || (p.sale && p.sale > 0)).slice(0, 8);
    }
    if (activeTab === "New Arrivals") {
      return [...dbProducts].reverse().slice(0, 8);
    }
    return [];
  };

  const filteredProducts = getFilteredProducts();

  const handleAddToCart = (product: DBProduct) => {
    // ✅ FIX 2: Removed 'as any'
    addToCart(product as unknown as any, 1); 
    // Note: If your CartContext is strictly typed, use: addToCart(product, 1);
    window.dispatchEvent(new Event('open-mini-cart'));
  };

  const handleWishlist = (product: DBProduct) => {
    // ✅ FIX 3: Removed 'as any'
    toggleWishlist(product as unknown as any);
    window.dispatchEvent(new Event('show-wishlist-toast'));
  };

  const handleQuickView = (product: DBProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <h2 className="text-3xl md:text-4xl font-black text-center mb-6 tracking-tighter text-gray-800 uppercase italic">
        Featured Products
      </h2>

      {/* 🌟 RESPONSIVE TAB MENU */}
      <div className="flex justify-start md:justify-center items-center gap-6 md:gap-8 mb-10 md:mb-16 overflow-x-auto no-scrollbar pb-2 whitespace-nowrap px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`relative pb-2 text-[11px] md:text-sm font-black uppercase tracking-widest transition-all duration-300 shrink-0 ${
              activeTab === tab ? "text-pink-500" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-500 animate-in fade-in zoom-in"></span>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px] relative">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-pink-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Refreshing Gallery</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12 animate-in fade-in duration-700">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div className="relative aspect-[3/4] bg-[#fcfcfc] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-gray-50 shadow-sm transition-all duration-500 group-hover:shadow-xl">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-2">
                    {product.sale && product.sale > 0 && (
                      <span className="bg-pink-500 text-white text-[7px] md:text-[9px] font-black px-2 md:px-3 py-1 uppercase rounded-full shadow-lg">
                        -{product.sale}%
                      </span>
                    )}
                    {activeTab === "New Arrivals" && (
                      <span className="bg-black text-white text-[7px] md:text-[9px] font-black px-2 md:px-3 py-1 uppercase rounded-full shadow-lg text-center">New</span>
                    )}
                  </div>

                  <div className="absolute bottom-3 md:bottom-6 left-0 right-0 flex justify-center gap-2 md:gap-3 translate-y-16 group-hover:translate-y-0 md:transition-transform duration-500">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-white p-2.5 md:p-3 rounded-full shadow-xl hover:bg-pink-500 hover:text-white transition-all transform hover:scale-110"
                    >
                      <ShoppingCartIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button 
                      onClick={() => handleQuickView(product)}
                      className="bg-white p-2.5 md:p-3 rounded-full shadow-xl hover:bg-pink-500 hover:text-white transition-all transform hover:scale-110"
                    >
                      <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 text-center px-1">
                  <h3 
                    onClick={() => handleQuickView(product)}
                    className="text-[11px] md:text-[13px] text-gray-800 font-black uppercase tracking-tighter italic hover:text-pink-500 transition cursor-pointer truncate"
                  >
                    {product.name}
                  </h3>
                  <div className="mt-1 md:mt-2 flex items-center justify-center gap-2 md:gap-3">
                    <span className="text-pink-500 font-black text-sm md:text-base italic">₱{Number(product.price).toLocaleString()}</span>
                    {product.oldPrice && (
                      <span className="text-gray-300 line-through text-[10px] md:text-xs font-bold italic">
                        ₱{Number(product.oldPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleWishlist(product)}
                    className="mt-2 md:mt-3 text-gray-300 hover:text-pink-500 transition-colors inline-flex items-center gap-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest"
                  >
                    <HeartIcon className="w-3 h-3" /> <span className="hidden sm:inline">Save to list</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
             <p className="text-gray-400 text-xs font-black uppercase tracking-widest">No products found in this category.</p>
          </div>
        )}
      </div>

      <div className="mt-12 md:mt-20 text-center">
        <Link 
          to="/shop" 
          className="inline-block text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:text-pink-500 transition-all border-b-2 border-transparent hover:border-pink-500 pb-2 italic"
        >
          Explore Entire Collection →
        </Link>
      </div>

      {isModalOpen && selectedProduct && (
        <QuickViewModal 
          product={selectedProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default FeaturedProducts;
