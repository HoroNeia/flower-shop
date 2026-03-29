import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Plus, Minus } from "lucide-react"; 
import { useCart } from "@/context/useCart";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <PageHeader title="CART" />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 py-10 md:py-20 flex-1">
        {(!cartItems || cartItems.length === 0) ? (
          <div className="flex flex-col items-center justify-center text-center py-20 space-y-8 animate-in fade-in duration-700">
            <div className="bg-gray-50 p-10 rounded-full">
              <ShoppingCart className="w-20 h-20 md:w-32 md:h-32 text-gray-200 stroke-[1.5px]" />
            </div>
            <h2 className="text-xl font-medium text-gray-400 uppercase tracking-widest italic">Your basket is empty</h2>
            <Button 
              className="bg-[#1a1a1a] hover:bg-pink-500 text-white px-10 py-7 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl" 
              onClick={() => navigate("/shop")}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-12">
            <h2 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">Your Blooms ({cartItems.length})</h2>
            
            {/* DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.2em] font-black text-gray-400 border-b border-gray-100">
                    <th className="py-5 px-4 w-32">Bouquet</th>
                    <th className="py-5 px-4">Details</th>
                    <th className="py-5 px-4 text-center">Price</th>
                    <th className="py-5 px-4 text-center">Quantity</th>
                    <th className="py-5 px-4 text-center">Subtotal</th>
                    <th className="py-5 px-4 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="group transition-colors">
                      <td className="py-8 px-4">
                        <Link to={`/product/${item.id}`}>
                          <img src={item.imageUrl} alt={item.name} className="w-24 h-32 object-cover rounded-2xl shadow-sm border border-pink-50" />
                        </Link>
                      </td>
                      <td className="py-8 px-4">
                        <Link to={`/product/${item.id}`} className="hover:text-pink-500 font-black text-gray-800 uppercase tracking-tighter italic text-lg">
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-8 px-4 text-center font-bold text-gray-400">₱{Number(item.price).toLocaleString()}</td>
                      <td className="py-8 px-4 text-center">
                        <div className="inline-flex items-center border border-gray-100 rounded-xl bg-gray-50 p-1">
                          <button onClick={() => updateQuantity(String(item.id), (item.quantity || 1) - 1)} className="p-2 hover:text-pink-500"><Minus size={14} /></button>
                          <span className="px-4 text-xs font-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(String(item.id), (item.quantity || 1) + 1)} className="p-2 hover:text-pink-500"><Plus size={14} /></button>
                        </div>
                      </td>
                      <td className="py-8 px-4 text-center font-black text-pink-500 italic text-lg">
                        ₱{((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}
                      </td>
                      <td className="py-8 px-4 text-right">
                        <button onClick={() => removeFromCart(String(item.id))} className="p-3 text-gray-300 hover:text-red-500 transition-all">
                          <X className="w-5 h-5 ml-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE LIST */}
            <div className="lg:hidden space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-[#fcfcfc] rounded-[2rem] border border-gray-50">
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-32 object-cover rounded-2xl shrink-0" />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-gray-800 uppercase tracking-tighter italic leading-tight">{item.name}</h3>
                      <button onClick={() => removeFromCart(String(item.id))} className="text-gray-300"><X size={18} /></button>
                    </div>
                    <p className="text-xs font-bold text-gray-400">₱{Number(item.price).toLocaleString()}</p>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-gray-100 rounded-lg bg-white p-1">
                        <button onClick={() => updateQuantity(String(item.id), (item.quantity || 1) - 1)} className="p-1"><Minus size={12} /></button>
                        <span className="px-3 text-[10px] font-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(String(item.id), (item.quantity || 1) + 1)} className="p-1"><Plus size={12} /></button>
                      </div>
                      <p className="font-black text-pink-500 italic">₱{((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button onClick={() => navigate("/shop")} className="bg-gray-50 text-gray-800 hover:bg-[#1a1a1a] hover:text-white rounded-full px-8 py-6 text-[10px] font-black uppercase tracking-widest transition-all">
                Continue Shopping
              </Button>
              <Button onClick={clearCart} className="bg-white text-red-300 border border-red-50 hover:bg-red-500 hover:text-white rounded-full px-8 py-6 text-[10px] font-black uppercase tracking-widest transition-all">
                Empty Cart
              </Button>
            </div>

            {/* 🌟 FIXED: SUMMARY BOX CENTERED ON MOBILE, RIGHT ON DESKTOP */}
            <div className="flex justify-center lg:justify-end pt-10 border-t border-gray-100">
              <div className="w-[95%] sm:w-full max-w-md lg:w-96 bg-[#1a1a1a] p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-pink-100 text-white mx-auto lg:mx-0 animate-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-pink-500 mb-8 flex items-center gap-2">
                  <div className="w-6 h-[1px] bg-pink-500" /> Summary
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Subtotal</span>
                    <span>₱{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="h-[1px] bg-white/10 my-6" />
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Grand Total</span>
                    <span className="text-3xl font-black italic tracking-tighter">₱{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-pink-500 hover:bg-white hover:text-pink-500 text-white py-8 rounded-full uppercase text-[11px] font-black tracking-[0.2em] transition-all mt-10 shadow-lg"
                >
                  Checkout Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;