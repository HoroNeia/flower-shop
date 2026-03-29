import React, { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  HeartIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  Bars3Icon, 
  XMarkIcon,  
} from "@heroicons/react/24/outline";
import { Heart, CheckCircle2 } from "lucide-react"; 
import { Link, useNavigate } from let x=1000;

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";


import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

type MenuItem = {
  name: string;
  path: string;
};

const menuItems: MenuItem[] = [
  { name: "Daily Deals", path: "/home-new" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems, totalItems } = useCart();
  const { wishlistCount } = useWishlist();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ displayName: string | null; photoURL: string | null } | null>(null);

  const [showCartToast, setShowCartToast] = useState(false);
  const cartToastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const wishlistToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const subtotal = (cartItems || []).reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setAvatarMenuOpen(false);
    navigate("/login");
  };

  const refreshUser = () => {
    const auth = getAuth();
    if (auth.currentUser) {
      setCurrentUser({
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
      });
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        if (user.email === "admin1@gmail.com") setIsAdmin(true);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/shop?q=${encodeURIComponent(localSearch.trim())}`);
      setSearchOpen(false);
      setLocalSearch("");
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node))
        setSearchOpen(false);
      if (userRef.current && !userRef.current.contains(event.target as Node))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const openCartListener = () => {
      setCartOpen(true); 
      setTimeout(() => setCartOpen(false), 4000); 
      setShowCartToast(true);
      if (cartToastTimerRef.current) clearTimeout(cartToastTimerRef.current);
      cartToastTimerRef.current = setTimeout(() => setShowCartToast(false), 3000);
    };

    const wishlistListener = () => {
      setShowWishlistToast(true);
      if (wishlistToastTimerRef.current) clearTimeout(wishlistToastTimerRef.current);
      wishlistToastTimerRef.current = setTimeout(() => setShowWishlistToast(false), 3000);
    };

    const profileUpdateListener = () => refreshUser();

    window.addEventListener('open-mini-cart', openCartListener);
    window.addEventListener('show-wishlist-toast', wishlistListener);
    window.addEventListener('profile-updated', profileUpdateListener);
    
    return () => {
      window.removeEventListener('open-mini-cart', openCartListener);
      window.removeEventListener('show-wishlist-toast', wishlistListener);
      window.removeEventListener('profile-updated', profileUpdateListener);
    };
  }, []);

  return (
    <>
      <div className="w-full fixed top-4 left-0 z-[100] flex justify-center items-center mt-4 md:mt-10 px-4 md:px-8">
        <div
          className={`max-w-7xl w-full px-4 md:px-6 py-3 flex justify-between items-center transition-all duration-300
          ${scrolled ? "bg-black/80 text-white shadow-lg" : "bg-white/70 text-black shadow-sm"}
          rounded-full backdrop-blur-md border border-white/20`}
        >
          
          <button 
            className="lg:hidden p-2 hover:bg-pink-500/20 rounded-full transition"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          
          <Link to="/" className="text-xl md:text-3xl font-black hover:text-pink-500 transition tracking-tighter uppercase italic">
            Nesviera
          </Link>

          
          <div className="hidden lg:flex items-center space-x-8 text-sm font-black uppercase tracking-widest">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="px-3 py-1 rounded-md hover:text-pink-500 transition"
              >
                {item.name}
              </Link>
            ))}
          </div>

          
          <div className="flex items-center space-x-2 md:space-x-5">
            {isAdmin && (
              <Link to="/admin" title="Admin Dashboard">
                <ShieldCheckIcon className="w-6 h-6 text-pink-500 hover:scale-110 transition" />
              </Link>
            )}

            
            <div ref={searchRef} className="relative hidden sm:block">
              <button onClick={() => setSearchOpen((p) => !p)}>
                <MagnifyingGlassIcon className="w-6 h-6 hover:scale-110 transition" />
              </button>
              <div
                className={`absolute top-12 right-0 w-72 p-3 bg-white text-black shadow-2xl rounded-2xl border border-gray-100 transition-all
                ${searchOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                    <Input 
                      placeholder="Search flowers..." 
                      value={localSearch} 
                      onChange={(e) => setLocalSearch(e.target.value)} 
                      className="border-none bg-transparent focus-visible:ring-0 text-xs font-bold"
                    />
                    <Button type="submit" size="sm" className="bg-pink-500 hover:bg-black rounded-lg h-8">Go</Button>
                  </div>
                </form>
              </div>
            </div>

            
            {!currentUser && (
              <div ref={userRef} className="relative hidden sm:block">
                <button onClick={() => setUserMenuOpen((p) => !p)}>
                  <UserIcon className="w-6 h-6 hover:scale-110 transition" />
                </button>
                <div
                  className={`absolute right-0 mt-4 w-44 bg-white text-black border border-gray-100 rounded-2xl shadow-2xl transition-all
                  ${userMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"}`}
                >
                  <div className="flex flex-col p-2 text-[10px] font-black uppercase tracking-widest">
                    <Link to="/login" className="px-4 py-3 hover:bg-pink-50 rounded-xl transition">Login</Link>
                    <Link to="/register" className="px-4 py-3 hover:bg-pink-50 rounded-xl transition">Register</Link>
                  </div>
                </div>
              </div>
            )}

            
            <Link to="/wishlist" className="relative group">
              <HeartIcon className="w-6 h-6 hover:scale-110 transition" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            
            <div
              className="relative"
              onMouseEnter={() => setCartOpen(true)}
              onMouseLeave={() => setCartOpen(false)}
            >
              <Link to="/cart" className="relative block group">
                <ShoppingCartIcon className="w-6 h-6 hover:scale-110 transition" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              
              <div
                className={`hidden lg:block absolute right-0 top-full pt-3 transition-all duration-300
                ${cartOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
              >
                <div className="w-80 bg-white text-black rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6 space-y-4">
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-4">Bag Items</h3>
                    {(cartItems || []).length === 0 ? (
                      <p className="text-[10px] font-bold text-gray-400 text-center py-8 uppercase tracking-widest">Your bag is empty</p>
                    ) : (
                      <div className="max-h-64 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-4 items-center group">
                            <img src={item.imageUrl} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={item.name} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-black uppercase truncate text-gray-800">{item.name}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Qty: {item.quantity}</p>
                              <p className="text-xs text-pink-500 font-black mt-1">
                                ₱{((Number(item.price) || 0) * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {(cartItems || []).length > 0 && (
                      <div className="pt-4 border-t border-gray-50">
                        <div className="flex justify-between items-end mb-6">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                          <span className="text-xl font-black text-gray-800 tracking-tighter">₱{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Link to="/cart" className="flex-1">
                            <Button variant="outline" className="w-full rounded-xl border-gray-200 text-[9px] font-black uppercase tracking-widest py-6 hover:bg-gray-50 transition">
                              View Bag
                            </Button>
                          </Link>
                          <Link to="/checkout" className="flex-1">
                            <Button className="w-full bg-pink-500 hover:bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest py-6 shadow-lg shadow-pink-100 transition">
                              Checkout
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            
            {currentUser && (
              <div className="relative ml-2 shrink-0" onMouseEnter={() => setAvatarMenuOpen(true)} onMouseLeave={() => setAvatarMenuOpen(false)}>
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 shadow-md">
                  <img
                    src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}&background=fbcfe8&color=be185d`}
                    alt="Profile"
                    className="w-8 h-8 md:w-11 md:h-11 rounded-full object-cover border-2 border-white"
                  />
                </div>
                <div className={`hidden lg:block absolute right-0 top-full pt-4 transition-all duration-300 ${avatarMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
                  <div className="w-48 bg-white text-black border border-gray-100 rounded-[1.5rem] shadow-2xl overflow-hidden p-2">
                    <div className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase border-b border-gray-50 mb-1 truncate tracking-widest">Hi, {currentUser.displayName?.split(" ")[0] || "User"}!</div>
                    <Link to="/my-account" className="block px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-pink-50 hover:text-pink-600 rounded-xl transition">My Account</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 rounded-xl transition">Log Out</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className={`fixed inset-0 z-[150] transition-all duration-500 ${isMobileMenuOpen ? "visible" : "invisible pointer-events-none"}`}>
         
         <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMobileMenuOpen(false)}
         />
         
         
         <div className={`absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-[#fff5f7] shadow-2xl transition-transform duration-500 flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="p-8 flex justify-between items-center border-b border-pink-100">
               <span className="text-2xl font-black italic uppercase tracking-tighter">Nesviera</span>
               <button onClick={() => setIsMobileMenuOpen(false)}>
                  <XMarkIcon className="w-7 h-7 text-pink-500" />
               </button>
            </div>

            <nav className="flex-1 p-8 space-y-6">
               {menuItems.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-3xl font-black italic uppercase tracking-tighter text-gray-800 hover:text-pink-500 transition-all"
                  >
                    {item.name}
                  </Link>
               ))}
               
               <div className="pt-8 border-t border-pink-100 space-y-4">
                  {!currentUser ? (
                    <>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black uppercase tracking-[0.2em] text-gray-400">Login</Link>
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black uppercase tracking-[0.2em] text-gray-400">Register</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/my-account" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-black uppercase tracking-[0.2em] text-gray-400">My Account</Link>
                      <button onClick={handleLogout} className="block text-sm font-black uppercase tracking-[0.2em] text-red-400">Log Out</button>
                    </>
                  )}
               </div>
            </nav>

            <div className="p-8 bg-white/50">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-300">Apalit • Pampanga • Philippines</p>
            </div>
         </div>
      </div>

      
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3">
        {showCartToast && (
          <div className="bg-[#1a1a1a] text-white shadow-2xl px-6 py-4 flex items-center gap-4 animate-in slide-in-from-left-10 fade-in duration-500 rounded-2xl border border-white/10">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-green-400">Success</p>
              <p className="text-xs font-bold">Added To Cart</p>
            </div>
          </div>
        )}
        {showWishlistToast && (
          <div className="bg-[#1a1a1a] text-white shadow-2xl px-6 py-4 flex items-center gap-4 animate-in slide-in-from-left-10 fade-in duration-500 rounded-2xl border border-white/10">
            <div className="bg-pink-500 p-1.5 rounded-lg">
              <Heart className="w-4 h-4 text-white fill-current" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-pink-400">Wishlist</p>
              <p className="text-xs font-bold">List Updated</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
