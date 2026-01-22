"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Gift, ArrowLeft } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/types";
import { getProductsByCategory } from "@/services/products";

// 1. Definimos slug como opcional (?) para evitar conflictos de tipos
interface CategoryViewProps {
  initialProducts: Product[];
  slug?: string; 
}

export default function CategoryView({ initialProducts, slug }: CategoryViewProps) {
  // 2. ESTADO
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(false);

  // 3. PROTECCIÓN CRÍTICA PARA EL ERROR (Fix del .replace)
  // Si slug es undefined, usamos un string vacío "".
  const safeSlug = slug || ""; 
  const categoryTitle = safeSlug ? safeSlug.replace(/-/g, " ") : "Catálogo";

  useEffect(() => {
    // Si ya tenemos productos iniciales, no hacemos fetch
    if (initialProducts && initialProducts.length > 0) {
        setProducts(initialProducts);
        setLoading(false);
        return;
    }

    const fetchCategoryData = async () => {
      // Si no hay slug válido, no intentamos buscar
      if (!safeSlug) return;

      try {
        setLoading(true);
        const data = await getProductsByCategory(safeSlug);
        
        if (data && Array.isArray(data)) {
           const cleanData = data.map((p: any) => ({
             ...p,
             price: Number(p.price) || 0,
             offer_price: p.offer_price ? Number(p.offer_price) : null,
           }));
           setProducts(cleanData);
        }
      } catch (error) {
        console.error("Error al cargar categoría:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
    
  }, [safeSlug, initialProducts]); 

  return (
    <main className="bg-[#050505] min-h-screen text-white px-6 py-16">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-500/10 rounded-full">
                <Gift className="text-rose-500 w-6 h-6" />
            </div>
            <span className="text-rose-400 font-bold tracking-widest text-xs uppercase">Colección</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold capitalize text-white">
          {categoryTitle}
        </h1>
        
        <p className="text-zinc-400 mt-2 text-sm flex items-center gap-2">
           <span className="text-white font-bold">{products.length}</span> resultados encontrados
        </p>
      </div>

      {loading ? (
        /* LOADING STATE */
        <div className="flex flex-col justify-center items-center py-20 gap-4">
             <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
             <p className="text-zinc-500 animate-pulse">Buscando regalos...</p>
        </div>
      ) : (
        /* PRODUCT GRID */
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                categoryName={categoryTitle}
              />
            ))
          ) : (
            /* EMPTY STATE */
            <div className="col-span-full flex flex-col items-center justify-center text-zinc-500 py-24 border border-zinc-800 rounded-3xl border-dashed bg-zinc-900/30">
              <Gift size={48} className="mb-4 opacity-20" />
              <p>No hay productos disponibles aquí.</p>
            </div>
          )}
        </div>
      )}

      {/* FOOTER LINK */}
      <div className="text-center mt-20">
        <Link 
            href="/" 
            className="group text-zinc-400 hover:text-rose-500 font-bold transition-colors inline-flex items-center gap-2 px-6 py-3 rounded-full hover:bg-rose-500/10"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}