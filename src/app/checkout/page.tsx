"use client";

import { useMemo, useState, useEffect, memo } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CheckoutCulqi from "../components/CheckoutCulqi";
import { motion } from "framer-motion"; 
import { User, Phone, MapPin, Mail, ShoppingBag, CreditCard } from "lucide-react";

// ----------------------------------------------------------------------
// 1. COMPONENTE INPUTFIELD (SACADO AFUERA para evitar pérdida de foco)
// ----------------------------------------------------------------------
// Usamos 'memo' para que no se renderice si sus props no cambian
const InputField = memo(({ 
  label, 
  name, 
  type, 
  icon: Icon, 
  value, 
  onChange, // Pasamos la función
  placeholder, 
  disabled = false,
  autoComplete, // Importante para UX móvil
  inputMode   // Importante para abrir teclado numérico
}: any) => (
  <div className="relative group w-full">
    <label className="block text-xs font-bold text-gray-400 mb-2 ml-1 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className={`h-5 w-5 ${disabled ? "text-gray-600" : "text-orange-500 group-focus-within:text-orange-400"} transition-colors`} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete} // UX: Permite autocompletar del navegador
        inputMode={inputMode}       // UX: Abre teclado numérico en móvil
        // UX Móvil: text-base evita que iOS haga zoom al hacer focus
        className={`
          w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all duration-300 text-base
          placeholder:text-gray-600
          ${disabled 
            ? "bg-neutral-900/50 border-neutral-800 text-gray-500 cursor-not-allowed" 
            : "bg-neutral-900 border-neutral-800 text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-lg"}
        `}
      />
    </div>
  </div>
));

InputField.displayName = "InputField";

// ----------------------------------------------------------------------
// 2. COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------
export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    email: ""
  });

  // Carga de datos inicial
  useEffect(() => {
    if (user) {
      const names = user.name ? user.name.split(" ") : ["", ""];
      // Solo actualizamos si los campos están vacíos para no borrar lo que el usuario escribe
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart]);
  const delivery = subtotal >= 150 ? 0 : 10;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden font-sans pb-20">
      
      {/* Fondo Decorativo */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-900/20 via-black/50 to-black pointer-events-none z-0" />
      
      <main className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Header Compacto */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12 mt-4"
        >
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
            Finalizar <span className="text-orange-500">Compra</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Completa tus datos para el envío express 🚀</p>
        </motion.div>

        {/* Layout Responsive: Columna inversa en móvil para ver el total al final o formulario primero */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* 📝 COLUMNA 1: FORMULARIO */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 order-1" // En móvil va primero
          >
            <div className="bg-neutral-950/80 backdrop-blur-xl p-5 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl ring-1 ring-white/5">
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <User className="text-white w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-none">Datos de Envío</h2>
                  <p className="text-xs text-gray-500 mt-1">¿A dónde enviamos tu pedido?</p>
                </div>
              </div>

              <div className="space-y-6">
                <InputField 
                  label="Correo Electrónico" 
                  name="email" 
                  type="email" 
                  icon={Mail} 
                  value={formData.email} 
                  onChange={handleChange} // Importante pasar el handler
                  disabled 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    label="Nombre" 
                    name="first_name" 
                    type="text" 
                    icon={User}
                    value={formData.first_name} 
                    onChange={handleChange}
                    placeholder="Ej. Juan" 
                    autoComplete="given-name"
                  />
                  <InputField 
                    label="Apellido" 
                    name="last_name" 
                    type="text" 
                    icon={User}
                    value={formData.last_name} 
                    onChange={handleChange}
                    placeholder="Ej. Pérez" 
                    autoComplete="family-name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    label="Celular" 
                    name="phone" 
                    type="tel" // UX: Teclado telefónico
                    inputMode="numeric" // UX: Fuerza teclado numérico en iOS/Android
                    icon={Phone}
                    value={formData.phone} 
                    onChange={handleChange}
                    placeholder="999 999 999" 
                    autoComplete="tel"
                  />
                  <InputField 
                    label="Dirección" 
                    name="address" 
                    type="text" 
                    icon={MapPin}
                    value={formData.address} 
                    onChange={handleChange}
                    placeholder="Calle, Número, Distrito..." 
                    autoComplete="street-address"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 💰 COLUMNA 2: RESUMEN Y PAGO */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="lg:col-span-5 order-2"
          >
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
                
                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-600/20 rounded-full blur-[80px] pointer-events-none" />

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <ShoppingBag className="text-orange-500 w-5 h-5" />
                  <h2 className="text-lg font-bold">Resumen</h2>
                </div>

                {/* Lista scrollable */}
                <div className="max-h-64 overflow-y-auto pr-2 mb-6 space-y-3 
                  scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-start text-sm py-2 border-b border-white/5 last:border-0">
                      <div className="flex gap-3">
                         <span className="font-bold text-orange-500 whitespace-nowrap">{item.quantity} x</span>
                         <span className="text-gray-300 leading-snug">{item.product.name}</span>
                      </div>
                      <span className="text-white font-medium whitespace-nowrap">
                        S/ {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="space-y-3 py-4 border-t border-dashed border-white/10 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Envío</span>
                    <span className={delivery === 0 ? "text-green-400 font-bold" : ""}>
                      {delivery === 0 ? "GRATIS" : `S/ ${delivery.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Total Final */}
                <div className="flex justify-between items-end mt-2 pt-4 border-t border-white/10 mb-6">
                  <span className="text-gray-300 font-medium">Total a Pagar</span>
                  <span className="text-4xl font-black text-white tracking-tighter">
                    <span className="text-base font-normal text-orange-500 mr-1">S/</span>
                    {total.toFixed(2)}
                  </span>
                </div>

                {/* PAGO */}
                <div className="relative z-20">
                  <CheckoutCulqi 
                    total={total} 
                    userData={formData} 
                  />
                  <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-neutral-500">
                    <CreditCard className="w-3 h-3" />
                    Pagos 100% Seguros
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