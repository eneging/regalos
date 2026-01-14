"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/types";
import { getProductsByCategory } from "@/services/products"; // 👇 Importamos el servicio específico

interface CategoryViewProps {
  initialProducts: Product[];
  slug: string;
}

export default function CategoryView({ initialProducts, slug }: CategoryViewProps) {
  // 1. ESTADO LOCAL: Iniciamos con lo que mandó el servidor (SSR)
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(false);

  // 2. EFECTO INTELIGENTE:
  // Si initialProducts viene vacío (navegación cliente) o cambia el slug,
  // buscamos los datos específicos en el backend.
  useEffect(() => {
    // Función para buscar datos si es necesario
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory(slug);
        
        // Solo actualizamos si obtuvimos datos válidos
        if (data && Array.isArray(data)) {
           // Conversión de seguridad por si el precio viene como string del servicio
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

    // LÓGICA DE DECISIÓN:
    // Opción A: Si 'initialProducts' tiene datos, los usamos (SSR rápido).
    // Opción B: Si está vacío, llamamos al backend.
    if (initialProducts.length > 0) {
        setProducts(initialProducts);
        setLoading(false);
    } else {
        fetchCategoryData();
    }
    
  }, [slug, initialProducts]); // Se ejecuta cuando cambia la categoría o los props

  const categoryTitle = slug.replace(/-/g, " ");

  return (
    <main className="bg-[#050505] min-h-screen text-white px-6 py-16">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold capitalize">
          {categoryTitle}
        </h1>
        <p className="text-gray-400 mt-2">
          {products.length} Productos disponibles
        </p>
      </div>

      {loading ? (
        /* ESTADO DE CARGA */
        <div className="flex flex-col justify-center items-center py-20 gap-4">
             <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
             <p className="text-zinc-500">Cargando productos...</p>
        </div>
      ) : (
        /* GRID DE PRODUCTOS */
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                categoryName={categoryTitle}
              />
            ))
          ) : (
            /* ESTADO VACÍO */
            <div className="col-span-full text-center text-gray-400 py-20 border border-zinc-800 rounded-2xl border-dashed bg-zinc-900/30">
              <p>No hay productos en esta categoría por el momento.</p>
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-14">
        <Link href="/" className="text-amber-500 hover:text-amber-400 font-bold transition-colors inline-flex items-center gap-2">
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}