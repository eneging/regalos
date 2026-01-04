"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/app/types";
import { useCart } from "@/app/context/CartContext";

interface StoreGridProps {
  products: Product[];
  loading?: boolean;
}

export default function StoreGrid({
  products = [],
  loading = false,
}: StoreGridProps) {
  const { addToCart } = useCart();

  // ---------------------------
  // Skeleton Loader
  // ---------------------------
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[#121212] rounded-2xl p-4 border border-white/5"
          >
            <div className="aspect-[3/4] bg-white/10 rounded-xl mb-4" />
            <div className="h-4 bg-white/10 rounded mb-2" />
            <div className="h-4 w-1/2 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // ---------------------------
  // Empty State
  // ---------------------------
  if (!products.length) {
    return (
      <div className="py-20 text-center bg-white/5 rounded-2xl border border-white/10">
        <p className="text-gray-400 text-lg">
          No hay productos disponibles 😢
        </p>
      </div>
    );
  }

  // ---------------------------
  // Grid
  // ---------------------------
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative bg-[#121212] rounded-2xl p-4 border border-white/5 hover:border-amber-500/40 transition-all"
        >
          {/* Oferta badge */}
          {product.is_offer ? (
            <span className="absolute top-3 left-3 z-10 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              OFERTA
            </span>
          ) : null}

          {/* Imagen */}
          <Link href={`/producto/${product.slug}`}>
            <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden rounded-xl bg-black/20">
              <Image
                src={
                  product.image_url ||
                  "https://res.cloudinary.com/dck9uinqa/image/upload/v1760996469/depositphotos_110689618-stock-photo-bottles-of-several-whiskey-brands_kbuky1.jpg"
                }
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Add to cart */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="absolute bottom-3 right-3 bg-amber-500 text-black p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-amber-400"
                title="Agregar al carrito"
              >
                <ShoppingCart size={18} />
              </button>
            </div>
          </Link>

          {/* Info */}
          <Link href={`/producto/${product.slug}`}>
            <h3 className="text-white font-medium truncate text-sm md:text-base hover:text-amber-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-2">
            <span className="text-amber-500 font-bold text-lg">
              S/ {product.price}
            </span>

            {product.stock <= 0 && (
              <span className="text-xs text-red-400 font-semibold">
                Agotado
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
