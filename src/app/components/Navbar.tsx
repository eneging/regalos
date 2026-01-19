"use client";
import { useCartDrawer } from "../components/cart/CartDrawerContext";
import { useCart } from "../context/CartContext";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  ChevronDown,
  Phone,
  ExternalLink,
  Wine,
  UtensilsCrossed,
  Gift,
  Book,
} from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { cart } = useCart();
  const { openDrawer } = useCartDrawer();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const marketplaces = [
    {
      name: "Licorería",
      href: "https://licoreria.puertoricoica.online",
      icon: Wine,
      active: true,
    },
    {
      name: "Restobar",
      href: "https://restobar.puertoricoica.online",
      icon: UtensilsCrossed,
      active: false,
    },
    {
      name: "Regalos",
      href: "https://gifts.puertoricoica.online",
      icon: Gift,
      active: false,
    },
  ];

  const navLinks = [
    { name: "Ofertas 🔥", href: "/promociones", highlight: true },
    { name: "Whiskys", href: "/categoria/whisky" },
    { name: "Rones", href: "/categoria/ron" },
    { name: "Piscos", href: "/categoria/piscos" },
    { name: "Cervezas", href: "/categoria/cervezas" },
    { name: "combos", href: "/combos" },
  ];

  return (
    <>
      {/* 1. TOP BAR */}
      <div className="hidden md:flex justify-between items-center bg-[#000000] text-[11px] py-2 px-6 md:px-10 border-b border-white/10 relative z-[7000]">
        {/* ... (Contenido Top Bar igual que antes) ... */}
        <div className="flex items-center gap-6">
           <span className="text-gray-500 font-bold uppercase tracking-wider">Nuestras Tiendas:</span>
           <div className="flex items-center gap-5">
              {marketplaces.map((m) => (
                <a
                  key={m.name}
                  href={m.href}
                  target={m.active ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 transition-all group ${
                    m.active ? "opacity-100 cursor-default" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <m.icon size={14} className={m.active ? "text-amber-500" : "text-gray-400 group-hover:text-white"} />
                  <span className={`font-medium ${m.active ? "text-amber-500" : "text-gray-300 group-hover:text-white"}`}>
                    {m.name}
                  </span>
                  {!m.active && <ExternalLink size={10} className="text-gray-600" />}
                </a>
              ))}
           </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
           <a href="/libro-reclamaciones" className="hover:text-white flex items-center gap-1 transition-colors">
              <Book size={12} /> <span className="hidden lg:inline">Libro de Reclamaciones</span> 
           </a>
           <a href="tel:51933739769" className="hover:text-white flex items-center gap-1 transition-colors">
              <Phone size={12} /> <span className="hidden lg:inline">Pedidos:</span> 933 739 769
           </a>
           <span className="text-gray-700">|</span>
           <span className="text-amber-500 font-medium">Delivery Flash en Ica ⚡</span>
        </div>
      </div>

      {/* 2. HEADER STICKY (Solo contiene la barra, NO el menú desplegable) */}
      <header 
        className={`sticky top-0 w-full z-[9999] transition-all duration-300 border-b border-white/5 ${
          scrolled ? "bg-[#050505]/95 backdrop-blur-md py-2 shadow-xl" : "bg-[#050505] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between gap-6">
          <Link href="/" className="flex-shrink-0 relative z-20">
            <Image
              src="https://res.cloudinary.com/dck9uinqa/image/upload/v1765050033/logopuertoricoblanco_abvacb.svg"
              alt="Puerto Rico Licorería"
              width={180}
              height={50}
              className={`object-contain transition-all duration-300 ${
                scrolled ? "h-7 md:h-8" : "h-9 md:h-10"
              }`}
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.highlight ? "text-red-500 hover:text-red-400 font-bold" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="lg:block hidden ">
               <SearchBar />
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <Link href="/login" className="hidden sm:block text-gray-400 hover:text-white transition">
                <User size={22} />
              </Link>
              <Link href="/wishlist" className="hidden sm:block text-gray-400 hover:text-amber-500 transition">
                <Heart size={22} />
              </Link>
              <button 
                onClick={openDrawer} 
                className="relative group flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white px-4 py-2 rounded-full transition-all shadow-lg hover:shadow-amber-500/20"
              >
                <ShoppingCart size={18} className="fill-white/10" />
                <span className="font-bold text-sm">
                   {cart.length > 0 ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0}
                </span>
              </button>
              <button onClick={() => setMobileOpen(true)} className="lg:hidden text-white ml-1">
                <Menu size={26} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:hidden p-4">
            <SearchBar />
        </div>
      </header> 
      {/* 👈 AQUÍ CERRAMOS EL HEADER ANTES DE RENDERIZAR EL MENÚ MÓVIL */}

      {/* 3. MOBILE MENU (Fuera del Header para evitar problemas de z-index/fixed) */}
      {mobileOpen && (
          <div className="fixed inset-0 z-[99999] flex justify-end">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative w-[85%] max-w-[350px] h-full bg-[#0f0f0f] text-white p-6 shadow-2xl flex flex-col border-l border-white/10 overflow-y-auto">
              
              <div className="flex justify-between items-center mb-8">
                 <Image
                    src="https://res.cloudinary.com/dck9uinqa/image/upload/v1765050033/logopuertoricoblanco_abvacb.svg"
                    alt="Logo"
                    width={140}
                    height={40}
                 />
                 <button onClick={() => setMobileOpen(false)} className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                   <X size={20} />
                 </button>
              </div>

              <div className="mb-6 relative">
                  <SearchBar />
              </div>

              <div className="space-y-1 mb-8">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Categorías</p>
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`py-3 px-4 rounded-xl flex justify-between items-center transition-colors ${
                      l.highlight ? "bg-red-500/10 text-red-500 font-bold" : "bg-white/5 hover:bg-white/10 text-gray-200"
                    }`}
                  >
                    {l.name}
                    {!l.highlight && <ChevronDown size={16} className="-rotate-90 text-gray-600" />}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Otras Tiendas Puerto Rico</p>
                 <div className="grid grid-cols-2 gap-3">
                    {marketplaces.filter(m => !m.active).map(m => (
                        <a 
                            key={m.name} 
                            href={m.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-amber-500/30 hover:bg-white/10 transition-all group"
                        >
                            <m.icon size={24} className="text-amber-500 group-hover:scale-110 transition-transform" />
                            <div className="flex items-center gap-1 text-xs text-gray-300 group-hover:text-white">
                                {m.name} <ExternalLink size={10} />
                            </div>
                        </a>
                    ))}
                 </div>
              </div>
            </aside>
          </div>
        )}
    </>
  );
}