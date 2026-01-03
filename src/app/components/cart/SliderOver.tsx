"use client";

import { memo, useMemo, useState } from "react";
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

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = "/assets/placeholder.png",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      {...props}
      alt={alt}
      src={imgSrc}
      onError={() => setImgSrc(fallbackSrc)}
      loading="lazy"
      className={`transition-transform duration-300 hover:scale-105 ${props.className}`}
    />
  );
};

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
          alt={item.product.name}
          src={item.product.image ?? `/assets/default.png`}
          className="w-full h-full object-cover"
          width={96}
          height={96}
        />
      </div>

      {/* INFORMACIÓN */}
      <div className="flex-1 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <h3
            className="text-base font-semibold text-white leading-snug line-clamp-2 max-w-[70%]"
            title={item.product.name}
          >
            {item.product.name}
          </h3>
          <p className="text-orange-400 text-base font-semibold whitespace-nowrap ml-2 shrink-0">
            S/.{item.product.price.toFixed(2)}
          </p>
        </div>

        <p className="text-sm text-gray-400 mt-1 line-clamp-1">
          {item.product?.category?.name ?? "Sin categoría"}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-300">Cantidad: {item.quantity}</p>

          <button
            onClick={() => removeFromCart(item.product.id)}
            className="p-1.5 rounded-lg hover:bg-red-600/20 text-red-500 hover:text-red-400 transition"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.li>
  );
});

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
      {/* BACKDROP */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden flex justify-end">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="pointer-events-auto w-screen max-w-md"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20, stiffness: 120 }}
              >
                <DialogPanel className="flex h-full flex-col bg-[#0b0b0b] text-white shadow-[0_0_40px_rgba(255,140,66,0.3)] border-l border-orange-500/20">

                  {/* HEADER */}
                  <div className="flex items-start justify-between px-6 py-5 border-b border-orange-500/30 bg-black/20 backdrop-blur-md">
                    <DialogTitle className="text-xl font-semibold text-orange-400 flex items-center gap-2">
                      <ShoppingBagIcon className="h-6 w-6" />
                      Tu carrito
                    </DialogTitle>

                    <button
                      onClick={closeDrawer}
                      className="text-gray-400 hover:text-orange-400 transition"
                    >
                      <XMarkIcon className="size-6" />
                    </button>
                  </div>

                  {/* LISTA */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 custom-scroll">
                    {!cart.length ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                      >
                        <ShoppingBagIcon className="h-16 w-16 text-gray-500 mb-4" />
                        <p className="text-lg font-medium text-gray-300">
                          Tu carrito está vacío
                        </p>

                        <button
                          onClick={closeDrawer}
                          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                        >
                          Seguir comprando
                        </button>
                      </motion.div>
                    ) : (
                      <motion.ul
                        layout
                        className="-my-6 divide-y divide-gray-700/40 space-y-2"
                      >
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
                    <div className="border-t border-orange-400/30 px-6 py-5 bg-black/30 backdrop-blur-md">
                      <div className="flex justify-between text-lg font-medium text-white mb-2">
                        <span>Subtotal</span>
                        <span className="text-orange-400">
                          S/.{subtotal.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 mb-4">
                        Envío e impuestos se calculan al finalizar la compra.
                      </p>

                      <a
                        href="/checkout"
                        className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-transform hover:scale-[1.02]"
                      >
                        Proceder al pago
                      </a>

                      <p className="text-center text-sm text-gray-400 mt-4">
                        o{" "}
                        <button
                          onClick={closeDrawer}
                          className="text-orange-400 hover:underline"
                        >
                          Seguir comprando →
                        </button>
                      </p>
                    </div>
                  )}
                </DialogPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Dialog>
  );
};

export default memo(SliderOver);
