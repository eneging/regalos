"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PackagePlus, ShoppingCart, AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getCombos } from "@/services/products";
// 👇 IMPORTANTE: Importa el tipo Product global, NO lo definas aquí.
// Esto asegura que sea compatible con tu carrito de compras.
import type { Product } from "@/app/types"; 

const CombosPage = () => {
  const { addToCart } = useCart();
  
  // 👇 SOLUCIÓN: Tipado explícito de los estados (Generics)
  const [combos, setCombos] = useState<Product[]>([]); // Decimos: "Esto será un array de Productos"
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Decimos: "Esto puede ser texto o null"

  useEffect(() => {
    const loadCombos = async () => {
      try {
        setLoading(true);
        const data = await getCombos();
        
        // Conversión de seguridad: Si la API devuelve el precio como string, lo pasamos a number
        // para cumplir con la interfaz Product
        const cleanData: Product[] = (Array.isArray(data) ? data : []).map((item: any) => ({
            ...item,
            price: Number(item.price) || 0,
            offer_price: item.offer_price ? Number(item.offer_price) : null,
            // Aseguramos que category no rompa si viene null
            category: item.category || null 
        }));

        setCombos(cleanData);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los combos.");
      } finally {
        setLoading(false);
      }
    };

    loadCombos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p>Cargando combos especiales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-4 flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-900 rounded-xl justify-center">
        <AlertCircle size={20} /> {error}
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
        <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-full border border-zinc-700">
            {combos.length} Disponibles
        </span>
      </div>

      {combos.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
           No hay combos disponibles por el momento.
        </div>
      ) : (
        /* GRID DE PRODUCTOS */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {combos.map((product) => {
                 /* Como estamos usando el tipo estricto Product, 
                    TypeScript podría quejarse si 'category' no existe en la interfaz.
                    Usamos 'any' temporalmente en el acceso o el operador ?. 
                 */
           
                 
               

                return (
                    <div
                        key={product.id}
                        className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500 transition-all duration-300 group shadow-lg hover:shadow-orange-500/10"
                    >
                        <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wider">
                            COMBO
                        </span>

                        <div className="relative h-48 bg-zinc-950 overflow-hidden">
                            <Image
                                src={`/assets/${product.category.id}/${product.name}.png`}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 768px) 50vw, 200px"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'; 
                                }}
                            />
                        </div>

                        <div className="p-4 flex flex-col gap-3">
                            <h3 className="text-sm font-semibold text-white line-clamp-2 h-10 leading-tight" title={product.name}>
                                {product.name}
                            </h3>

                            <div className="flex items-end justify-between mt-1">
                                <div className="flex flex-col">
                                    <span className="text-xs text-zinc-400">Precio</span>
                                    <span className="text-lg font-bold text-white">
                                        S/ {Number(product.price).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => addToCart(product)}
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                            >
                                <ShoppingCart size={16} />
                                Agregar
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
      )}
    </main>
  );
};

export default CombosPage;