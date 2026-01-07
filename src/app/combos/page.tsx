"use client";

import React from "react";
import Image from "next/image";
import { PackagePlus, ShoppingCart, AlertCircle } from "lucide-react";
import { useStoreData } from "../hooks/useStoreData";
import { useCart } from "../context/CartContext";

const CombosPage = () => {
  const { products, categories, loading, error } = useStoreData();
  const { addToCart } = useCart();

  // 👉 COMBOS = productos cuyo nombre contiene "+"
  const comboProducts = products.filter(
    (p) => typeof p.name === "string" && p.name.includes("+")
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-64 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-4 flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-900 rounded-xl">
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  if (comboProducts.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-400">
        No hay combos disponibles
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-10">
        <PackagePlus className="text-orange-500 w-7 h-7" />
        <h1 className="text-3xl font-bold text-white">
          Combos Especiales
        </h1>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {comboProducts.map((product) => {
          const category = categories.find(
            (c) => c.id === product.product_category_id
          );

          const imageSrc =
            product.image_url && product.image_url.startsWith("http")
              ? product.image_url
              : `/assets/${product.category?.id}/${product.name}.png`;

          return (
            <div
              key={product.id}
              className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500 transition group"
            >
              {/* Badge COMBO */}
              <span className="absolute top-3 left-3 z-10 bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                COMBO
              </span>

              {/* Image */}
              <div className="relative h-40 bg-zinc-950">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
    sizes="(max-width: 768px) 50vw, 200px"
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2">
                <p className="text-xs text-orange-500 uppercase">
                  {category?.name || "Combo"}
                </p>

                <h3 className="text-sm font-semibold text-white line-clamp-3">
                  {product.name}
                </h3>

                <span className="text-lg font-bold text-white">
                  S/ {Number(product.price).toFixed(2)}
                </span>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingCart size={16} />
                  Agregar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default CombosPage;
