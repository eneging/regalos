"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/app/context/CartContext";
//import { useAuth } from "@/app/context/AuthContext";
import AuthModal from "@/app/components/AuthModal";
import { getToken } from "@/services/authService"; // 👈 IMPORTANTE: Usamos el getter directo de cookies

/* =========================================
   ⚙️ 1. CONFIGURACIÓN
   ========================================= */
const CULQI_CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY!,
  TITLE: process.env.NEXT_PUBLIC_CULQI_TITLE || "Puerto Rico Restobar",
  CURRENCY: "PEN",
};

/* =========================================
   📚 2. TIPOS
   ========================================= */
declare global {
  interface Window {
    CulqiCheckout: new (publicKey: string, config: CulqiConfig) => CulqiInstance;
  }
}

interface CulqiToken {
  id: string;
  email: string;
  iin?: { bin: string }; 
}

interface CulqiInstance {
  token?: CulqiToken;
  order?: { payment_code: string };
  error?: { user_message: string };
  culqi: () => void;
  open: () => void;
  close: () => void;
}

interface CulqiConfig {
  settings: {
    title: string;
    currency: string;
    amount: number;
  };
  client: { email: string };
  options: {
    lang: string;
    installments: boolean;
    modal: boolean;
    paymentMethods: {
      tarjeta: boolean;
      yape: boolean;
      billetera: boolean;
      bancaMovil: boolean;
      agente: boolean;
      cuotealo: boolean;
    };
  };
  appearance?: any;
}

/* =========================================
   🪝 3. HOOK SDK
   ========================================= */
const useCulqiSDK = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Error cargando ${src}`));
        document.body.appendChild(script);
      });
    };

    const init = async () => {
      try {
        await Promise.all([
          loadScript("https://3ds.culqi.com"),
          loadScript("https://js.culqi.com/checkout-js"),
        ]);
        setIsReady(true);
      } catch (error) {
        console.error("Fallo SDK Culqi", error);
      }
    };
    init();
  }, []);

  return isReady;
};

/* =========================================
   💻 4. COMPONENTE PRINCIPAL
   ========================================= */
interface CheckoutCulqiProps {
  total: number;
  userData: {
    first_name: string;
    last_name: string;
    email: string;
    address: string;
    phone: string;
  };
}

export default function CheckoutCulqi({ total, userData }: CheckoutCulqiProps) {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  
  // Usamos useAuth para el estado general, pero getToken() para el valor más fresco
 // const { isAuthenticated, user } = useAuth(); 
  
  const isCulqiReady = useCulqiSDK();
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const culqiRef = useRef<CulqiInstance | null>(null);

  // Función auxiliar para obtener el token válido
  const getValidToken = () => {
    const token = getToken(); 
    
    // Leemos directamente de la cookie
    if (!token) {
      toast.info("Tu sesión expiró. Por favor inicia sesión nuevamente.");
      setShowAuth(true);
      return null;
    }
    return token;
  };

  const handlePay = useCallback(async () => {
    // 1. Validar Token FRESCO antes de empezar
    const activeToken = getValidToken();
    console.log("🔍 DEBUG TOKEN:", activeToken); // <--- ¿Esto imprime null, undefined o el string?
    console.log("🍪 DEBUG COOKIES:", document.cookie); // <--- ¿Ves tu cookie de sesión aquí?
    if (!activeToken) return; // Si no hay token, el modal ya se abrió en getValidToken

    // 2. Validaciones de Datos
    if (!userData.first_name || !userData.last_name) {
      toast.warning("Por favor completa tu nombre y apellido.");
      return;
    }
    if (!userData.address || userData.address.length < 5) {
      toast.warning("Ingresa una dirección válida para el envío.");
      return;
    }
    if (!userData.phone || userData.phone.length < 9) {
      toast.warning("Ingresa un número de celular válido.");
      return;
    }

    if (!isCulqiReady || !window.CulqiCheckout) {
      toast.error("El sistema de pagos está cargando, intenta en unos segundos.");
      return;
    }

    setLoading(true);

    try {
      // ------------------------------------------
      // PASO 1: CREAR ORDEN EN BACKEND
      // ------------------------------------------
      const resOrder = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${activeToken}`, // Usamos el token fresco
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              product_id: item.product.id,
              quantity: item.quantity,
            })),
            payment_method: "culqi",
            address: userData.address,
            phone: userData.phone,
          }),
        }
      );

      // Manejo específico de 401 (Token vencido)
      if (resOrder.status === 401) {
        setLoading(false);
        toast.warning("Tu sesión ha expirado.");
        setShowAuth(true);
        return;
      }

      const dataOrder = await resOrder.json();
      if (!resOrder.ok || !dataOrder.success) {
        throw new Error(dataOrder.message || "No se pudo crear la orden.");
      }

      const dynamicOrderId = dataOrder.data.order_id;

      // ------------------------------------------
      // PASO 2: ABRIR PASARELA CULQI
      // ------------------------------------------
      const config: CulqiConfig = {
        settings: {
          title: CULQI_CONFIG.TITLE,
          currency: CULQI_CONFIG.CURRENCY,
          amount: Math.round(total * 100),
        },
        client: { email: userData.email },
        options: {
          lang: "auto",
          installments: true,
          modal: true,
          paymentMethods: {
            tarjeta: true,
            yape: false,
            billetera: true,
            bancaMovil: true,
            agente: true,
            cuotealo: true,
          },
        },
      };

      const culqi = new window.CulqiCheckout(
        CULQI_CONFIG.PUBLIC_KEY,
        config
      );
      culqiRef.current = culqi;

      // DEFINIR CALLBACK DE CULQI
      culqi.culqi = async () => {
        if (culqi.token) {
          const tokenObj = culqi.token;
          const isCard = !!(tokenObj.iin && tokenObj.iin.bin);
          const sourceType = isCard ? 'card' : 'yape';

          culqi.close();
          setLoading(true); // Mantenemos loading mientras procesamos el pago

          try {
            // Re-validamos token por si acaso pasó mucho tiempo en el modal
            const payToken = getValidToken();
            if (!payToken) {
                setLoading(false);
                return;
            }

            // ------------------------------------------
            // PASO 3: PROCESAR PAGO EN BACKEND
            // ------------------------------------------
            const resPay = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/culqi`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${payToken}`,
                },
                body: JSON.stringify({
                  order_id: dynamicOrderId,
                  token: tokenObj.id,
                  email: tokenObj.email,
                  source_type: sourceType,
                  first_name: userData.first_name,
                  last_name: userData.last_name,
                  address: userData.address,
                  phone: userData.phone,
                }),
              }
            );

            if (resPay.status === 401) {
              setLoading(false);
              toast.warning("Sesión expirada durante el pago.");
              setShowAuth(true);
              return;
            }

            const dataPay = await resPay.json();
            
            if (!resPay.ok || !dataPay.success) {
              throw new Error(
                dataPay.errors || dataPay.message || "El pago fue rechazado."
              );
            }

            toast.success("¡Pago Aprobado! 🎉");
            clearCart();
            router.push(`/checkout/success?order_id=${dynamicOrderId}`);

          } catch (err: any) {
            toast.error(err.message);
          } finally {
            setLoading(false);
          }
        } else if (culqi.error) {
          console.error(culqi.error);
          toast.error(culqi.error.user_message);
          setLoading(false);
        }
      };

      culqi.open();

    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  }, [
    cart, 
    total, 
    userData, 
    clearCart, 
    router, 
    isCulqiReady
  ]);

  return (
    <>
      <button
        onClick={handlePay}
        disabled={loading || !isCulqiReady}
        className={`w-full mt-4 py-3 rounded-lg font-bold text-white transition-all shadow-lg flex justify-center items-center gap-2
          ${loading || !isCulqiReady 
            ? 'bg-gray-600 cursor-not-allowed opacity-70' 
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/30'}
        `}
      >
        {loading ? (
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Procesando...</span>
            </div>
        ) : (
            <span>Pagar S/ {total.toFixed(2)}</span>
        )}
      </button>

      {/* Modal de Autenticación forzado si falla el token */}
      {showAuth && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
             <AuthModal onClose={() => setShowAuth(false)} />
        </div>
      )}
    </>
  );
}