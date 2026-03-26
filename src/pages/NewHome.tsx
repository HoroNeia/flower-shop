import React, { useState, useEffect } from "react";
import Carousel from "../components/BloomsBaloonHero"; 
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Collections from "./Collections"; 
import { getProducts } from "@/services/productService";
import { Product } from "@/types/product";

const features = [
  { title: "Free Shipping", img: "https://cdn-icons-png.flaticon.com/512/66/66841.png" },
  { title: "Support 24/7", img: "https://cdn-icons-png.flaticon.com/512/3133/3133643.png" },
  { title: "Money Return", img: "https://cdn-icons-png.flaticon.com/512/1585/1585141.png" },
  { title: "Order Discount", img: "https://cdn-icons-png.flaticon.com/512/1138/1138038.png" }
];

const NewHome = () => {
  const [dailyDeals, setDailyDeals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDailyDeals = async () => {
      setIsLoading(true);
      try {
        const allProducts = await getProducts();
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        setDailyDeals(shuffled.slice(0, 8));
      } catch (error) {
        console.error("Failed to load daily deals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDailyDeals();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Carousel />

      <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 md:px-6">
        
        {/* 🌟 RESPONSIVE FEATURE ICONS: Compact on Mobile, Large on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-20 md:mb-40">
          {features.map((item, i) => (
            <div key={i} className="flex flex-col lg:flex-row items-center gap-3 md:gap-6 group text-center lg:text-left">
              
              {/* Responsive Container: w-12 (Mobile) -> w-24 (Desktop) */}
              <div className="w-12 h-12 md:w-24 md:h-24 bg-pink-50 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center group-hover:bg-pink-500 group-hover:rotate-12 transition-all duration-500 shadow-sm border border-pink-100/50">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  /* Responsive Icon: w-6 (Mobile) -> w-12 (Desktop) */
                  className="w-6 h-6 md:w-12 md:h-12 group-hover:brightness-0 group-hover:invert transition-all duration-500" 
                />
              </div>

              <div className="flex flex-col">
                <span className="font-black text-[9px] md:text-[11px] uppercase tracking-[0.25em] text-gray-800 group-hover:text-pink-500 transition-colors duration-300">
                  {item.title}
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 hidden md:block">
                  Nesviera Service
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* DAILY DEALS HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-pink-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.4em] mb-2 block italic">
            Curated For Today
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter uppercase italic leading-none">
            DAILY DEALS!
          </h2>
        </div>

        {/* Product Grid */}
        <div className="min-h-[300px] relative mb-24 md:mb-40">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-pink-500 mb-4" size={32} />
              <p className="text-pink-500 font-black uppercase tracking-widest text-[9px]">Refreshing Blooms...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16 animate-in fade-in duration-1000">
              {dailyDeals.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#fcfcfc] rounded-[1.5rem] md:rounded-[2rem] border border-gray-50 mb-4 md:mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    {product.sale ? (
                      <span className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-[#1a1a1a] text-white text-[7px] md:text-[9px] font-black px-2 md:px-3 py-1 uppercase rounded-full shadow-lg">
                        -{product.sale}%
                      </span>
                    ) : null}
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </div>
                  <div className="text-center px-1">
                    <h3 className="text-[10px] md:text-[12px] font-black text-gray-800 uppercase tracking-tighter italic group-hover:text-pink-500 transition truncate leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-pink-500 font-black text-sm tracking-tight italic mt-1 md:mt-2">
                        ₱{Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INTEGRATED COLLECTIONS */}
        <div className="border-t border-gray-50 pt-16 md:pt-24">
            <Collections />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewHome;