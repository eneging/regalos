"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Check, ImageOff } from "lucide-react";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: any;
  categoryName?: string;
}

const ProductCard = ({ product, categoryName }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  // UX: Estado para manejar si la imagen falla al cargar
  const [imgError, setImgError] = useState(false);

  // 1. LÓGICA DE PRECIOS SEGURA (Evita NaN)
  const price = Number(product.price) || 0;
  const offerPrice = Number(product.offer_price) || 0;
  
  // 2. CORRECCIÓN DEL "0": Convertimos is_offer a Booleano real (!!)
  // Verificamos que sea oferta, que el precio oferta sea menor, y que el descuento sea mayor a 0
  const hasValidOffer = Boolean(product.is_offer) && offerPrice < price && offerPrice > 0;

  const discount = hasValidOffer
    ? Math.round(((price - offerPrice) / price) * 100)
    : 0;

  const finalPrice = hasValidOffer ? offerPrice : price;

  // Lógica de URL de imagen inicial
  const initialImageSrc =
    product.image_url && product.image_url.startsWith("http")
      ? product.image_url
      : `/assets/${product.category?.id}/${product.name}.png`;

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-900/10 transition-all duration-300 flex flex-col h-full select-none">
      
      {/* 3. CORRECCIÓN VISUAL: Renderizado condicional estricto */}
      {hasValidOffer && discount > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          -{discount}%
        </span>
      )}

      <div className="relative h-48 bg-zinc-950 overflow-hidden flex items-center justify-center">
        {!imgError ? (
          <Image
            src={initialImageSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 200px"
            // UX: Si la imagen no carga, activamos el estado de error
            onError={() => setImgError(true)}
          />
        ) : (
          // UX: Fallback elegante si no hay imagen
          <div className="flex flex-col items-center justify-center text-zinc-700 gap-2">
            <ImageOff size={32} />
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
        
        {/* Gradiente sutil para mejorar lectura sobre imágenes claras */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-grow">
        <p className="text-xs font-medium text-orange-400 uppercase tracking-wide truncate">
          {categoryName || product.category?.name || "Producto"}
        </p>

        <h3 
            className="text-base font-bold text-white leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors"
            title={product.name} // UX: Tooltip nativo para nombres largos
        >
          {product.name}
        </h3>

        <div className="mt-auto pt-3 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {hasValidOffer && (
                <span className="text-xs text-zinc-500 line-through">
                S/ {price.toFixed(2)}
                </span>
            )}
            <span className="text-xl font-bold text-white">
              S/ {finalPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`
                relative overflow-hidden rounded-xl px-4 py-2.5 font-bold text-sm transition-all duration-300 flex items-center gap-2
                ${
                  isAdded
                    ? "bg-green-600 text-white scale-95"
                    : "bg-orange-600 text-white hover:bg-orange-500 hover:-translate-y-0.5 shadow-lg shadow-orange-900/20 active:scale-95"
                }
            `}
            aria-label={isAdded ? "Producto agregado" : "Agregar al carrito"}
          >
            {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;