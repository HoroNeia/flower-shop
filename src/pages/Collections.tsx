import React, { useState, useEffect } from "react";
import { Loader2, TrendingUp, Cross, ChevronRight } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

// Services and Types
import { getProducts } from "@/services/productService";
import { Product } from "@/types/product";

const Collections = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setAllProducts(data);
      } catch (error) {
        console.error("Failed to load collections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getTopSalesToday = () => {
    return allProducts
      .filter(p => p.category && (p.sale || 0) > 0)
      .sort((a, b) => (b.sale || 0) - (a.sale || 0));
  };

  const getFuneralFlowers = () => {
    return allProducts
      .filter((p) => p.category && p.category.toLowerCase() === "funeral flowers");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="animate-spin text-pink-500" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Curating Collections</p>
      </div>
    );
  }

  return (
    <div className="space-y-24 md:space-y-40 pb-20">
      {/* SECTION 1: BEST SELLER */}
      <CollectionSection 
        title="Best Seller & Top Sales Today" 
        subtitle="Hot Deals"
        tagColor="bg-black"
        icon={<TrendingUp size={18} className="text-pink-500" />}
        products={getTopSalesToday()}
        onViewAll={() => navigate("/shop?onSale=true")}
        navigate={navigate} // 🌟 Passed navigate here
      />

      {/* SECTION 2: FUNERAL FLOWERS */}
      <CollectionSection 
        title="Funeral Flowers Option" 
        subtitle="Sympathy & Remembrance"
        tagColor="bg-pink-500"
        icon={<Cross size={18} className="text-pink-500" />}
        products={getFuneralFlowers()}
        onViewAll={() => navigate("/shop?category=Funeral Flowers")}
        navigate={navigate} // 🌟 Passed navigate here
      />
    </div>
  );
};

interface CollectionSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: Product[];
  tagColor: string;
  onViewAll: () => void;
  navigate: ReturnType<typeof useNavigate>;
}

const CollectionSection = ({ title, subtitle, icon, products, tagColor, onViewAll, navigate }: CollectionSectionProps) => {
  if (products.length === 0) return null;

  const visibleProducts = products.slice(0, 12); 

  return (
    <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 px-4 md:px-0">
      <div className="text-center mb-12 md:mb-20">
        <div className="flex items-center justify-center gap-3 mb-4">
            {icon}
            <span className="text-pink-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] block italic">{subtitle}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-gray-800 uppercase tracking-tighter italic leading-[1.1] mb-6 max-w-2xl mx-auto">{title}</h2>
        <button onClick={onViewAll} className="group text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 transition-all flex items-center gap-2 mx-auto border-b border-transparent hover:border-pink-500 pb-1">
          Explore Set <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-20">
        {visibleProducts.map((item: Product, index: number) => (
          <div 
            key={item.id} 
            // 🌟 Added Navigation on Click
            onClick={() => navigate(`/product/${item.id}`)}
            className={`group cursor-pointer ${index >= 4 ? 'hidden md:block' : 'block'}`}
          >
             <div className="relative aspect-[3/4] overflow-hidden bg-[#fcfcfc] rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 mb-4 md:mb-6 shadow-sm group-hover:shadow-xl transition-all duration-700">
               {item.sale ? (
                    <span className={`absolute top-3 left-3 md:top-4 md:left-4 z-10 text-white text-[7px] md:text-[9px] font-black px-2 md:px-3 py-1 uppercase rounded-full shadow-lg ${tagColor}`}>-{item.sale}%</span>
               ) : (
                    <span className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-pink-500 text-white text-[7px] md:text-[9px] font-black px-2 md:px-3 py-1 uppercase rounded-full shadow-lg">NEW</span>
               )}
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
             <div className="text-center px-1">
                <h3 className="text-[10px] md:text-[12px] font-black text-gray-800 uppercase tracking-tighter italic group-hover:text-pink-500 transition truncate leading-tight">{item.name}</h3>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2 md:mt-3">
                    <p className="text-pink-500 font-black text-xs md:text-sm tracking-tight italic">₱{Number(item.price).toLocaleString()}</p>
                    {item.oldPrice && <p className="text-gray-300 font-bold text-[9px] md:text-xs line-through italic">₱{Number(item.oldPrice).toLocaleString()}</p>}
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* MOBILE ONLY: View All Button */}
      <div className="mt-12 md:hidden flex justify-center">
         <button 
           onClick={onViewAll}
           className="w-full py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 active:bg-pink-50 active:text-pink-500 transition-colors"
         >
           Show More {title.split(' ')[0]}
         </button>
      </div>
    </section>
  );
};

export default Collections;