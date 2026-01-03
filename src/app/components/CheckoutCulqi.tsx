"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import AuthModal from "@/app/components/AuthModal";

/* =========================
   🧠 HELPERS
========================= */
const isCulqiReady = () =>
  typeof window !== "undefined" && typeof (window as any).Culqi !== "undefined";

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}

export default function CheckoutCulqi({ total }: { total: number }) {
  const { cart, clearCart } = useCart();
  const { token, isAuthenticated, user } = useAuth();

  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [pendingPayment, setPendingPayment] = useState(false);

  /* =========================
     🔑 INIT CULQI (1 SOLA VEZ)
  ========================= */
  useEffect(() => {
    if (!isCulqiReady()) return;

    window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY!;
    console.log("✅ Culqi inicializado");
  }, []);

  /* =========================
     🟢 BOTÓN PAGAR
  ========================= */
  const handlePay = async () => {
    if (!isAuthenticated) {
      setPendingPayment(true);
      setShowAuth(true);
      return;
    }

    if (!isCulqiReady()) {
      toast.error("Culqi aún no está listo");
      return;
    }

    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    setLoading(true);

    try {
      /* 1️⃣ CREAR ORDEN */
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              product_id: item.product.id,
              quantity: item.quantity,
            })),
            payment_method: "culqi",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al crear la orden");
      }

      setOrderId(data.data.order_id);

      /* 2️⃣ CONFIGURAR CHECKOUT */
      window.Culqi.settings({
        title: "Puerto Rico",
        currency: "PEN",
        amount: Math.round(total * 100),
      });

      /* 3️⃣ ABRIR CHECKOUT */
      window.Culqi.open();
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  /* =========================
     🔁 RETOMAR DESPUÉS LOGIN
  ========================= */
  useEffect(() => {
    if (isAuthenticated && pendingPayment) {
      setPendingPayment(false);
      handlePay();
    }
  }, [isAuthenticated]);

  /* =========================
     💳 CALLBACK OFICIAL CULQI
  ========================= */
  useEffect(() => {
    if (!isCulqiReady()) return;

    window.culqi = async () => {
      if (!window.Culqi.token) {
        toast.error(window.Culqi.error?.user_message || "Error en Culqi");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/culqi`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              order_id: orderId,
              token: window.Culqi.token.id,
              email: window.Culqi.token.email,

              /* 🔴 CAMPOS OBLIGATORIOS */
              first_name: user?.name || "Cliente",
              last_name: "Puerto Rico",
              phone: "999999999",
              address: "Compra web",
            }),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Pago rechazado");
        }

        toast.success("Pago aprobado 🎉");
        clearCart();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
  }, [orderId, token, user]);

  /* =========================
     🖱️ UI
  ========================= */
  return (
    <>
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full mt-4 bg-purple-600 py-3 rounded-lg font-bold text-white disabled:opacity-60"
      >
        {loading ? "Procesando..." : "Pagar con Culqi 💳"}
      </button>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
