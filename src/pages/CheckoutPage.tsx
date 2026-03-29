import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, ShoppingBag, Loader2, ArrowLeft } from "lucide-react";

// Firebase & Context
import { useCart } from "@/context/useCart";
import { auth, db } from "@/firebase"; 
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, totalPrice } = useCart();

  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    orderNotes: ""
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // 🌟 AUTO-FILL LOGIC (Preserved)
  useEffect(() => {
    const fetchSavedInfo = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setBillingDetails((prev) => ({
              ...prev,
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              companyName: data.companyName || "",
              streetAddress: data.streetAddress || "",
              city: data.city || "",
              state: data.state || "",
              zip: data.zip || "",
              phone: data.phone || "",
              email: currentUser.email || "",
            }));
          } else {
            setBillingDetails((prev) => ({ ...prev, email: currentUser.email || "" }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchSavedInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlacingOrder(true);

    try {
      const orderData = {
        userId: auth.currentUser?.uid || "guest",
        customerInfo: billingDetails,
        items: cartItems,
        totalAmount: totalPrice,
        status: "Pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      clearCart();
      setIsPlacingOrder(false);
      setShowSuccessModal(true); 
      
    } catch (error) {
      console.error("Error placing order:", error);
      setIsPlacingOrder(false);
      alert("Something went wrong. Please try again.");
    }
  };

  // 🌟 EMPTY CART STATE
  if ((!cartItems || cartItems.length === 0) && !showSuccessModal) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar /><PageHeader title="Checkout" />
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-6">
          <div className="bg-gray-50 p-10 rounded-full">
            <ShoppingBag className="w-16 h-16 text-gray-200" />
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Your basket is currently empty.</p>
          <Button 
            onClick={() => navigate("/shop")} 
            className="bg-[#1a1a1a] hover:bg-pink-500 text-white px-12 py-7 rounded-full uppercase text-[10px] font-black tracking-[0.2em] transition-all"
          >
            Return to Gallery
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] font-sans">
      <Navbar />
      <PageHeader title="Checkout" />

      <main className="max-w-7xl w-full mx-auto px-4 md:px-6 py-10 md:py-20">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          
          {/* LEFT SIDE: BILLING DETAILS */}
          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
               <button type="button" onClick={() => navigate("/cart")} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
                 <ArrowLeft size={18} />
               </button>
               <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Billing Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">First Name</Label>
                <Input name="firstName" value={billingDetails.firstName} onChange={handleInputChange} required className="rounded-2xl border-gray-100 h-14 focus:ring-pink-500 bg-white shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Last Name</Label>
                <Input name="lastName" value={billingDetails.lastName} onChange={handleInputChange} required className="rounded-2xl border-gray-100 h-14 focus:ring-pink-500 bg-white shadow-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Street Address</Label>
              <Input name="streetAddress" value={billingDetails.streetAddress} onChange={handleInputChange} required placeholder="House number and street name" className="rounded-2xl border-gray-100 h-14 focus:ring-pink-500 bg-white shadow-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">City / Municipality</Label>
                <Input name="city" value={billingDetails.city} onChange={handleInputChange} required className="rounded-2xl border-gray-100 h-14 focus:ring-pink-500 bg-white shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Province / State</Label>
                <Input name="state" value={billingDetails.state} onChange={handleInputChange} required className="rounded-2xl border-gray-100 h-14 focus:ring-pink-500 bg-white shadow-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Phone Number</Label>
                <Input name="phone" value={billingDetails.phone} onChange={handleInputChange} required type="tel" className="rounded-2xl border-gray-100 h-14 focus:ring-pink-500 bg-white shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</Label>
                <Input name="email" value={billingDetails.email} onChange={handleInputChange} required type="email" className="rounded-2xl border-gray-100 h-14 focus:ring-pink-500 bg-white shadow-sm" />
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight italic">Delivery Notes</h2>
              <Textarea 
                name="orderNotes"
                value={billingDetails.orderNotes}
                onChange={handleInputChange}
                placeholder="Special instructions for our florists or delivery team." 
                className="rounded-2xl border-gray-100 min-h-[140px] focus:ring-pink-500 bg-white shadow-sm p-4 text-sm"
              />
            </div>
          </div>

          {/* RIGHT SIDE: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-[#1a1a1a] text-white p-8 md:p-10 sticky top-32 rounded-[2.5rem] shadow-2xl shadow-pink-100">
              <h2 className="text-xl font-black mb-8 text-pink-500 tracking-tighter uppercase italic flex items-center gap-3">
                <div className="w-6 h-[1px] bg-pink-500" /> Summary
              </h2>
              
              <div className="space-y-6 max-h-[30vh] overflow-y-auto no-scrollbar pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div className="flex-1 pr-4">
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-100">{item.name}</p>
                      <p className="text-[9px] text-gray-500 font-bold">QTY: {item.quantity}</p>
                    </div>
                    <span className="font-black text-sm italic">₱{(Number(item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Subtotal</span>
                  <span>₱{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Total Amount</span>
                  <span className="text-3xl font-black italic tracking-tighter text-white">₱{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isPlacingOrder}
                className="w-full bg-pink-500 hover:bg-white hover:text-pink-500 text-white py-8 rounded-full text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 mt-10 shadow-xl shadow-pink-500/20"
              >
                {isPlacingOrder ? (
                   <Loader2 className="animate-spin" />
                ) : "Place Order"}
              </Button>
            </div>
          </div>
        </form>
      </main>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100 text-white">
              <Check size={40} strokeWidth={4} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-3 uppercase tracking-tighter italic">Blooms Incoming!</h2>
            <p className="text-gray-500 text-xs mb-10 leading-relaxed font-bold uppercase tracking-[0.1em]">
              Your order has been received. Our florists are already hand-picking your selection.
            </p>
            <button 
              onClick={() => navigate("/")}
              className="w-full bg-[#1a1a1a] hover:bg-pink-500 text-white py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] transition-all duration-500"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CheckoutPage;