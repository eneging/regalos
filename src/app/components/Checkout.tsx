"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as turf from "@turf/turf";
import { toast } from "react-toastify";
import { FiGift, FiMapPin, FiShoppingCart, FiUser, FiPhone, FiLoader, FiStar } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import YapeQR from "@/components/pay/YapeQr"; // ajusta ruta

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [locationUrl, setLocationUrl] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationObtained, setLocationObtained] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isDeliveryAllowed, setIsDeliveryAllowed] = useState<boolean | null>(null);
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null);
  const [offerMobileDelivery, setOfferMobileDelivery] = useState(false);
  const [acceptMobileDelivery, setAcceptMobileDelivery] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const router = useRouter();
  const telefono = "+51932563713";
  const storeLocation: [number, number] = [-14.079391897810437, -75.7364807231004];
  const maxDeliveryDistanceKm = 10000;
  const redZones: any[] = []; // mantén o ajusta

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setName(user.name || "");
      setPhone(user.phone || "");
    }
    setIsMobileView(window.innerWidth < 768);
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkDeliveryAvailability = (userLatitude: number, userLongitude: number) => {
    const userPoint = turf.point([userLongitude, userLatitude]);
    const storePoint = turf.point(storeLocation as any);
    for (const redZone of redZones) {
      if (turf.booleanPointInPolygon(userPoint, redZone)) {
        return { allowed: false, message: "🚫 Zona restringida", offerMobile: true };
      }
    }
    const distance = turf.distance(userPoint, storePoint, { units: "kilometers" });
    if (distance <= maxDeliveryDistanceKm) return { allowed: true, message: `Estás a ${distance.toFixed(1)} km`, offerMobile: false };
    return { allowed: false, message: `Distancia ${distance.toFixed(1)} km`, offerMobile: true };
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLoadingLocation(true);
    setLocationError(null);
    setDeliveryMessage(null);
    setIsDeliveryAllowed(null);
    setOfferMobileDelivery(false);
    setAcceptMobileDelivery(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        setLocationUrl(mapsUrl);
        setLocationObtained(true);
        setLoadingLocation(false);
        const { allowed, message, offerMobile } = checkDeliveryAvailability(latitude, longitude);
        setIsDeliveryAllowed(allowed);
        setDeliveryMessage(message);
        setOfferMobileDelivery(offerMobile);
      },
      (error) => {
        setLoadingLocation(false);
        setIsDeliveryAllowed(false);
        setDeliveryMessage("No se pudo obtener tu ubicación. Inténtalo nuevamente.");
        setOfferMobileDelivery(false);
        setLocationError("⚠️ Error obteniendo ubicación: revisa permisos o intenta otra vez.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const validate = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!phone.trim()) newErrors.phone = "El número de WhatsApp es obligatorio.";
    if (phone && !/^\+?\d{9,15}$/.test(phone)) newErrors.phone = "Número inválido.";
    if (locationObtained && isDeliveryAllowed === false && offerMobileDelivery && !acceptMobileDelivery) {
      newErrors.phone = newErrors.phone || "Debes aceptar el envío por móvil para continuar.";
    } else if (locationObtained && isDeliveryAllowed === false && !offerMobileDelivery) {
      newErrors.phone = newErrors.phone || deliveryMessage || "Tu ubicación no permite la entrega.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderNumber = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const YYYY = now.getFullYear();
    const MM = pad(now.getMonth() + 1);
    const DD = pad(now.getDate());
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PR-NAV-${YYYY}${MM}${DD}-${hh}${mm}${ss}-${rand}`;
  };

  const generarMensajeWhatsApp = (orderNum?: string) => {
    const items = cart.map((item) => `• ${item.product.name} x${item.quantity} = S/${(item.product.price * item.quantity).toFixed(2)}`).join("\n");
    const messageDate = new Date().toLocaleString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
    const numero = orderNum || orderNumber || generateOrderNumber();
    let mensaje = `🎄 *Nuevo Pedido Navideño* 🎅\n\n*Pedido N°: ${numero}*\nCliente: *${name}*\nTeléfono: ${phone}\n\n*Items:*\n${items}\n\n*Total:* S/${total.toFixed(2)}\n\n`;
    if (locationUrl) mensaje += `📍 Ubicación de entrega: ${locationUrl}\n\n`;
    if (deliveryMessage) mensaje += `🎁 ${deliveryMessage}\n\n`;
    mensaje += `_Enviado: ${messageDate} 🌟_`;
    return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await fetch("https://api.puertoricoica.online/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          location_url: locationUrl,
          total,
          items: cart.map((item) => ({ product_id: item.product.id, quantity: item.quantity, price: item.product.price })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error al guardar pedido:", data.message || data.error);
        toast.error("Ocurrió un error al registrar tu pedido. Intenta nuevamente.");
        return;
      }
      const apiOrderNumber = (data && (data.order_number || data.orderId || data.id)) || null;
      const finalOrderNumber = apiOrderNumber ? String(apiOrderNumber) : generateOrderNumber();
      setOrderNumber(finalOrderNumber);
      const whatsappUrl = generarMensajeWhatsApp(finalOrderNumber);
      window.open(whatsappUrl, "_blank");
      clearCart();
      toast.success(`🎄 Pedido enviado. N°: ${finalOrderNumber}`, { autoClose: 7000 });
      router.push("/");
    } catch (err) {
      console.error("Error al enviar pedido:", err);
      toast.error("❄️ Error enviando pedido. Revisa tu conexión.");
    }
  };

  const isFormValid = name.trim() && phone.trim() && Object.keys(errors).length === 0;
  const canSubmitOrder = isFormValid && cart.length > 0 && (!locationObtained || isDeliveryAllowed === true || (isDeliveryAllowed === false && offerMobileDelivery && acceptMobileDelivery));

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 bg-gradient-to-b from-[#0f2e18] via-[#240a0a] to-black text-white relative overflow-hidden">
      {/* Background y visual */}
      <div className="absolute inset-0 bg-[url('/assets/christmas-bg.png')] bg-cover bg-center opacity-10 pointer-events-none" />
      <div className={`relative z-10 w-full ${isMobileView ? "max-w-md" : "max-w-4xl"} bg-[#0a0f0d]/80 backdrop-blur-xl rounded-3xl shadow-[0_0_35px_rgba(220,38,38,0.25)] p-6 sm:p-10 border border-red-500/30`}>
        {/* ... Aquí reutilizas el markup del formulario y resumen (idéntico al que enviaste) */}
        {/* Para ahorrar espacio dejé el markup original igual; pega el HTML que ya tenías en tu Checkout con las variables de estado que están definidas arriba */}
        {/* ... */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
          {/* Inputs, buttons, etc (usa el HTML del checkout original que compartiste) */}
        </form>

        
      </div>
    </div>
  );
}
