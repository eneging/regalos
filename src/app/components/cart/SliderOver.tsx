"use client";

import { memo, useMemo, useState } from "react";
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
import { useCart } from "../../context/CartContext";
import { useCartDrawer } from "../../../app/components/cart/CartDrawerContext";

/* =========================
   🖼️ IMAGE WITH FALLBACK (Next/Image)
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
  fallbackSrc = "/assets/placeholder.png",
  className,
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
      className={`transition-transform duration-300 hover:scale-105 ${className}`}
      onError={() => setImgSrc(fallbackSrc)}
      sizes="96px"
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
  return (
    <motion.li
      className="flex items-start gap-4 py-5 min-h-[110px]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* IMAGEN */}
      <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl border border-orange-400/30 shadow-md bg-gradient-to-tr from-[#1a1a1a] to-[#222] flex items-center justify-center">
        <ImageWithFallback
          src={item.product.image}
          alt={item.product.name}
          fallbackSrc="/assets/default.png"
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>

      {/* INFO */}
      <div className="flex-1 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-semibold text-white line-clamp-2 max-w-[70%]">
            {item.product.name}
          </h3>

          <p className="text-orange-400 font-semibold whitespace-nowrap">
            S/.{item.product.price.toFixed(2)}
          </p>
        </div>

        <p className="text-sm text-gray-400 mt-1">
          {item.product?.category?.name ?? "Sin categoría"}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-300">
            Cantidad: {item.quantity}
          </p>

          <button
            onClick={() => removeFromCart(item.product.id)}
            className="p-1.5 rounded-lg hover:bg-red-600/20 text-red-500 transition"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.li>
  );
});

/* =========================
   🧾 SLIDER OVER
========================= */
const SliderOver = () => {
  const { isOpen, closeDrawer } = useCartDrawer();
  const { cart, removeFromCart } = useCart();

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    [cart]
  );

  return (
    <Dialog open={isOpen} onClose={closeDrawer} className="relative z-[9999]">
      <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="fixed inset-0 overflow-hidden flex justify-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="w-screen max-w-md"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
            >
              <DialogPanel className="flex h-full flex-col bg-[#0b0b0b] text-white border-l border-orange-500/20">

                {/* HEADER */}
                <div className="flex justify-between px-6 py-5 border-b border-orange-500/30">
                  <DialogTitle className="text-xl font-semibold text-orange-400 flex items-center gap-2">
                    <ShoppingBagIcon className="h-6 w-6" />
                    Tu carrito
                  </DialogTitle>

                  <button onClick={closeDrawer}>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* LISTA */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  {!cart.length ? (
                    <p className="text-center text-gray-400 py-20">
                      Tu carrito está vacío
                    </p>
                  ) : (
                    <motion.ul layout>
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

                {/* FOOTER */}
                {cart.length > 0 && (
                  <div className="border-t border-orange-400/30 px-6 py-5">
                    <div className="flex justify-between text-lg mb-4">
                      <span>Subtotal</span>
                      <span className="text-orange-400">
                        S/.{subtotal.toFixed(2)}
                      </span>
                    </div>

                    <a
                      href="/checkout"
                      className="block w-full bg-orange-500 text-center py-3 rounded-xl font-semibold hover:bg-orange-600"
                    >
                      Proceder al pago
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
