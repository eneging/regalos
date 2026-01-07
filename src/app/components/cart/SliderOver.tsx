"use client";

import { memo,  useMemo, useState } from "react";
import Image from "next/image";
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
  fallbackSrc = "/assets/default-placeholder.png", // Imagen por defecto genérica
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
      // 'object-cover' asegura que la imagen llene el cuadrado sin deformarse
      className={`object-cover w-full h-full transition-transform duration-300 hover:scale-110 ${className}`}
      onError={() => setImgSrc(fallbackSrc)}
      sizes="(max-width: 768px) 100vw, 96px"
      priority={false}
    />
  );
};

/* =========================
   🛒 CART ITEM
========================= */
const CartItemComponent = memo(function CartItemComponent({
  item,
  removeFromCart,
}: any) {
  // Conversión segura del precio
  const price = Number(item.product.price) || 0;
  
  // Construcción segura del fallback usando los datos del producto
  const fallbackImage = `/assets/${item.product.category.id }/${item.product.name}.png`;

  return (
    <motion.li
      className="flex items-start gap-4 py-5 min-h-[110px]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* CONTENEDOR IMAGEN (Cuadrado fijo) */}
      <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl border border-orange-400/30 shadow-md bg-zinc-900 flex items-center justify-center relative">
        <ImageWithFallback
          src={`/assets/${item.product.id}/${item.product.name}.png`} // URL de la API/BD
          alt={item.product.name}
          fallbackSrc={fallbackImage} // URL local construida
          width={96}
          height={96}
          className="" // Las clases base ya están en el componente
        />
      </div>

      {/* INFO DEL PRODUCTO */}
      <div className="flex-1 flex flex-col justify-between h-full py-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-semibold text-white line-clamp-2 leading-tight">
            {item.product.name}
         
          </h3>

          <p className="text-orange-400 font-semibold whitespace-nowrap">
            S/.{price.toFixed(2)}
          </p>
        </div>

        <p className="text-sm text-gray-400 mt-1">
          {item.product?.category?.name ?? "Sin categoría"}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-sm text-gray-300 bg-zinc-800/50 px-2 py-1 rounded-md border border-zinc-700">
            Cant: <span className="text-white font-bold">{item.quantity}</span>
          </p>

          <button
            onClick={() => removeFromCart(item.product.id)}
            className="p-1.5 rounded-lg hover:bg-red-950/50 text-red-500 hover:text-red-400 transition-colors border border-transparent hover:border-red-900"
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
      <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

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
              <DialogPanel className="flex h-full flex-col bg-[#0b0b0b] text-white border-l border-orange-500/20 shadow-2xl">
                
                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-800/50 bg-zinc-900/50">
                  <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <ShoppingBagIcon className="h-6 w-6 text-orange-500" />
                    Tu Carrito
                    <span className="text-sm font-normal text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                      {cart.length}
                    </span>
                  </DialogTitle>

                  <button 
                    onClick={closeDrawer}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* LISTA DE PRODUCTOS */}
                <div className="flex-1 overflow-y-auto px-6 py-2">
                  {!cart.length ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                      <ShoppingBagIcon className="h-16 w-16 opacity-20" />
                      <p className="text-lg">Tu carrito está vacío</p>
                      <button 
                        onClick={closeDrawer}
                        className="text-orange-500 text-sm hover:underline"
                      >
                        Volver a la tienda
                      </button>
                    </div>
                  ) : (
                    <motion.ul layout className="divide-y divide-zinc-800/50">
                      {cart.map((item) => (

                         
                        <CartItemComponent
                          key={item.product.id}
                          item={item}
                          removeFromCart={removeFromCart}
                        />
                   
                   
                   
                   ))}
                    </motion.ul>
                  )}
                </div>

                {/* FOOTER / CHECKOUT */}
                {cart.length > 0 && (
                  <div className="border-t border-zinc-800 bg-zinc-900/30 px-6 py-6 pb-8 space-y-4">
                    <div className="flex justify-between text-lg font-medium">
                      <span className="text-zinc-300">Subtotal</span>
                      <span className="text-white text-xl">
                        S/.{subtotal.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-zinc-500 text-center">
                      Impuestos y envío calculados al finalizar compra.
                    </p>

                    <a
                      href="/checkout"
                      className="block w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98]"
                    >
                      Proceder al Pago
                                      
                        
                    </a>
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