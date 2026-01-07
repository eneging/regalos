"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Product, CartItem } from "../../app/types";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiShoppingCart } from "react-icons/fi";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  
  // 1. Estado inicial vacío para evitar desajuste Server/Client
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 2. Cargar carrito solo en el cliente (Mount)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }
    setIsInitialized(true);
  }, []);

  // 3. Guardar en LocalStorage cada vez que el carrito cambie
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const playSound = () => {
    const audio = new Audio("/sounds/cheers.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    // 🔥 CORRECCIÓN DEL ERROR DE TIPADO:
    // Convertimos explícitamente a Number() por si la API devuelve strings ("150.00")
    const rawPrice =
      product.is_offer && product.offer_price
        ? product.offer_price
        : product.price;

    const finalPrice = Number(rawPrice);

    // Creamos una copia segura del producto con el precio numérico correcto
    const pricedProduct: Product = { 
        ...product, 
        price: finalPrice,
        // Aseguramos que offer_price también sea número si existe
        offer_price: product.offer_price ? Number(product.offer_price) : undefined
    };

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { product: pricedProduct, quantity }];
    });

    playSound();

    toast.success(
      <div className="flex flex-col text-left">
        <strong className="text-orange-400">{product.name}</strong>
        <span className="text-white text-sm">¡Se añadió al carrito!</span>
      </div>,
      {
        position: "bottom-right",
        icon: <FiShoppingCart className="text-orange-400 text-xl" />,
        style: {
          background: "linear-gradient(135deg, #1a1a1a 0%, #292929 100%)",
          border: "1px solid #ff8c42",
          borderRadius: "12px",
          boxShadow: "0 0 10px #ff8c4288",
          color: "#fff",
          padding: "12px 16px",
        },
        autoClose: 2000,
        transition: Slide,
      }
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    // Evitar cantidades negativas o cero
    if (quantity < 1) return;
    
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
      <ToastContainer
        limit={3}
        newestOnTop
        pauseOnHover={false}
        closeOnClick
        draggable={false}
        theme="dark" // Añadido para asegurar consistencia
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};