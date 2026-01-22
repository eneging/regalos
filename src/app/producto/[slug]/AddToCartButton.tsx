"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { Minus, Plus, ShoppingBag, Loader2, Check } from "lucide-react";
import { toast } from "sonner"; // O tu librería de notificaciones
import { Product } from "@/app/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  // Determinar stock
  const stock = Number(product.stock) || 0;
  const isOutOfStock = stock <= 0;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    
    setLoading(true);
    
    // Simulamos un pequeño delay para feedback visual
    await new Promise(resolve => setTimeout(resolve, 600));

    addToCart(product, quantity);
    
    setLoading(false);
    setAdded(true);
    
    // Resetear el estado de "Agregado" después de 2 segundos
    setTimeout(() => setAdded(false), 2000);
    
    toast.success(`Agregaste ${quantity} ${product.name} al carrito 🎁`);
  };

  return (
    <div className="flex gap-4 w-full h-full">
      {/* SELECTOR DE CANTIDAD */}
      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-2 h-full">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1 || isOutOfStock}
          className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={18} />
        </button>
        
        <span className="w-10 text-center font-bold text-white tabular-nums">
          {quantity}
        </span>

        <button
          onClick={handleIncrease}
          disabled={quantity >= stock || isOutOfStock}
          className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* BOTÓN AGREGAR */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || loading || added}
        className={`
          flex-1 h-full rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-300 transform active:scale-[0.98]
          ${isOutOfStock 
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
            : added
              ? "bg-green-600 shadow-green-900/20"
              : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-900/20"
          }
        `}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : added ? (
          <>
            <Check size={20} />
            <span>¡Listo!</span>
          </>
        ) : isOutOfStock ? (
          <span>Sin Stock</span>
        ) : (
          <>
            <ShoppingBag size={20} />
            <span>Agregar al Carrito</span>
          </>
        )}
      </button>
    </div>
  );
}