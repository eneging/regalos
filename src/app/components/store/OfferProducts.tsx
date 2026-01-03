"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image"; // Optimización de imágenes Next.js
import { ChevronLeft, ChevronRight, ShoppingCart, Tag, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStoreData } from "../../hooks/useStoreData";
import { useCart } from "../../context/CartContext";

// Definir variantes para la animación del carrusel
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
};

const OfferProducts: React.FC = () => {
  const { products, categories, loading, error } = useStoreData();
  const { addToCart } = useCart();

  // Filtrar ofertas
  const offerProducts = products.filter((p) => p.is_offer);

  const [[page, direction], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  // Lógica de índice circular seguro
  const index = Math.abs(page % offerProducts.length);
  const product = offerProducts[index];

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  // Autoplay
  useEffect(() => {
    if (offerProducts.length <= 1 || paused) return;
    const timer = setInterval(() => paginate(1), 4000);
    return () => clearInterval(timer);
  }, [offerProducts.length, paused, paginate]);

  // Loading State (Skeleton simple)
  if (loading)
    return (
      <div className="w-full max-w-sm mx-auto h-96 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800" />
    );

  // Error State
  if (error)
    return (
      <div className="flex items-center justify-center gap-2 p-4 text-red-400 bg-red-950/30 rounded-xl border border-red-900">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );

  // Empty State
  if (offerProducts.length === 0) return null;

  const category = categories.find((c) => c.id === product.product_category_id);
  const discount = Math.round(
    ((Number(product.price) - Number(product.offer_price)) / Number(product.price)) * 100
  );

  return (
    <section
      className="w-full max-w-7xl mx-auto py-12 px-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <Tag className="text-orange-500 w-6 h-6" />
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Ofertas Relámpago
          </h2>
        </div>
        <button
          onClick={() => console.log("ver todo")}
          className="text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors"
        >
          Ver todas
        </button>
      </div>

      {/* CAROUSEL CONTAINER */}
      <div className="relative w-full max-w-sm mx-auto group">
        
        {/* Navigation Buttons (Solo visibles en hover desktop) */}
        <button
          onClick={() => paginate(-1)}
          className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full hover:text-white hover:border-orange-500 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full hover:text-white hover:border-orange-500 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronRight size={24} />
        </button>

        {/* MAIN CARD */}
        <div className="relative h-[450px] w-full overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl shadow-black/50">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -10000) paginate(1);
                else if (swipe > 10000) paginate(-1);
              }}
              className="absolute inset-0 flex flex-col cursor-grab active:cursor-grabbing bg-zinc-900"
            >
              {/* Image Section */}
              <div className="relative h-[60%] w-full bg-gradient-to-b from-zinc-800/50 to-zinc-900 flex items-center justify-center p-6">
                
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 z-10 bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-900/40">
                  Ahorras {discount}%
                </div>

                {/* Product Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={`/assets/${product.product_category_id}/${product.name}.png`}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority // Carga prioritaria para la imagen activa
                  />
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-orange-500 mb-1 uppercase tracking-wider">
                    {category?.name || "Oferta"}
                  </p>
                  <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight mb-3">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-white">
                      S/ {Number(product.offer_price).toFixed(2)}
                    </span>
                    <span className="text-sm text-zinc-500 line-through decoration-zinc-600">
                      S/ {Number(product.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-orange-900/20"
                >
                  <ShoppingCart size={18} />
                  Agregar al Carrito
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicadores (Puntos) */}
        <div className="flex justify-center mt-6 gap-2">
          {offerProducts.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage([i, i > index ? 1 : -1])}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-orange-500" : "w-2 bg-zinc-800 hover:bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferProducts;