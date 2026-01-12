"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "@/app/context/CartContext";
import AuthModal from "@/app/components/AuthModal";
import { useAuth } from "@/app/context/AuthContext";

/* =========================================
   ⚙️ 0. CONSTANTES Y UTILIDADES
   ========================================= */

// 🛡️ Fallback seguro para la URL del Backend
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// 🎨 TUS ESTILOS PERSONALIZADOS (Copiados de tu ejemplo)
const CULQI_APPEARANCE = {
  theme: "default",
  hiddenCulqiLogo: false,
  hiddenBannerContent: false,
  hiddenBanner: false,
  hiddenToolBarAmount: false,
  menuType: "sidebar", // default / sidebar / sliderTop / select
  buttonCardPayText: "Pagar S/", // Texto personalizado
  // logo: 'https://tu-url-de-logo.com/logo.png', // Descomenta y pon tu logo si quieres
  defaultStyle: {
    bannerColor: "#0A2540", // Ejemplo: Azul oscuro
    buttonBackground: "#EFC078", // Ejemplo: Dorado
    menuColor: "#0A2540",
    linksColor: "#EFC078",
    buttonTextColor: "#1A1B25",
    priceColor: "#EFC078",
  },
  variables: {
    fontFamily: "sans-serif", // Puedes cambiar a 'monospace' si prefieres
    fontWeightNormal: "500",
    borderRadius: "8px",
    colorBackground: "#0A2540",
    colorPrimary: "#EFC078",
    colorPrimaryText: "#1A1B25",
    colorText: "white",
    colorTextSecondary: "#cbd5e1",
    colorTextPlaceholder: "#727F96",
    colorIconTab: "white",
    colorLogo: "light",
  },
  rules: {
    ".Culqi-Label": {
        color: "white",
    },
    ".Culqi-Input": {
        border: "1px solid #EFC078",
        color: "white",
    },
    ".Culqi-Input:focus": {
        border: "2px solid #EFC078",
    },
    ".Culqi-Button": {
        background: "#EFC078",
        color: "#1A1B25",
        fontWeight: "bold"
    },
    // Puedes agregar más reglas CSS aquí según tu ejemplo original
  },
};

const CULQI_CUSTOM_FIELDS = {
  customInput: [
    {
      label: "DNI",
      typeValidate: "DNI",
      placeholder: "Ingrese su DNI",
      id: "dni", 
      minLength: 8,
      maxLength: 8,
      doubleSpan: true,
    },
  ],
  card: [
    {
      label: "DNI Titular",
      typeValidate: "DNI",
      placeholder: "DNI del titular",
      id: "dni_titular",
      minLength: 8,
      maxLength: 8,
      doubleSpan: true,
    },
  ],
};

const CULQI_CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY!,
  TITLE: process.env.NEXT_PUBLIC_CULQI_TITLE || "Puerto Rico Restobar",
  CURRENCY: "PEN",
};

/* =========================================
   📚 1. TIPOS
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
  metadata?: any;
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
    paymentMethodsSort?: string[]; // 👈 Agregado para ordenar
    customFields?: typeof CULQI_CUSTOM_FIELDS;
  };
  appearance?: typeof CULQI_APPEARANCE; // 👈 Agregado para estilos
}

/* =========================================
   🪝 2. HOOK SDK
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
   💻 3. COMPONENTE PRINCIPAL
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
  const { token, isAuthenticated } = useAuth();
  
  const isCulqiReady = useCulqiSDK();
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const culqiRef = useRef<CulqiInstance | null>(null);

  const getValidToken = useCallback(() => {
    if (!isAuthenticated || !token) {
      toast.info("Tu sesión expiró. Por favor inicia sesión nuevamente.");
      setShowAuth(true);
      return null;
    }
    return token;
  }, [isAuthenticated, token]);

  const handlePay = useCallback(async () => {
    const activeToken = getValidToken();
    if (!activeToken) return;

    if (!userData.first_name || !userData.last_name || !userData.address || userData.phone.length < 9) {
      toast.warning("Por favor completa todos tus datos correctamente.");
      return;
    }

    if (!isCulqiReady || !window.CulqiCheckout) {
      toast.error("Cargando sistema de pagos... intente nuevamente.");
      return;
    }

    setLoading(true);

    try {
      // 1. CREAR ORDEN
      const resOrder = await fetch(
        `${API_BASE}/orders`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`,
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

      if (resOrder.status === 401) {
        setLoading(false);
        setShowAuth(true);
        return;
      }

      const dataOrder = await resOrder.json();
      if (!resOrder.ok || !dataOrder.success) {
        throw new Error(dataOrder.message || "No se pudo crear la orden.");
      }

      const dynamicOrderId = dataOrder.data.order_id;

      // 2. CONFIGURAR CULQI
      const paymentMethodsConfig = {
        tarjeta: true,
        yape: true,
        billetera: true,
        bancaMovil: true,
        agente: true,
        cuotealo: true,
      };

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
          paymentMethods: paymentMethodsConfig,
          paymentMethodsSort: Object.keys(paymentMethodsConfig), // Ordenar según config
          customFields: CULQI_CUSTOM_FIELDS,
        },
        appearance: CULQI_APPEARANCE, // 👈 AQUÍ INYECTAMOS TUS ESTILOS
      };

      const culqi = new window.CulqiCheckout(
        CULQI_CONFIG.PUBLIC_KEY,
        config
      );
      culqiRef.current = culqi;

      // 3. CALLBACK
      culqi.culqi = async () => {
        if (culqi.token) {
          setLoading(true); // Reiniciamos loading al procesar pago
          const tokenObj = culqi.token;
          const isCard = !!(tokenObj.iin && tokenObj.iin.bin);
          const sourceType = isCard ? 'card' : 'yape';
          const userMetadata = tokenObj.metadata || {}; 
          
          culqi.close();

          try {
            const payToken = getValidToken(); 
            if (!payToken) {
                setLoading(false);
                return;
            }

            const resPay = await fetch(
              `${API_BASE}/payments/culqi`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
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
                  metadata: userMetadata,
                }),
              }
            );

            if (resPay.status === 401) {
              setShowAuth(true); 
              return;
            }

            const dataPay = await resPay.json();
            
            if (!resPay.ok || !dataPay.success) {
              throw new Error(dataPay.errors || dataPay.message || "Pago rechazado.");
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
      setLoading(false); // Apagamos loading inicial al abrir modal

    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  }, [cart, total, userData, clearCart, router, isCulqiReady, getValidToken]);

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

      {showAuth && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
             <AuthModal onClose={() => setShowAuth(false)} />
        </div>
      )}
    </>
  );
}