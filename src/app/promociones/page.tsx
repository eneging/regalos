"use client";

import React from "react";
import { Sparkles, AlertCircle } from "lucide-react"; // Cambiado Tag por Sparkles
import { useStoreData } from "../hooks/useStoreData";
import ProductCard from "../components/ProductCard"; // Importamos el componente reutilizable

const PromocionesPage = () => {
  const { products, categories, loading, error } = useStoreData();

  // Filtramos solo ofertas reales
  const offerProducts = products.filter((p) => 
    Boolean(p.is_offer) && Number(p.offer_price) > 0 && Number(p.offer_price) < Number(p.price)
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-80 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-4 flex items-center gap-2 text-rose-400 bg-rose-950/30 border border-rose-900 rounded-xl">
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  if (offerProducts.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-400 flex flex-col items-center">
        <Sparkles size={48} className="text-zinc-600 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">Sin sorpresas por ahora</h2>
        <p>No hay promociones activas en este momento. ¡Vuelve pronto!</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-10 border-b border-white/5 pb-8">
        <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
             <Sparkles className="text-rose-500 w-8 h-8 animate-pulse" />
        </div>
        <div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
            Ofertas Especiales
            </h1>
            <p className="text-zinc-400 mt-1">
                Detalles inolvidables a precios increíbles.
            </p>
        </div>
      </div>

      {/* GRID */}
      {/* Usamos el mismo grid responsive que en HomeView para consistencia */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {offerProducts.map((product) => {
          // Buscamos la categoría para pasar el nombre correcto
          const category = categories.find(
            (c) => c.id === product.product_category_id
          );

          return (
            <ProductCard 
                key={product.id} 
                product={product} 
                categoryName={category?.name} 
            />
          );
        })}
      </div>
    </main>
  );
};

export default PromocionesPage;