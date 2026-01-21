"use client";

import React, { useEffect, useState } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  type Variants 
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiX } from "react-icons/fi";
import {
  ShoppingCart, Zap, Truck, ShieldCheck, Star, Beer, Wine, 
  Martini, GlassWater, Utensils, PartyPopper, Gift, Droplets, ChevronRight
} from "lucide-react";

// Hooks & Services
import OfferProducts from "../store/OfferProducts"; 
import { useCart } from "@/app/context/CartContext"; 
import { useStoreData } from "@/app/hooks/useStoreData";
import { Category } from "@/services/categories.service";
import { Product } from "@/app/types"; 
import SearchBar from "../SearchBar";

// =====================================================================
// 🎨 VARIANTES DE ANIMACIÓN
// =====================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 50, damping: 20 } 
  },
};

const floatingAnimation: Variants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 1, 0, -1, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// =====================================================================
// 🧩 COMPONENTES AUXILIARES
// =====================================================================

const CategoryIcon = ({ slug }: { slug: string }) => {
  const s = slug ? slug.toLowerCase() : "";
  const className = "w-6 h-6 md:w-8 md:h-8";
  
  if (s.includes("cerveza") || s.includes("beer")) return <Beer className={className} />;
  if (s.includes("vino")) return <Wine className={className} />;
  if (s.includes("coctel") || s.includes("gin") || s.includes("vodka") || s.includes("licores")) return <Martini className={className} />;
  if (s.includes("piqueo") || s.includes("snack") || s.includes("tequenos")) return <Utensils className={className} />;
  if (s.includes("whisky") || s.includes("ron") || s.includes("pisco")) return <GlassWater className={className} />;
  if (s.includes("regalo")) return <Gift className={className} />;
  if (s.includes("agua") || s.includes("hielo")) return <Droplets className={className} />;
  
  return <PartyPopper className={className} />;
};

interface HomeViewProps {
  categories?: Category[];
  products?: Product[];
}

const ALLOWED_CATEGORIES = [
  "whisky", "ron", "vodka", "gin", "tequilas-y-mezcal", "piscos", 
  "vinos", "cervezas", "licores-y-spirits", "hielos-y-complementos", 
  "aguas-y-energizantes", "promociones", "estuches-y-regalos", 
  "tequenos-y-piqueos", "para-picar"
];

// =====================================================================
// 🚀 COMPONENTE PRINCIPAL
// =====================================================================

