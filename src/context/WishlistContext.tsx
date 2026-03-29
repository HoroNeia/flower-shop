import React, { useState, useEffect, ReactNode } from "react";
import { Product } from "../types/product";
import { WishlistContext } from "./useWishlist";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  // 🌟 LOGIC PRESERVATION + PERSISTENCE: Initialize from LocalStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("nesviera_wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    }
    return [];
  });

  // 🌟 AUTO-SAVE: Keep localStorage in sync whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("nesviera_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Function to add or remove items
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      // 🌟 Robust Check: Ensure we compare IDs as strings to avoid type mismatches
      const exists = prev.find((item) => String(item.id) === String(product.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(product.id));
      }
      return [...prev, product];
    });
  };

  // Check if a specific product is favorited
  const isInWishlist = (productId: string | number) => 
    wishlist.some((item) => String(item.id) === String(productId));

  // Function to empty the entire wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("nesviera_wishlist");
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        toggleWishlist, 
        isInWishlist, 
        wishlistCount: wishlist.length,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};


