"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/app/types"; // Asegúrate de importar el tipo correcto

// --- INTERFAZ DE PROPS (La clave para arreglar el error) ---
interface OfferProductsProps {
  products: Product[];
}

// --- VARIANTS ---
const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%", 
    opacity: 0,
    scale: 0.85,
    rotateY: direction > 0 ? 20 : -20,
    zIndex: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.85,
    rotateY: direction < 0 ? 20 : -20,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.2 }
    }
  }),
};

const floatingImage: Variants = {
  animate: {
    y: [0, -10, 0],
    filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// --- COMPONENTE ---
const OfferProducts: React.FC<OfferProductsProps> = ({ products = [] }) => {
  const { addToCart } = useCart();
  
  // Estado para paginación y dirección
  const [[page, direction], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  // Función de paginación
  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  // Autoplay
  useEffect(() => {
    if (products.length <= 1 || paused) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [products.length, paused, paginate, page]); // Agregué 'page' a las dependencias para evitar cierres obsoletos

  // --- RENDERIZADO CONDICIONAL ---
  
  // Si no hay productos, mostramos un estado vacío o null
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <Sparkles className="w-10 h-10 mb-2 opacity-20" />
        <p>No hay ofertas disponibles en este momento.</p>
      </div>
    );
  }

  // Lógica para índice cíclico seguro
  const index = ((page % products.length) + products.length) % products.length;
  const product = products[index];
  
  // Validaciones seguras de precios (Si vienen como string en la DB)
  const price = Number(product.price) || 0;
  // Usamos el campo que venga del padre. Si ya viene calculado el discount, úsalo, si no, calcúlalo.
  // Nota: En HomeView pasamos un objeto que ya tenía 'discount', pero aquí re-calculamos por seguridad.
  const offerPrice = Number(product.offer_price) || 0;
  const discount = (product as any).discount || ((price > 0 && offerPrice > 0) ? Math.round(((price - offerPrice) / price) * 100) : 0);
  
  // Fallback de imagen
  const imageUrl = product.image_url && product.image_url.startsWith("http") 
    ? product.image_url 
    : `/assets/${product.product_category_id || product.category?.id}/${product.name}.png`;

  return (
    <section 
      className="relative w-full py-4 px-0 overflow-hidden" // Ajustado padding para encajar en modal
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* HEADER (Simplificado para el modal) */}
      <div className="relative z-10 w-full flex items-end justify-between mb-4 px-2">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <Sparkles className="text-yellow-400 w-4 h-4 animate-pulse" />
             <span className="text-orange-500 font-bold text-[10px] uppercase tracking-widest">Tiempo Limitado</span>
           </div>
           <h2 className="text-2xl font-black text-white italic tracking-tighter">
             MEGA <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">OFERTAS</span>
           </h2>
        </div>
        
        {/* Paginación minimalista (Dots) */}
        <div className="flex gap-1">
            {products.map((_, i) => (
                <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-orange-500' : 'w-1.5 bg-zinc-700'}`}
                />
            ))}
        </div>
      </div>

      {/* CAROUSEL STAGE */}
      <div className="relative w-full max-w-[280px] sm:max-w-sm mx-auto aspect-[3/4] perspective-1000">
        
        {/* Controles Flotantes */}
        <button 
          onClick={(e) => { e.stopPropagation(); paginate(-1); }} 
          className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-orange-600 hover:border-orange-500 transition-all backdrop-blur-sm"
        >
            <ChevronLeft size={20} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); paginate(1); }} 
          className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-orange-600 hover:border-orange-500 transition-all backdrop-blur-sm"
        >
            <ChevronRight size={20} />
        </button>

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) paginate(1);
              else if (swipe > 10000) paginate(-1);
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {/* --- TARJETA PRINCIPAL --- */}
            <div className="relative w-full h-full rounded-[2rem] bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-700/50 shadow-2xl shadow-black overflow-hidden group">
                
                {/* 1. BADGE FLOTANTE DE DESCUENTO */}
                {discount > 0 && (
                    <div className="absolute top-4 left-4 z-20">
                          <div className="relative">
                            <div className="absolute inset-0 bg-red-600 blur-md opacity-50 rounded-full" />
                            <div className="relative bg-gradient-to-br from-red-600 to-red-700 text-white font-black text-lg px-3 py-1 rounded-xl shadow-xl rotate-[-3deg] border border-red-400/30">
                                -{discount}%
                            </div>
                          </div>
                    </div>
                )}

                {/* 2. GLOW DETRÁS DEL PRODUCTO */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none" />

                {/* 3. IMAGEN DEL PRODUCTO */}
                <motion.div 
                    variants={floatingImage}
                    animate="animate"
                    className="absolute top-0 left-0 w-full h-[65%] z-10 flex items-center justify-center p-4"
                >
                    <div className="relative w-full h-full transform transition-transform duration-500 hover:scale-105">
                          <Image
                             src={imageUrl}
                             alt={product.name}
                             fill
                             className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                             sizes="(max-width: 768px) 100vw, 300px"
                             priority
                           />
                    </div>
                </motion.div>

                {/* 4. INFO PANEL */}
                <div className="absolute bottom-0 w-full h-[35%] bg-zinc-900/80 backdrop-blur-xl border-t border-white/5 z-20 flex flex-col justify-between p-5 rounded-t-[1.5rem]">
                    
                    <div>
                        <div className="flex justify-between items-start">
                             <span className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1 block">
                                 {product.category?.name || "Oferta"}
                             </span>
                             <div className="flex flex-col items-end">
                                 <span className="text-zinc-500 text-xs line-through font-medium">S/ {price.toFixed(2)}</span>
                                 <span className="text-2xl font-black text-white leading-none">S/ {offerPrice.toFixed(2)}</span>
                             </div>
                        </div>

                        <h3 className="text-white font-bold text-base leading-snug mt-1 line-clamp-2">
                            {product.name}
                        </h3>
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-white text-black hover:bg-orange-500 hover:text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg mt-2 group/btn"
                    >
                        <ShoppingCart size={18} className="group-hover/btn:-translate-y-0.5 group-hover/btn:rotate-[-10deg] transition-transform" />
                        <span>Lo quiero</span>
                    </button>
                </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default OfferProducts;