export default function HomeView({ categories: initialCategories = [] }: HomeViewProps) {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const { addToCart } = useCart();
  const { scrollY } = useScroll();

  const { products, categories: clientCategories, loading } = useStoreData();
  const activeCategories = clientCategories.length > 0 ? clientCategories : initialCategories;
  const yBackground = useTransform(scrollY, [0, 1000], [0, 200]);

  useEffect(() => {
    if (typeof window !== "undefined") {
        const closedAt = localStorage.getItem("offerModalClosedAt");
        const now = Date.now();
        const expiration = 10 * 60 * 1000; 
      
        if (!loading && products.length > 0 && (!closedAt || now - parseInt(closedAt) > expiration)) {
          const timer = setTimeout(() => setShowOfferModal(true), 3000);
          return () => clearTimeout(timer);
        }
    }
  }, [loading, products]);

  const handleCloseModal = () => {
    localStorage.setItem("offerModalClosedAt", Date.now().toString());
    setShowOfferModal(false);
  };

  const filteredCategories = (activeCategories || []).filter(cat => 
    ALLOWED_CATEGORIES.includes(cat.slug)
  );

  const offers = (products || [])
    .filter((p) => Number(p.is_offer) === 1 && p.offer_price)
    .map((p) => {
      const price = Number(p.price);
      const offerPrice = Number(p.offer_price);
      const discount = price > 0 ? Math.round(((price - offerPrice) / price) * 100) : 0;
      return { ...p, discount };
    })
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 10);

  return (
    <main className="bg-zinc-950 min-h-screen text-white font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* --- MODAL (Ofertas) --- */}
      <AnimatePresence>
        {showOfferModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-2xl relative overflow-hidden ring-1 ring-orange-500/20"
            >
              <button 
                onClick={handleCloseModal} 
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-orange-500 transition-colors hover:rotate-90 duration-300"
              >
                <FiX size={20} />
              </button>
              <div className="p-1 ">
                <OfferProducts products={offers} /> 
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION OPTIMIZADO PARA MÓVIL --- */}
      {/* 1. min-h-auto: En móvil la altura se adapta al contenido (sin huecos vacíos).
          2. md:min-h-[90vh]: En PC mantenemos la altura completa.
          3. pb-12: Un poco de espacio abajo en móvil antes de las categorías.
          4. pt-28: Ajustado para que el texto no choque con el Navbar pero suba más.
      */}
      <section className="relative w-full min-h-auto md:min-h-[90vh] flex items-start md:items-center justify-center bg-zinc-950 overflow-hidden pt-28 pb-12 md:pt-24 md:pb-0">
        
        {/* Fondo con Parallax */}
        <motion.div style={{ y: yBackground }} className="absolute inset-0 pointer-events-none">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]" />
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 items-center gap-8 md:gap-12">
          
          {/* Texto Hero */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5 md:gap-6 max-w-2xl order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 w-fit backdrop-blur-sm">
              <Zap size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-orange-400 text-xs md:text-sm font-bold tracking-wide uppercase">Envío Flash en Ica</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter">
              La fiesta <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 animate-pulse">
                llega a ti.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg">
              Licores premium, cervezas heladas y complementos entregados en minutos. <span className="text-white font-medium">Sin salir de casa.</span>
            </motion.p>

            <motion.div variants={itemVariants} className="w-full max-w-md shadow-2xl shadow-orange-900/20 rounded-2xl z-50 transform hover:scale-[1.02] transition-transform duration-300">
              <SearchBar />
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-zinc-500 pt-4">
              <div className="flex items-center gap-2 hover:text-orange-400 transition-colors cursor-default">
                <ShieldCheck size={16} className="md:w-[18px]" /> <span>100% Original</span>
              </div>
              <div className="flex items-center gap-2 hover:text-orange-400 transition-colors cursor-default">
                <Truck size={16} className="md:w-[18px]" /> <span>Delivery Express</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Imagen Hero Flotante */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex justify-center items-center order-1 lg:order-2 perspective-1000"
          >
              <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-orange-500/30 to-amber-600/30 rounded-full blur-[80px] animate-pulse" />
              
              <motion.div variants={floatingAnimation} animate="animate" className="relative z-10 w-full h-auto flex justify-center">
                <Image
                  src="https://res.cloudinary.com/dhuggiq9q/image/upload/v1769027243/Gemini_Generated_Image_3lw4wk3lw4wk3lw4_p7reae.png"
                  alt="Botellas Premium"
                  width={700}
                  height={800}
                  priority
                  className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] "
                />
              </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- CATEGORÍAS (Compactadas) --- */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        // pt-2 pb-2 para reducir altura en la barra sticky
        className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-2 shadow-lg shadow-black/50"
      >
        <div className="max-w-7xl mx-auto px-4 relative">
            <div className="overflow-x-auto pb-2 scroll-smooth touch-pan-x 
                [&::-webkit-scrollbar]:h-1.5
                [&::-webkit-scrollbar-track]:bg-zinc-800/30
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-zinc-600
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:hover:bg-orange-500
                [&::-webkit-scrollbar-thumb]:transition-colors
            ">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex gap-3 justify-start min-w-max px-2"
                >
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                        <motion.div key={cat.id} variants={itemVariants}>
                          <Link 
                            href={`/categoria/${cat.slug}`} 
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500 hover:bg-zinc-800 transition-all group active:scale-95 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                          >
                              <span className="text-orange-500 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                                  <CategoryIcon slug={cat.slug} />
                              </span>
                              <span className="text-zinc-300 font-bold group-hover:text-white capitalize text-sm whitespace-nowrap">
                                  {cat.name}
                              </span>
                          </Link>
                        </motion.div>
                    ))
                  ) : (
                    <div className="flex gap-2 w-full justify-start">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-32 h-12 bg-zinc-900/80 rounded-xl animate-pulse border border-zinc-800/50" />
                        ))}
                    </div>
                  )}
                </motion.div>
            </div>
        </div>
      </motion.div>

      {/* --- OFERTAS (Padding reducido) --- */}
      {/* pt-8 para subir las ofertas y pegarlas a las categorías */}
      <section className="pt-8 pb-24 md:py-24 px-4 md:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-20 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4"
        >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                Ofertas Relámpago <Zap className="text-yellow-500 fill-yellow-500 animate-bounce" size={28}/>
              </h2>
              <p className="text-zinc-400">Precios bajos por tiempo limitado.</p>
            </div>
            <Link href="/promociones" className="group flex items-center gap-2 text-orange-500 font-bold hover:text-white transition-colors bg-orange-500/10 px-4 py-2 rounded-full">
                Ver todas <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
        >
          {loading && offers.length === 0 ? (
             Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-3xl h-80 animate-pulse border border-zinc-800" />
             ))
          ) : offers.length > 0 ? (
            offers.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group relative bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-orange-500/50 transition-colors hover:shadow-2xl hover:shadow-orange-900/10 flex flex-col overflow-hidden"
              >
                <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[10px] md:text-xs font-black px-2.5 py-1 rounded-lg shadow-lg rotate-[-2deg] group-hover:rotate-0 transition-transform">
                  -{item.discount}%
                </div>

                <Link href={`/producto/${item.slug}`} className="relative w-full aspect-[4/5] bg-gradient-to-b from-zinc-800/30 to-transparent p-6 overflow-hidden">
                  <Image
                    src={
                      item.image_url && item.image_url.startsWith("http")
                        ? item.image_url
                        : `/assets/${item.category?.id}/${item.name}.png`
                    }
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-lg"
                  />
                </Link>

                <div className="p-5 flex flex-col flex-1 justify-between bg-zinc-900 relative z-10">
                  <div>
                    <h3 className="text-white text-sm font-bold line-clamp-2 leading-snug mb-3 min-h-[2.5em] group-hover:text-orange-400 transition-colors">
                        {item.name}
                    </h3>
                    
                    <div className="flex items-end gap-2">
                      <span className="text-xl md:text-2xl font-black text-white">
                        S/ {Number(item.offer_price).toFixed(2)}
                      </span>
                      <span className="text-xs text-zinc-500 line-through mb-1">
                        S/ {Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="mt-4 w-full bg-zinc-800 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 hover:shadow-lg shadow-orange-500/20 group/btn"
                  >
                    <ShoppingCart size={18} className="group-hover/btn:animate-bounce" />
                    <span className="md:hidden lg:inline">Agregar</span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-zinc-900/50 rounded-3xl border border-zinc-800 border-dashed">
              <p className="text-zinc-500 text-lg">No hay ofertas activas en este momento.</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* --- TRUST SIGNALS --- */}
      <section className="bg-zinc-900 py-16 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Delivery Flash", desc: "Entrega rápida en Ica" },
              { icon: ShieldCheck, title: "Garantía Total", desc: "Productos 100% originales" },
              { icon: Star, title: "Atención VIP", desc: "Soporte personalizado" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                className="flex items-center gap-5 p-8 rounded-3xl bg-zinc-950/50 border border-zinc-800 cursor-default group"
              >
                <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                   <feature.icon size={32} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-1">{feature.title}</h4>
                  <p className="text-zinc-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* --- BANNER FINAL --- */}
      <section className="relative w-full py-32 bg-gradient-to-br from-orange-600 to-red-700 text-center overflow-hidden">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-multiply -translate-x-1/2 -translate-y-1/2"
         />
         
         <div className="relative z-10 px-6 max-w-3xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight drop-shadow-xl"
            >
              ¿Listo para empezar la fiesta?
            </motion.h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/combos" className="inline-flex items-center gap-3 bg-black text-white hover:bg-zinc-900 font-bold py-5 px-12 rounded-full shadow-2xl transition-all text-lg border-4 border-white/10 hover:border-white/30">
                    <PartyPopper size={24} className="text-orange-500" /> 
                    <span>Ver Packs de Fiesta</span>
                </Link>
            </motion.div>
         </div>
      </section>

    </main>
  );
}