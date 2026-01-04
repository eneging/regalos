"use client";

import { useMemo } from "react";
import { useCart } from "../context/CartContext";


import CheckoutCulqi from "../components/CheckoutCulqi";

export default function CheckoutPage() {
  const { cart } = useCart();

 



  // -----------------------
  //   CALCULOS DEL CARRITO
  // -----------------------
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
    [cart]
  );


  const delivery = subtotal >= 150 ? 0 : 10;
  const total = subtotal + delivery;

  // 🟠 Mercado Pago
  

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-4">
        Checkout Puerto Rico
      </h1>

      <div className="bg-neutral-900 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-3">Resumen del Pedido</h2>

        {cart.length === 0 && (
          <p className="text-center text-neutral-400 py-6">
            Tu carrito está vacío
          </p>
        )}

        {cart.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between py-2 border-b border-neutral-700"
          >
            <span>
              {item.product.name} x{item.quantity}
            </span>
            <span>
              S/{(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        <div className="text-right mt-4 space-y-1">
          <p>Subtotal: S/{subtotal.toFixed(2)}</p>
          <p>
            Delivery:{" "}
            {delivery === 0 ? "Gratis" : `S/${delivery.toFixed(2)}`}
          </p>
          <p className="text-2xl font-bold text-orange-400">
            Total: S/{total.toFixed(2)}
          </p>
        </div>

        {/* 🔐 CULQI (maneja auth internamente) */}
        <CheckoutCulqi total={total} />

      


      </div>
    </div>
  );
}
