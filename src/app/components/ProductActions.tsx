// components/ProductActions.tsx
"use client";

import { useState, useEffect } from "react";
import { Heart, Share2, Check, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductActions({ product }: { product: any }) {
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- SONIDOS (Reutilizando la lógica) ---
  const playSound = (type: "pop" | "success") => {
    const audio = new Audio(type === "pop" ? "/sounds/pop.mp3" : "/sounds/success.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  // --- Cargar estado inicial de LocalStorage ---
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsLiked(favorites.includes(product.id || product.slug));
  }, [product.id, product.slug]);

  // --- Lógica de LIKE ---
  const handleLike = () => {
    playSound(isLiked ? "pop" : "success");
    setIsLiked(!isLiked);

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;

    if (!isLiked) {
      newFavorites = [...favorites, product.id || product.slug];
    } else {
      newFavorites = favorites.filter((id: string) => id !== (product.id || product.slug));
    }
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // --- Lógica de COMPARTIR ---
  const handleShare = async () => {
    playSound("pop");
    const url = window.location.href;
    const shareData = {
      title: product.name,
      text: `Mira este producto: ${product.name}`,
      url: url,
    };

    // 1. Intenta usar la API nativa del móvil (Android/iOS)
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error al compartir", err);
      }
    } else {
      // 2. Fallback para PC: Copiar al portapapeles
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Resetear estado después de 2s
      } catch (err) {
        console.error("No se pudo copiar", err);
      }
    }
  };

  return (
    <div className="flex gap-4 relative">
      {/* Botón LIKE */}
      <motion.button
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        onClick={handleLike}
        className={`p-4 rounded-xl border transition-all duration-300 ${
          isLiked
            ? "bg-red-500/10 border-red-500 text-red-500"
            : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
        }`}
      >
        <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
      </motion.button>

      {/* Botón SHARE */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          onClick={handleShare}
          className="p-4 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all duration-300"
        >
          {copied ? <Check className="w-6 h-6 text-green-500" /> : <Share2 className="w-6 h-6" />}
        </motion.button>

        {/* Tooltip de "Copiado" */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap"
            >
              ¡Link Copiado!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}