"use client";

import { memo,  useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Agregado para el link de volver
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  XMarkIcon,
  ShoppingBagIcon,
  TrashIcon,
  GiftIcon, // Icono opcional si quieres cambiar el de la bolsa
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

// Asegúrate de que estas rutas sean correctas en tu proyecto
import { useCart } from "../../context/CartContext";
import { useCartDrawer } from "../../../app/components/cart/CartDrawerContext";

/* =========================
   🖼️ IMAGE WITH FALLBACK
========================= */
interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width: number;
  height: number;
}

const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = "/assets/default-placeholder.png",
  className = "",
  width,
  height,
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover w-full h-full transition-transform duration-300 hover:scale-110 ${className}`}
      onError={() => setImgSrc(fallbackSrc)}
      sizes="(max-width: 768px) 100vw, 96px"
      priority={false}
    />
  );
};

/* =========================
   🛒 CART ITEM (Estilo Regalos)
========================= */
const CartItemComponent = memo(function CartItemComponent({
  item,
  removeFromCart,
}: any) {
  const price = Number(item.product.price) || 0;
  
  // Lógica de fallback
  const fallbackImage = `/assets/${item.product.category?.id || 'general'}/${item.product.name}.png`;
  
  // Prioridad: URL de Cloudinary > URL Local calculada
  const finalImageSrc = item.product.image_url && item.product.image_url.startsWith("http") 
    ? item.product.image_url 
    : `/assets/${item.product.id}/${item.product.name}.png`;

  return (
    <motion.li
      className="flex items-start gap-4 py-5 min-h-[110px]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* CONTENEDOR IMAGEN (Borde Rose) */}
      <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl border border-rose-500/30 shadow-md bg-zinc-900 flex items-center justify-center relative group">
        <ImageWithFallback
          src={finalImageSrc}
          alt={item.product.name}
          fallbackSrc={fallbackImage}
          width={96}
          height={96}
        />
      </div>

      {/* INFO DEL PRODUCTO */}
      <div className="flex-1 flex flex-col justify-between h-full py-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-bold text-white line-clamp-2 leading-tight group-hover:text-rose-400 transition-colors">
            {item.product.name}
          </h3>

          <p className="text-rose-400 font-bold whitespace-nowrap">
            S/.{price.toFixed(2)}
          </p>
        </div>

        <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
          <GiftIcon className="w-3 h-3" />
          {item.product?.category?.name ?? "Detalle"}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-sm text-gray-300 bg-zinc-800/50 px-3 py-1 rounded-lg border border-zinc-700">
            Cant: <span className="text-white font-bold">{item.quantity}</span>
          </p>

          <button
            onClick={() => removeFromCart(item.product.id)}
            className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20"
            title="Eliminar del carrito"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.li>
  );
});

/* =========================
   🧾 SLIDER OVER (DRAWER)
========================= */
const SliderOver = () => {
  const { isOpen, closeDrawer } = useCartDrawer();
  const { cart, removeFromCart } = useCart();

  const subtotal = useMemo(
    () =>
      cart.reduce((total, item) => {
        const price = Number(item.product.price) || 0;
        return total + price * item.quantity;
      }, 0),
    [cart]
  );

  return (
    <Dialog open={isOpen} onClose={closeDrawer} className="relative z-[9999]">
      <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out data-[closed]:opacity-0" />

      <div className="fixed inset-0 overflow-hidden flex justify-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="w-screen max-w-md pointer-events-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Borde izquierdo Rose */}
              <DialogPanel className="flex h-full flex-col bg-[#0b0b0b] text-white border-l border-rose-500/20 shadow-2xl shadow-rose-900/10">
                
                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md">
                  <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <ShoppingBagIcon className="h-6 w-6 text-rose-500" />
                    Tus Regalos
                    <span className="text-sm font-bold text-rose-200 bg-rose-600 px-2 py-0.5 rounded-full shadow-lg shadow-rose-600/20">
                      {cart.length}
                    </span>
                  </DialogTitle>

                  <button 
                    onClick={closeDrawer}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition hover:rotate-90 duration-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* LISTA DE PRODUCTOS */}
                <div className="flex-1 overflow-y-auto px-6 py-2 scroll-smooth">
                  {!cart.length ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                      <div className="p-4 bg-zinc-900 rounded-full mb-2">
                          <ShoppingBagIcon className="h-12 w-12 opacity-30" />
                      </div>
                      <p className="text-lg font-medium">Tu carrito está vacío</p>
                      <button 
                        onClick={closeDrawer}
                        className="text-rose-500 text-sm hover:text-rose-400 font-bold hover:underline underline-offset-4"
                      >
                        Ver catálogo de regalos
                      </button>
                    </div>
                  ) : (
                    <motion.ul layout className="divide-y divide-zinc-800/50">
                      <AnimatePresence>
                        {cart.map((item) => (
                          <CartItemComponent
                            key={item.product.id}
                            item={item}
                            removeFromCart={removeFromCart}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.ul>
                  )}
                </div>

                {/* FOOTER / CHECKOUT */}
                {cart.length > 0 && (
                  <div className="border-t border-white/5 bg-zinc-900/50 px-6 py-6 pb-8 space-y-4 backdrop-blur-md">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-zinc-400">Total a pagar</span>
                      <span className="text-white text-2xl">
                        S/.{subtotal.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-zinc-500 text-center">
                      Envío y detalles se calculan en el siguiente paso.
                    </p>

                    <Link
                      href="/checkout"
                      onClick={closeDrawer}
                      className=" w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                      Completar Pedido <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                )}
              </DialogPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Dialog>
  );
};

export default memo(SliderOver);