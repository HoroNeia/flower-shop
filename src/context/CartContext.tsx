import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../types/product";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[]; 
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  isInCart: (productId: string) => CartItem | undefined;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number; // 🌟 Added for easier UI access
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // 🌟 LOGIC PRESERVATION + PERSISTENCE: Initialize from LocalStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("nesviera_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // 🌟 AUTO-SAVE: Keep localStorage in sync whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("nesviera_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => String(item.id) === String(product.id));
      if (existingItem) {
        return prevItems.map((item) =>
          String(item.id) === String(product.id) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) => {
      // If quantity is 0, we "hide" (remove) the item from the list
      if (quantity <= 0) return prevItems.filter((item) => String(item.id) !== String(productId));
      
      return prevItems.map((item) =>
        String(item.id) === String(productId) ? { ...item, quantity } : item
      );
    });
  };

  const isInCart = (productId: string) => {
    return cartItems.find((item) => String(item.id) === String(productId));
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => String(item.id) !== String(productId)));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("nesviera_cart");
  };

  // 🌟 DERIVED STATE: Keep the logic light by calculating these on the fly
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity,
        isInCart, 
        clearCart, 
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};