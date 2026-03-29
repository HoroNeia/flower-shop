import React from "react";
import { useWishlist } from "@/context/useWishlist";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/common/PageHeader";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <PageHeader title="WISHLIST" />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-12 md:py-20">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 space-y-8 animate-in fade-in duration-700">
            <div className="bg-gray-50 p-10 rounded-full">
              <HeartIcon className="w-20 h-20 md:w-32 md:h-32 text-gray-200 stroke-[1px]" />
            </div>
            
            <h2 className="text-xl font-medium text-gray-400 uppercase tracking-widest italic">
              Your wishlist is empty
            </h2>

            <Button
              className="bg-[#1a1a1a] hover:bg-pink-500 text-white px-10 py-7 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl"
              onClick={() => navigate("/shop")}
            >
              Add Some Blooms
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            <h2 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">
              Saved Arrangements ({wishlist.length})
            </h2>
            
            {/* 🌟 DESKTOP TABLE: Hidden on mobile */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.2em] font-black text-gray-400 border-b border-gray-100">
                    <th className="py-5 px-4 w-32">Bouquet</th>
                    <th className="py-5 px-4">Product Name</th>
                    <th className="py-5 px-4 text-center">Unit Price</th>
                    <th className="py-5 px-4 text-center">Purchase</th>
                    <th className="py-5 px-4 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {wishlist.map((product) => (
                    <tr key={product.id} className="group transition-colors">
                      <td className="py-8 px-4">
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-24 h-32 object-cover rounded-2xl shadow-sm border border-pink-50"
                          />
                        </Link>
                      </td>
                      <td className="py-8 px-4">
                        <Link 
                          to={`/product/${product.id}`} 
                          className="hover:text-pink-500 font-black text-gray-800 uppercase tracking-tighter italic text-lg transition-colors"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="py-8 px-4 text-center">
                        <div className="flex flex-col items-center">
                           {product.oldPrice && (
                             <span className="text-gray-300 line-through text-xs font-bold mb-1 italic">
                               ₱{product.oldPrice.toLocaleString()}
                             </span>
                           )}
                           <span className="font-black text-gray-700 text-lg italic">
                             ₱{product.price.toLocaleString()}
                           </span>
                        </div>
                      </td>
                      <td className="py-8 px-4 text-center">
                        <Button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="bg-[#1a1a1a] hover:bg-pink-500 text-white px-8 py-5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic"
                        >
                          Select Option
                        </Button>
                      </td>
                      <td className="py-8 px-4 text-right">
                        <button
                          onClick={() => {
                            toggleWishlist(product);
                            window.dispatchEvent(new Event('show-wishlist-toast'));
                          }}
                          className="p-3 text-gray-300 hover:text-red-500 transition-all"
                        >
                          <XMarkIcon className="w-6 h-6 ml-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 MOBILE CARDS: Hidden on desktop */}
            <div className="lg:hidden grid grid-cols-1 gap-6">
              {wishlist.map((product) => (
                <div key={product.id} className="flex gap-4 p-4 bg-[#fcfcfc] rounded-[2rem] border border-gray-50">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-24 h-32 object-cover rounded-2xl shrink-0" 
                  />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-gray-800 uppercase tracking-tighter italic leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-pink-500 font-black italic text-sm mt-1">
                          ₱{product.price.toLocaleString()}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleWishlist(product)} 
                        className="text-gray-300 p-1"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <Button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest italic"
                    >
                      <ShoppingBag size={12} className="mr-2" /> View Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center md:justify-start pt-10 border-t border-gray-100">
               <Link 
                  to="/shop" 
                  className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-pink-500 transition-all border-b-2 border-transparent hover:border-pink-500 pb-2 italic"
                >
                  Continue Shopping →
               </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;