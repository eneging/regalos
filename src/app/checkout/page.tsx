"use client";

import { useMemo, useState, useEffect, memo, useCallback } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CheckoutCulqi from "../components/CheckoutCulqi";
import { motion, AnimatePresence } from "framer-motion"; 
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  ShoppingBag, 
  AlertCircle, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  Gift, 
  
} from "lucide-react";

// ----------------------------------------------------------------------
// 1. INTERFACES Y TIPADO
// ----------------------------------------------------------------------

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: any; 
  error?: string;
}

// ----------------------------------------------------------------------
// 2. COMPONENTE INPUTFIELD (Estilo Rose)
// ----------------------------------------------------------------------
const InputField = memo(({ 
  label, 
  icon: Icon, 
  error,
  disabled = false,
  ...props 
}: InputFieldProps) => (
  <div className="relative group w-full">
    <div className="flex justify-between items-end mb-2 ml-1">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      {error && (
        <span className="text-rose-400 text-[10px] font-medium flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full animate-fadeIn">
          <AlertCircle className="w-3 h-3" /> Requerido
        </span>
      )}
    </div>
    
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className={`h-5 w-5 transition-colors duration-300 ${
          disabled ? "text-gray-600" : 
          error ? "text-rose-400" : 
          "text-rose-500 group-focus-within:text-rose-400"
        }`} />
      </div>
      <input
        disabled={disabled}
        {...props}
        className={`
          w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all duration-300 text-base
          placeholder:text-gray-600
          ${disabled 
            ? "bg-neutral-900/50 border-neutral-800 text-gray-500 cursor-not-allowed" 
            : error
              ? "bg-rose-900/10 border-rose-500/30 text-rose-100 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
              : "bg-neutral-900 border-neutral-800 text-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 hover:border-neutral-700"
          }
        `}
      />
    </div>
  </div>
));

InputField.displayName = "InputField";

