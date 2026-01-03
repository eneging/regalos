"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  Star,
  Beer,
  Wine,
  Martini,
  GlassWater,
  Utensils,
  PartyPopper,
  Gift,
  Droplets,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Hooks & Services
import OfferProducts from "../store/OfferProducts"; 
import { useCart } from "@/app/context/CartContext"; 
import { useStoreData } from "@/app/hooks/useStoreData";
import { Category } from "@/services/categories.service";
import { Product } from "@/app/types";
import SearchBar from "../SearchBar";

// =====================================================================
// 🎨 1. Iconos Dinámicos
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

// =====================================================================
// 📋 2. Props y Configuración
// =====================================================================
interface HomeViewProps {
  categories: Category[];
  products?: Product[]; // Opcional por si decides pasarlos por props en el futuro
}

const ALLOWED_CATEGORIES = [
  "whisky", "ron", "vodka", "gin", "tequilas-y-mezcal", "piscos", 
  "vinos", "cervezas", "licores-y-spirits", "hielos-y-complementos", 
  "aguas-y-energizantes", "promociones", "estuches-y-regalos", 
  "tequenos-y-piqueos", "para-picar"
];

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// =====================================================================
// 🚀 3. Componente Principal
// =====================================================================
export default function HomeView({ categories = [] }: HomeViewProps) {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const { addToCart } = useCart();
  
  // Usamos el hook solo para productos, ya que las categorías vienen por props
  const { products, loading } = useStoreData();
  const router = useRouter();

  // --- Lógica Modal (Timer) ---
  useEffect(() => {
    const closedAt = localStorage.getItem("offerModalClosedAt");
    const now = Date.now();
    const expiration = 10 * 60 * 1000; // 10 minutos
    
    // Solo activamos el modal si ya cargaron los productos y pasó el tiempo
    if (!loading && (!closedAt || now - parseInt(closedAt) > expiration)) {
      const timer = setTimeout(() => setShowOfferModal(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleCloseModal = () => {
    localStorage.setItem("offerModalClosedAt", Date.now().toString());
    setShowOfferModal(false);
  };

  // --- Filtros de Datos (Usando la prop categories) ---
  const filteredCategories = (categories || []).filter(cat => 
    ALLOWED_CATEGORIES.includes(cat.slug)
  );

  const offers = (products || [])
    .filter((p) => Number(p.is_offer) === 1 && p.offer_price)
    .map((p) => {
      const discount = Math.round(((Number(p.price) - Number(p.offer_price)) / Number(p.price)) * 100) || 0;
      return { ...p, discount };
    })
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 8);

  return (
    <main className="bg-zinc-950 min-h-screen text-white font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* --- MODAL DE OFERTAS --- */}
      <AnimatePresence>
        {showOfferModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden"
            >
              <button 
                onClick={handleCloseModal} 
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-orange-500 transition-colors"
              >
                <FiX size={20} />
              </button>
              <div className="p-2 md:p-6">
                <OfferProducts />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-zinc-950 overflow-hidden pt-20">
        
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 items-center gap-12">
          
          <motion.div 
            variants={variants} 
            initial="hidden" 
            animate="visible" 
            className="flex flex-col gap-8 max-w-2xl"
          >
            {/* Badge Envío */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 w-fit backdrop-blur-sm">
              <Zap size={16} className="text-orange-500 fill-orange-500" />
              <span className="text-orange-400 text-xs md:text-sm font-bold tracking-wide uppercase">Envío Flash en Ica</span>
            </div>

            {/* Titulo */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              La fiesta <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
                llega a ti.
              </span>
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg">
              Licores premium, cervezas heladas y complementos entregados en minutos.
            </p>

            {/* SearchBar (Diseño Negro/Naranja) */}
            <div className="w-full max-w-md shadow-2xl shadow-orange-900/20 rounded-2xl z-50">
              <SearchBar />
            </div>
            
            {/* Badges de confianza mini */}
            <div className="flex items-center gap-6 text-sm text-zinc-500 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} /> <span>100% Original</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} /> <span>Delivery Express</span>
              </div>
            </div>
          </motion.div>

          {/* Imagen Hero */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex justify-center items-center"
          >
             <div className="absolute w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] animate-pulse" />
             <Image
                src="https://res.cloudinary.com/dck9uinqa/image/upload/v1760996469/depositphotos_110689618-stock-photo-bottles-of-several-whiskey-brands_kbuky1.jpg"
                alt="Botellas Premium"
                width={600}
                height={700}
                priority
                className="relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-in-out object-contain"
              />
          </motion.div>
        </div>
      </section>

      {/* --- CATEGORÍAS (Scroll Horizontal UX Mejorado) --- */}
      {/* Usamos sticky top-0 con backdrop-blur para que se vea moderno al hacer scroll */}
      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-lg border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 relative group">
            
            {/* Sombras laterales para indicar scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none md:hidden" />

            <div className="overflow-x-auto pb-2 hide-scrollbar scroll-smooth snap-x snap-mandatory">
                <div className="flex gap-3 md:justify-center min-w-max px-2">
                  {/* Validamos si hay categorías en las props */}
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                        <Link 
                          key={cat.id} 
                          href={`/categoria/${cat.slug}`} 
                          className="snap-center flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-500 hover:bg-zinc-800 transition-all group active:scale-95"
                        >
                            <span className="text-orange-500 group-hover:scale-110 group-hover:text-orange-400 transition-transform">
                                <CategoryIcon slug={cat.slug} />
                            </span>
                            <span className="text-zinc-300 font-bold group-hover:text-white capitalize text-sm whitespace-nowrap">
                                {cat.name}
                            </span>
                        </Link>
                    ))
                  ) : (
                    // Fallback visual si el array viene vacío
                    <div className="flex gap-2 w-full justify-center">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="w-32 h-12 bg-zinc-900 rounded-xl animate-pulse border border-zinc-800" />
                       ))}
                    </div>
                  )}
                </div>
            </div>
        </div>
      </div>

      {/* --- BEST SELLERS / OFERTAS --- */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                Ofertas Relámpago <Zap className="text-orange-500 animate-pulse fill-orange-500" size={24}/>
              </h2>
              <p className="text-zinc-400 text-sm md:text-base">
                Precios bajos por tiempo limitado.
              </p>
            </div>
            <Link href="/promociones" className="group flex items-center gap-2 text-orange-500 font-semibold hover:text-white transition-colors">
                Ver todas <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {loading ? (
             // Skeletons Products
             Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-2xl h-80 animate-pulse" />
             ))
          ) : offers.length > 0 ? (
            offers.map((item) => (
              <div
                key={item.id}
                className="group relative bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-900/10 flex flex-col overflow-hidden"
              >
                {/* Badge Descuento */}
                <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                  -{item.discount}%
                </div>

                {/* Imagen + Link */}
                <Link href={`/producto/${item.slug}`} className="relative w-full aspect-[4/5] bg-zinc-800/50 p-4">
                  <Image
                    src={
                      item.image_url && item.image_url.startsWith("http")
                        ? item.image_url
                        : "/placeholder-bottle.png"
                    }
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>

                {/* Información */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-white text-sm md:text-base font-medium line-clamp-2 leading-tight mb-2 min-h-[2.5em]">
                      <Link href={`/producto/${item.slug}`} className="hover:text-orange-500 transition-colors">
                        {item.name}
                      </Link>
                    </h3>
                    
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500 line-through">
                        S/ {Number(item.price).toFixed(2)}
                      </span>
                      <span className="text-lg md:text-xl font-bold text-orange-500">
                        S/ {Number(item.offer_price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Botón Añadir (UX Mejorado Mobile) */}
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-3 w-full bg-zinc-800 hover:bg-orange-600 text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-95 group-hover:bg-orange-600"
                  >
                    <ShoppingCart size={16} />
                    <span className="md:hidden lg:inline">Agregar</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-zinc-500 text-lg">No hay ofertas activas en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- TRUST SIGNALS --- */}
      <section className="bg-zinc-900 py-12 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Delivery Flash", desc: "Entrega rápida en Ica" },
              { icon: ShieldCheck, title: "Garantía Total", desc: "Productos 100% originales" },
              { icon: Star, title: "Atención VIP", desc: "Soporte personalizado" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 hover:border-orange-500/30 transition-colors">
                <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                   <feature.icon size={28}/>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{feature.title}</h4>
                  <p className="text-zinc-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* --- BANNER FINAL --- */}
      <section className="relative w-full py-24 bg-gradient-to-br from-orange-600 to-amber-700 text-center overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-multiply"></div>
         <div className="relative z-10 px-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              ¿Listo para empezar la fiesta?
            </h2>
            <p className="text-white/90 text-lg mb-8">
               Explora nuestros packs armados con hielo y complementos listos para disfrutar.
            </p>
            <Link href="/combos" className="inline-flex items-center gap-2 bg-black text-white hover:bg-zinc-900 font-bold py-4 px-10 rounded-full shadow-2xl transition-transform hover:scale-105">
                <PartyPopper size={20} /> Ver Packs de Fiesta
            </Link>
         </div>
      </section>

    </main>
  );
}