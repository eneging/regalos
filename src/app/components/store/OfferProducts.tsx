"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingCart, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { getOffers } from "@/services/products"; 
import { Product } from "@/services/types/product";

// --- VARIANTS CON TIPADO CORREGIDO ---
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
      type: "spring", // TypeScript ahora reconoce esto correctamente
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

// Animación de "Flotar" para la imagen activa
const floatingImage: Variants = {
  animate: {
    y: [0, -10, 0],
    filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" // TypeScript ahora reconoce esto correctamente
    }
  }
};

const OfferProducts: React.FC = () => {
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  
  // Estado para paginación y dirección
  const [[page, direction], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  // Carga de datos
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await getOffers();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Función de paginación
  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  // Autoplay
  useEffect(() => {
    if (products.length <= 1 || paused) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [products.length, paused, paginate]);

  // --- RENDERIZADO CONDICIONAL ---

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto py-12 px-4">
        <div className="aspect-[4/5] w-full bg-zinc-900 rounded-[2.5rem] animate-pulse border border-zinc-800 flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 bg-zinc-800 rounded-full animate-pulse" />
            <div className="flex items-center gap-2 text-orange-500">
               <Loader2 className="animate-spin" />
               <span className="text-sm font-medium">Buscando las mejores ofertas...</span>
            </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) return null;

  // Lógica para índice cíclico seguro (funciona hacia atrás y adelante infinitamente)
  const index = ((page % products.length) + products.length) % products.length;
  const product = products[index];
  
  // Validaciones seguras de precios
  const price = Number(product.price) || 0;
  const offerPrice = Number(product.offer_price) || 0;
  const discount = (price > 0 && offerPrice > 0) ? Math.round(((price - offerPrice) / price) * 100) : 0;
  
  // Fallback de imagen
  const imageUrl = product.image_url || `/assets/${product.category?.id}/${product.name}.png`;

  return (
    <section 
      className="relative w-full py-10 px-4 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Fondo Decorativo Sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto flex items-end justify-between mb-8 px-2 md:px-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <Sparkles className="text-yellow-400 w-5 h-5 animate-pulse" />
             <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">Tiempo Limitado</span>
           </div>
           <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">
             MEGA <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">OFERTAS</span>
           </h2>
        </div>
        
        {/* Paginación minimalista (Dots) */}
        <div className="flex gap-1.5">
            {products.map((_, i) => (
                <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-orange-500' : 'w-2 bg-zinc-700'}`}
                />
            ))}
        </div>
      </div>

      {/* CAROUSEL STAGE */}
      <div className="relative w-full max-w-sm md:max-w-md mx-auto aspect-[3/4] md:aspect-[4/5] perspective-1000">
        
        {/* Controles Desktop */}
        <button 
          onClick={() => paginate(-1)} 
          className="absolute -left-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-orange-600 hover:border-orange-500 hover:scale-110 transition-all hidden md:flex backdrop-blur-sm shadow-xl"
        >
            <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => paginate(1)} 
          className="absolute -right-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-orange-600 hover:border-orange-500 hover:scale-110 transition-all hidden md:flex backdrop-blur-sm shadow-xl"
        >
            <ChevronRight size={24} />
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
            <div className="relative w-full h-full rounded-[2.5rem] bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-700/50 shadow-2xl shadow-black overflow-hidden group">
                
                {/* 1. BADGE FLOTANTE DE DESCUENTO */}
                <div className="absolute top-6 left-6 z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-600 blur-md opacity-50 rounded-full" />
                        <div className="relative bg-gradient-to-br from-red-600 to-red-700 text-white font-black text-xl px-4 py-2 rounded-2xl shadow-xl rotate-[-3deg] border border-red-400/30">
                            -{discount}%
                        </div>
                      </div>
                </div>

                {/* 2. GLOW DETRÁS DEL PRODUCTO (Luz ambiental) */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/20 blur-[60px] rounded-full pointer-events-none" />

                {/* 3. IMAGEN DEL PRODUCTO (Protagonista con animación flotante) */}
                <motion.div 
                    variants={floatingImage}
                    animate="animate"
                    className="absolute top-0 left-0 w-full h-[70%] z-10 flex items-center justify-center p-6"
                >
                    <div className="relative w-full h-full transform transition-transform duration-500 hover:scale-105">
                         {imageUrl && (
                             <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                                sizes="(max-width: 768px) 100vw, 400px"
                                priority
                              />
                         )}
                    </div>
                </motion.div>

                {/* 4. INFO PANEL (Glassmorphism inferior) */}
                <div className="absolute bottom-0 w-full h-[40%] bg-zinc-900/60 backdrop-blur-xl border-t border-white/5 z-20 flex flex-col justify-between p-6 rounded-t-[2rem]">
                    
                    <div>
                        <div className="flex justify-between items-start">
                             <span className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1 block">
                                 {product.category?.name || "Oferta"}
                             </span>
                             <div className="flex flex-col items-end">
                                 <span className="text-zinc-500 text-sm line-through font-medium">S/ {price.toFixed(2)}</span>
                                 <span className="text-3xl font-black text-white leading-none">S/ {offerPrice.toFixed(2)}</span>
                             </div>
                        </div>

                        <h3 className="text-white font-bold text-lg leading-snug mt-2 line-clamp-2 pr-4">
                            {product.name}
                        </h3>
                    </div>

                    <button
                        onClick={() => addToCart(product as any)}
                        className="w-full bg-white text-black hover:bg-orange-500 hover:text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg mt-2 group/btn"
                    >
                        <ShoppingCart size={20} className="group-hover/btn:-translate-y-0.5 group-hover/btn:rotate-[-10deg] transition-transform" />
                        <span>Lo quiero ahora</span>
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