// ----------------------------------------------------------------------
// 3. COMPONENTE PRINCIPAL CHECKOUT
// ----------------------------------------------------------------------
export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  // Estado del Formulario
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    email: ""
  });

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Carga inicial
  useEffect(() => {
    if (user) {
      const names = user.name ? user.name.split(" ") : ["", ""];
      setFormData((prev) => ({
        ...prev,
        first_name: prev.first_name || names[0] || "",
        last_name: prev.last_name || names.slice(1).join(" ") || "",
        email: user.email || "",
        phone: prev.phone || (user as any).phone || "",
        address: prev.address || (user as any).address || ""
      }));
    }
  }, [user]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  }, []);

  const isFormValid = useMemo(() => {
    return (
      formData.first_name.trim().length > 1 &&
      formData.last_name.trim().length > 1 &&
      formData.address.trim().length > 5 &&
      formData.phone.trim().length >= 9 &&
      formData.email.includes("@")
    );
  }, [formData]);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart]);
  const delivery = subtotal >= 150 ? 0 : 10;
  const total = subtotal + delivery;

  const handleWhatsAppCheckout = () => {
    if (!isFormValid) return;

    const PHONE_NUMBER = "51932563713"; 

    let message = "*HOLA! 💝 QUIERO ENVIAR UN DETALLE* 🎁\n\n";
    message += `👤 *Cliente:* ${formData.first_name} ${formData.last_name}\n`;
    message += `📞 *Teléfono:* ${formData.phone}\n`;
    message += `📍 *Dirección:* ${formData.address}\n`;
    message += `📧 *Email:* ${formData.email}\n\n`;
    
    message += `📝 *PEDIDO:*\n`;
    cart.forEach(item => {
      const itemTotal = (item.product.price * item.quantity).toFixed(2);
      message += `• ${item.quantity} x ${item.product.name} (S/ ${itemTotal})\n`;
    });

    message += `\n--------------------------\n`;
    message += `🚚 *Envío:* ${delivery === 0 ? "GRATIS" : `S/ ${delivery.toFixed(2)}`}\n`;
    message += `💰 *TOTAL: S/ ${total.toFixed(2)}*\n\n`;
    message += `💬 *Quedo a la espera para coordinar la entrega.* ✨`;

    clearCart();

    const url = `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    // 🔴 CAMBIO CLAVE 1: Eliminamos bg-black del contenedor principal y lo dejamos transparente
    // Usamos relative para que el contenido fluya normalmente
    <div className="min-h-screen relative overflow-x-hidden font-sans pb-24 selection:bg-rose-500/30">
      
      {/* 🔴 CAMBIO CLAVE 2: FONDO FIJO CON Z-INDEX NEGATIVO (-1) */}
      {/* Esto asegura que el fondo negro siempre esté detrás de todo, incluido el footer */}
      <div className="fixed inset-0 bg-black z-[-1]" />
      
      {/* Luces Ambientales (También en z-index negativo) */}
      <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-rose-950/30 via-black/80 to-black pointer-events-none z-[-1]" />
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none z-[-1]" />
      <div className="fixed top-40 -left-20 w-72 h-72 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none z-[-1]" />
      
      {/* 🔴 CAMBIO CLAVE 3: El contenido es relative pero sin z-index alto innecesario */}
      <main className="relative max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-16 mt-6"
        >
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"/>
            <span className="text-xs font-bold tracking-widest text-gray-300 uppercase">Envío Seguro</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3">
            Finalizar <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-600">Pedido</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-lg mx-auto flex items-center justify-center gap-2">
            Estamos listos para preparar tu sorpresa. <Gift size={18} className="text-rose-500"/>
          </p>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* COLUMNA 1: FORMULARIO */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 order-1"
          >
            <div className="bg-neutral-950/50 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl shadow-rose-900/10 relative">
              
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-700 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white transform -rotate-3">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Datos de Entrega</h2>
                  <p className="text-sm text-gray-500">¿A quién vamos a sorprender hoy?</p>
                </div>
              </div>

              <div className="space-y-6">
                <InputField 
                  label="Correo Electrónico" 
                  name="email" 
                  type="email" 
                  icon={Mail} 
                  value={formData.email} 
                  onChange={handleChange}
                  disabled 
                  error={!formData.email && touchedFields.email ? "Requerido" : undefined}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    label="Nombre" 
                    name="first_name" 
                    type="text" 
                    icon={User}
                    value={formData.first_name} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tu nombre" 
                    autoComplete="given-name"
                    error={!formData.first_name && touchedFields.first_name ? "Requerido" : undefined}
                  />
                  <InputField 
                    label="Apellido" 
                    name="last_name" 
                    type="text" 
                    icon={User}
                    value={formData.last_name} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tus apellidos" 
                    autoComplete="family-name"
                    error={!formData.last_name && touchedFields.last_name ? "Requerido" : undefined}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    label="Celular" 
                    name="phone" 
                    type="tel"
                    inputMode="numeric"
                    icon={Phone}
                    value={formData.phone} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="999 999 999" 
                    autoComplete="tel"
                    error={formData.phone.length < 9 && touchedFields.phone ? "Inválido" : undefined}
                  />
                  <InputField 
                    label="Dirección de Entrega" 
                    name="address" 
                    type="text" 
                    icon={MapPin}
                    value={formData.address} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Calle, Número, Referencia..." 
                    autoComplete="street-address"
                    error={!formData.address && touchedFields.address ? "Requerido" : undefined}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* COLUMNA 2: RESUMEN Y PAGO */}
          <motion.div 
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="lg:col-span-5 order-2"
          >
            <div className="sticky top-8">
              {/* Borde rosa sutil */}
              <div className="bg-gradient-to-b from-neutral-900 to-black p-6 md:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-rose-500/20 transition-colors">
                
                {/* Glow decorativo Rose */}
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <ShoppingBag className="text-rose-500 w-5 h-5" />
                  <h2 className="text-lg font-bold tracking-wide uppercase text-gray-200">Resumen</h2>
                </div>

                {/* Lista de Items */}
                <div className="max-h-60 overflow-y-auto pr-2 mb-8 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm py-3 border-b border-white/5 last:border-0 group-hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-bold text-rose-500 border border-white/5">
                            {item.quantity}
                          </div>
                          <span className="text-gray-300 font-medium line-clamp-1">{item.product.name}</span>
                      </div>
                      <span className="text-white font-semibold">
                        S/ {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="space-y-3 py-6 border-t border-dashed border-white/10 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Costo de Envío</span>
                    <span className={delivery === 0 ? "text-green-400 font-bold bg-green-900/20 px-2 rounded" : ""}>
                      {delivery === 0 ? "GRATIS" : `S/ ${delivery.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end pb-8 border-b border-white/10 mb-8">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total a Pagar</span>
                    <span className="text-4xl font-black text-white tracking-tighter">
                      <span className="text-lg font-medium text-rose-500 mr-1">S/</span>
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* ZONA DE PAGO Y ACCIÓN */}
                <div className="relative z-20 space-y-5">
                    
                    {/* Mensaje de validación */}
                    <AnimatePresence>
                      {!isFormValid && Object.keys(touchedFields).length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-xs text-rose-300 bg-rose-900/20 border border-rose-500/20 p-3 rounded-xl mb-2"
                        >
                           <AlertCircle className="w-4 h-4 text-rose-500 shrink-0"/>
                           <span>Completa los datos para ver las opciones de pago.</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* BOTÓN 1: CULQI */}
                    <div className={`transition-all duration-300 ${!isFormValid ? "opacity-40 pointer-events-none grayscale blur-[1px]" : "opacity-100"}`}>
                      <CheckoutCulqi 
                        total={total} 
                        userData={formData} 
                      />
                    </div>

                    {/* Separador */}
                    <div className="flex items-center gap-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">O Prefiere</span>
                      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                    </div>

                    {/* BOTÓN 2: WHATSAPP */}
                    <button
                      onClick={handleWhatsAppCheckout}
                      disabled={!isFormValid}
                      className={`
                        group relative w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden
                        ${!isFormValid 
                          ? "bg-neutral-800 text-neutral-600 cursor-not-allowed border border-white/5" 
                          : "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-green-900/30 hover:scale-[1.02] active:scale-[0.98]"
                        }
                      `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      
                      <MessageCircle className="w-6 h-6 fill-current" />
                      <div className="flex flex-col items-start leading-none">
                        <span className="text-xs font-medium opacity-90">Atención Personalizada</span>
                        <span className="font-bold text-lg">Pagar por WhatsApp</span>
                      </div>
                      {isFormValid && <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
                    </button>
                  
                  <div className="pt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-neutral-500">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    Pagos Encriptados & Seguros
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}