"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Search, ShoppingCart, SlidersHorizontal, 
  Sparkles, Loader2, Beer, Wine, Martini, GlassWater
} from "lucide-react";
import { Product } from "@/services/types/product"; 
import { useCart } from "@/app/context/CartContext";

// --- UTILIDADES ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount);
};

// --- COMPONENTE PRINCIPAL ---
export default function StoreClient({ initialProducts }: { initialProducts: Product[] }) {
  const { addToCart } = useCart();
  
  // Estados de Filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortOption, setSortOption] = useState("relevance"); 
  
  // Estado para Scroll Infinito Automático
  const [visibleCount, setVisibleCount] = useState(24); 
  const PRODUCTS_INCREMENT = 24; // Cuantos más cargar al hacer scroll

  // Referencia para el detector de final de página
  const observerTarget = useRef(null);

  // 1. Extraer Categorías (Ordenadas)
  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map(p => p.category?.name).filter(Boolean));
    return ["Todos", ...Array.from(cats).sort()];
  }, [initialProducts]);

  // 2. Filtrado y Ordenamiento
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Búsqueda
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.category?.name?.toLowerCase().includes(lowerTerm)
      );
    }

    // Categoría
    if (selectedCategory !== "Todos") {
      result = result.filter(p => p.category?.name === selectedCategory);
    }

    // Ordenar
    if (sortOption === "low-high") {
      result.sort((a, b) => Number(a.offer_price || a.price) - Number(b.offer_price || b.price));
    } else if (sortOption === "high-low") {
      result.sort((a, b) => Number(b.offer_price || b.price) - Number(a.offer_price || a.price));
    }

    return result;
  }, [initialProducts, searchTerm, selectedCategory, sortOption]);

  // 3. Productos que se renderizan actualmente
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // 4. Lógica de "Intersection Observer" (Scroll Infinito)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // Si el usuario llega al final, cargamos más automáticamente
          setVisibleCount((prev) => prev + PRODUCTS_INCREMENT);
        }
      },
      { threshold: 0.1 } // Se activa cuando se ve el 10% del loader
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore]);

  // Resetear vista al cambiar filtros
  useEffect(() => {
    setVisibleCount(PRODUCTS_INCREMENT);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [searchTerm, selectedCategory, sortOption]);

  return (
    <div className="bg-zinc-950 min-h-screen pb-20 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* === HEADER (Sticky) === */}
      <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/80">
        
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-white tracking-tighter hidden md:block select-none">
            LA <span className="text-orange-500">CARTA</span>
          </h1>

          <div className="flex gap-3 w-full md:max-w-xl">
            {/* Buscador */}
            <div className="relative flex-1 group">
               <input 
                 type="text" 
                 placeholder="¿Qué tomamos hoy? (Whisky, Ron...)" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 text-white pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:border-orange-500 transition-all shadow-inner placeholder:text-zinc-600"
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-orange-500 transition-colors" size={20} />
            </div>
            
            {/* Ordenar */}
            <div className="relative min-w-[50px] md:min-w-[60px] bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none w-full h-full bg-transparent text-transparent rounded-2xl focus:outline-none cursor-pointer absolute inset-0 z-10"
              />
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                <SlidersHorizontal size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Pills (Scroll Horizontal sin scrollbar visible) */}
        <div className="border-t border-white/5 py-3 overflow-x-auto no-scrollbar touch-pan-x">
          <div className="max-w-7xl mx-auto px-4 flex gap-2 min-w-max pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border select-none ${
                  selectedCategory === cat 
                    ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105" 
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* === CONTENIDO === */}
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
        
        {/* Info Bar */}
        <div className="flex justify-between items-center mb-6 px-1">
           <span className="text-zinc-500 text-sm">
             <span className="text-white font-bold text-lg">{filteredProducts.length}</span> Productos encontrados
           </span>
           {selectedCategory !== "Todos" && (
             <span className="flex items-center gap-1.5 text-orange-500 font-bold text-sm bg-orange-500/10 px-3 py-1 rounded-full">
               <Sparkles size={14}/> {selectedCategory}
             </span>
           )}
        </div>

        {/* GRID DE PRODUCTOS */}
        {visibleProducts.length > 0 ? (
          <>
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ELEMENTO INVISIBLE TRIGGER PARA SCROLL INFINITO */}
            {hasMore && (
              <div 
                ref={observerTarget} 
                className="mt-12 w-full flex justify-center items-center py-8 opacity-50"
              >
                <Loader2 className="animate-spin text-orange-500" size={32} />
              </div>
            )}
            
            {/* Mensaje de final de lista */}
            {!hasMore && filteredProducts.length > 10 && (
                <div className="mt-16 text-center text-zinc-600 text-sm pb-8">
                    <p>Has visto todo el catálogo 🎉</p>
                </div>
            )}
          </>
        ) : (
          /* Estado Vacío */
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
             <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                <Martini size={40} className="text-zinc-600" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No encontramos nada</h3>
             <p className="text-zinc-500 max-w-xs mx-auto">Prueba buscando Cerveza, Ron o selecciona otra categoría.</p>
             <button 
               onClick={() => {setSearchTerm(""); setSelectedCategory("Todos");}}
               className="mt-6 px-6 py-2 bg-zinc-800 rounded-full text-white font-medium hover:bg-orange-500 transition-colors"
             >
               Ver todo
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUBCOMPONENTE CARD (Optimizada para Grid) ---
const ProductCard = ({ product, addToCart }: { product: Product, addToCart: any }) => {
  const price = Number(product.price) || 0;
  const offerPrice = Number(product.offer_price) || 0;
  const isOffer = (product.is_offer === 1 || product.is_offer === true) && offerPrice > 0 && offerPrice < price;
  
  const currentPrice = isOffer ? offerPrice : price;
  const discount = isOffer ? Math.round(((price - offerPrice) / price) * 100) : 0;

  const imageUrl = product.image_url 
    ? product.image_url
    : `/assets/${product.category.id}/${product.name}.png`; 

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group relative bg-zinc-900 rounded-[1.2rem] border border-zinc-800/60 overflow-hidden hover:border-orange-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between"
    >
      {/* Etiqueta Descuento */}
      {isOffer && discount > 0 && (
        <div className="absolute top-0 left-0 z-20 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-br-xl shadow-md">
          -{discount}%
        </div>
      )}

      {/* Imagen */}
      <div className="relative w-full aspect-[4/5] p-5 overflow-hidden bg-gradient-to-b from-zinc-800/20 to-transparent">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          
          loading="lazy"
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-contain group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500 drop-shadow-xl"
        />
        
        {/* Quick Add (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex justify-center bg-gradient-to-t from-black/60 to-transparent pt-8">
            <button 
                onClick={() => addToCart(product)}
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-6 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2 text-sm"
            >
                <ShoppingCart size={16} /> Agregar
            </button>
        </div>
      </div>

      {/* Información */}
      <div className="p-4 bg-zinc-900 relative z-10 flex flex-col flex-1 border-t border-white/5">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 truncate">
            {product.category?.name || "Bebida"}
          </p>
          <h3 className="text-white text-sm font-bold leading-tight mb-2 line-clamp-2 min-h-[2.5em] group-hover:text-orange-400 transition-colors">
            {product.name}
          </h3>
        </div>
        
        <div className="mt-2 flex items-end justify-between gap-2">
           <div className="flex flex-col">
              {isOffer && (
                <span className="text-[10px] text-zinc-500 line-through">
                  {formatCurrency(price)}
                </span>
              )}
              <span className="text-lg font-black text-white leading-none tracking-tight">
                {formatCurrency(currentPrice)}
              </span>
           </div>
           
           {/* Botón Móvil */}
           <button
             onClick={() => addToCart(product)}
             className="lg:hidden bg-zinc-800 active:bg-orange-500 text-white p-2.5 rounded-xl transition-colors"
           >
             <ShoppingCart size={18} />
           </button>
        </div>
      </div>
    </motion.div>
  );
};