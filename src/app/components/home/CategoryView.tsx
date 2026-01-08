"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import { useStoreData } from "@/app/hooks/useStoreData";
import { Product } from "@/app/types"; // Asegúrate de importar tu tipo Product

interface CategoryViewProps {
  initialProducts: Product[];
  slug: string;
}

export default function CategoryView({ initialProducts, slug }: CategoryViewProps) {
  // 1. Obtenemos TODOS los productos del store (Cliente)
  const { products: storeProducts, loading } = useStoreData();

  // 2. Filtramos los productos del store para quedarnos solo con los de esta categoría
  const categoryProductsFromStore = useMemo(() => {
    return storeProducts.filter(
      (p) => p.category?.slug === slug || p.product_category_id?.toString() === slug
      // Ajusta la condición según cómo venga tu objeto 'category' en el hook
    );
  }, [storeProducts, slug]);

  // 3. Decisión Inteligente:
  // Si el store ya cargó y tiene productos, usamos el store (más rápido/actualizado).
  // Si no, usamos los initialProducts que trajo el servidor (SSR/SEO).
  const productsToShow = !loading && categoryProductsFromStore.length > 0 
    ? categoryProductsFromStore 
    : initialProducts;

  const categoryTitle = slug.replace(/-/g, " ");

  return (
    <main className="bg-[#050505] min-h-screen text-white px-6 py-16">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold capitalize">
          {categoryTitle}
        </h1>
        <p className="text-gray-400 mt-2">
          Productos disponibles en esta categoría
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {productsToShow.length > 0 ? (
          productsToShow.map((product) => (
            <ProductCard 
                key={product.id}
                product={product}
                categoryName={categoryTitle}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-10 border border-zinc-800 rounded-2xl border-dashed">
            {loading ? "Cargando productos..." : "No hay productos en esta categoría"}
          </div>
        )}
      </div>

      <div className="text-center mt-14">
        <Link href="/" className="text-amber-500 hover:text-amber-400 font-bold transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}