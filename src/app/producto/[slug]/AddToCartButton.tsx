"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/app/types";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product, 1)}
      className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2"
    >
      <ShoppingCart className="w-5 h-5" />
      Añadir al carrito
    </button>
  );
}
