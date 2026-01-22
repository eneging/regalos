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
  Sparkles // Nuevo icono para ofertas
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

  // 🏪 CONFIGURACIÓN MULTI-TIENDA (Regalos Activo)
  const marketplaces = [
    {
      name: "Licorería",
      href: "https://licoreria.puertoricoica.online",
      icon: Wine,
      active: false,
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
      active: true, // ¡Ahora esta es la activa!
    },
  ];

  // 🎁 ENLACES DE NAVEGACIÓN (Categorías de Regalos)
  const navLinks = [
    { name: "Ofertas 💕", href: "/promociones", highlight: true },
    { name: "Flores", href: "/categoria/flores-y-rosas" },
    { name: "Peluches", href: "/categoria/peluches" },
    { name: "Chocolates", href: "/categoria/chocolates-y-dulces" },
    { name: "Packs", href: "/categoria/packs-regalo" },
    { name: "Ocasiones", href: "/categoria/aniversario" },
  ];

  return (
    <>
      {/* 1. TOP BAR */}
      <div className="hidden md:flex justify-between items-center bg-[#000000] text-[11px] py-2 px-6 md:px-10 border-b border-white/10 relative z-[7000]">
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
                  {/* Cambio de color activo a Rose-500 */}
                  <m.icon size={14} className={m.active ? "text-rose-500" : "text-gray-400 group-hover:text-white"} />
                  <span className={`font-medium ${m.active ? "text-rose-500" : "text-gray-300 group-hover:text-white"}`}>
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
           {/* Texto destacado en Rose */}
           <span className="text-rose-500 font-medium flex items-center gap-1">
             <Sparkles size={10} /> Sorpresas en Ica
           </span>
        </div>
      </div>

      {/* 2. HEADER STICKY */}
      <header 
        className={`sticky top-0 w-full z-[9999] transition-all duration-300 border-b border-white/5 ${
          scrolled ? "bg-[#050505]/95 backdrop-blur-md py-3 shadow-xl" : "bg-[#050505] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <Link href="/" className="flex-shrink-0 relative z-20">
            <div className="relative w-36 h-10 md:w-44 md:h-12">
                <Image
                src="https://res.cloudinary.com/dck9uinqa/image/upload/v1765050033/logopuertoricoblanco_abvacb.svg"
                alt="Puerto Rico Regalos"
                fill
                className="object-contain"
                priority
                quality={100}
                />
            </div>
          </Link>
   
          <span className="text-gray-700 hidden lg:block">|</span>
          
          {/* MENÚ DE ESCRITORIO */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  // Highlight en Rosa
                  link.highlight ? "text-rose-500 hover:text-rose-400 font-bold" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* ACCIONES */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
            <div className="lg:block hidden ">
               <SearchBar />
            </div>
            
            <div className="flex items-center gap-1 md:gap-3 border-l border-white/10 pl-2 md:pl-4">
              <Link href="/login" className="hidden sm:block text-gray-400 hover:text-white transition p-2">
                <User size={22} />
              </Link>

              {/* Botón Carrito (Gradiente Rosado/Morado) */}
              <button 
                onClick={openDrawer} 
                className="relative group flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white px-3 py-2 md:px-4 md:py-2 rounded-full transition-all shadow-lg hover:shadow-rose-500/20 active:scale-95"
              >
                <ShoppingCart size={18} className="fill-white/10" />
                <span className="font-bold text-sm">
                    {cart.length > 0 ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0}
                </span>
              </button>

              {/* Botón Menú Móvil */}
              <button 
                onClick={() => setMobileOpen(true)} 
                className="lg:hidden text-white p-2 rounded-full active:bg-white/10 transition-colors"
                aria-label="Abrir menú"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda móvil */}
        <div className="lg:hidden px-4 pb-2 pt-1">
            <SearchBar />
        </div>
      </header> 

      {/* 3. MOBILE MENU */}
      {mobileOpen && (
          <div className="fixed inset-0 z-[99999] flex justify-end">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative w-[85%] max-w-[320px] h-full bg-[#0f0f0f] text-white p-6 shadow-2xl flex flex-col border-l border-white/10 overflow-y-auto animate-in slide-in-from-right duration-300">
              
              <div className="flex justify-between items-center mb-8">
                 <div className="relative w-32 h-8">
                    <Image
                        src="https://res.cloudinary.com/dck9uinqa/image/upload/v1765050033/logopuertoricoblanco_abvacb.svg"
                        alt="Logo Menu"
                        fill
                        className="object-contain"
                    />
                 </div>
                 <button 
                    onClick={() => setMobileOpen(false)} 
                    className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors active:scale-90"
                 >
                    <X size={24} />
                 </button>
              </div>

              {/* Links de Categorías */}
              <div className="space-y-1 mb-8">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Regalos y Detalles</p>
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`py-3.5 px-4 rounded-xl flex justify-between items-center transition-colors active:scale-[0.98] ${
                      // Highlight Móvil en Rosa
                      l.highlight ? "bg-rose-500/10 text-rose-500 font-bold border border-rose-500/20" : "bg-white/5 hover:bg-white/10 text-gray-200 border border-transparent"
                    }`}
                  >
                    <span className="text-sm">{l.name}</span>
                    {!l.highlight && <ChevronDown size={16} className="-rotate-90 text-gray-600" />}
                  </Link>
                ))}
              </div>

              {/* Enlaces de Usuario Móvil */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 active:bg-white/10">
                      {/* Icono Rose */}
                      <User size={20} className="mb-2 text-rose-500"/>
                      <span className="text-xs font-medium">Mi Cuenta</span>
                  </Link>
                  <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 active:bg-white/10">
                      <Heart size={20} className="mb-2 text-red-500"/>
                      <span className="text-xs font-medium">Favoritos</span>
                  </Link>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Otras Tiendas</p>
                 <div className="grid grid-cols-2 gap-3">
                    {marketplaces.filter(m => !m.active).map(m => (
                        <a 
                            key={m.name} 
                            href={m.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            // Hover border en Rose
                            className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-rose-500/30 active:bg-white/10 transition-all"
                        >
                            {/* Iconos de otras tiendas en su color original o gris, aquí usamos Rose suave */}
                            <m.icon size={20} className="text-rose-400/70" />
                            <div className="flex items-center gap-1 text-[10px] text-gray-300 font-medium">
                                {m.name} <ExternalLink size={8} />
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