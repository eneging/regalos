"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Home, 
  Gift, // Cambiado Store por Gift
  Heart, // Cambiado BadgePercent por Heart (más romántico para ofertas)
  ShoppingBag, 
  Sparkles
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Definimos los links en un array para mantener el código limpio
  const navLinks = [
    {
      href: "/",
      label: "Inicio",
      icon: Home,
    },
    {
      href: "/catalogo", // Cambiado de /store a /catalogo
      label: "Catálogo",
      icon: Gift,
    },
    {
      href: "/promociones",
      label: "Ofertas",
      icon: Heart, // Icono de corazón para ofertas
    },
    {
      href: "/checkout",
      label: "Carrito",
      icon: ShoppingBag, 
    },
  ];

  return (
    // Contenedor principal
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden pointer-events-none pb-safe">
      
      {/* Gradiente inferior */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {/* LA BARRA DE NAVEGACIÓN */}
      <nav className="relative pointer-events-auto mx-4 mb-4 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/5">
        
        {/* Grid para distribuir equitativamente */}
        <div className="grid grid-cols-4 items-center h-16">
          
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex flex-col items-center justify-center h-full w-full group"
              >
                {/* Fondo Animado del Activo (Glow Rose) */}
                {isActive && (
                  <motion.div
                    layoutId="nav-bubble"
                    className="absolute inset-0 bg-rose-500/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Indicador superior rose (Barrita) */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute top-0 w-8 h-1 bg-rose-500 rounded-b-full shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                  />
                )}

                {/* Ícono con animación */}
                <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                    isActive ? "text-rose-500 -translate-y-1" : "text-zinc-400 group-hover:text-rose-200"
                }`}>
                  <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" : ""}`} 
                  />
                  
                  {/* Partículas para Ofertas */}
                  {link.label === "Ofertas" && isActive && (
                    <motion.div 
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-1 -right-1 text-pink-400"
                    >
                        <Sparkles size={10} fill="currentColor" />
                    </motion.div>
                  )}
                </div>

                {/* Etiqueta de texto */}
                <span className={`text-[10px] font-medium transition-all duration-300 ${
                    isActive ? "text-white translate-y-0 opacity-100" : "text-zinc-500 translate-y-1 opacity-70"
                }`}>
                  {link.label}
                </span>

              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}