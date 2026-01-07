"use client";

import { useMemo, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CheckoutCulqi from "../components/CheckoutCulqi";
import { motion } from "framer-motion"; // Animaciones suaves
import { User, Phone, MapPin, Mail, CreditCard, ShoppingBag} from "lucide-react"; // Iconos

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();

  // --- SONIDOS E INTERACTIVIDAD ---
  const playSound = (type: "focus" | "success") => {
    // Asegúrate de tener estos archivos en public/sounds/
    const audio = new Audio(type === "focus" ? "/sounds/pop.mp3" : "/sounds/cheers.mp3");
    audio.volume = 0.2; // Volumen bajo para no molestar
    audio.play().catch(() => {}); // Catch por si el navegador bloquea autoplay
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    email: ""
  });

  // Efecto de carga de datos
  useEffect(() => {
    if (user) {
      const names = user.name ? user.name.split(" ") : ["", ""];
      setFormData((prev) => ({
        ...prev,
        first_name: names[0] || "",
        last_name: names.slice(1).join(" ") || "",
        email: user.email || "",
        phone: (user as any).phone || "",
        address: (user as any).address || ""
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart]);
  const delivery = subtotal >= 150 ? 0 : 10;
  const total = subtotal + delivery;

  // --- COMPONENTE DE INPUT REUTILIZABLE (MEJOR UX) ---
  const InputField = ({ label, name, type, icon: Icon, value, placeholder, disabled = false }: any) => (
    <div className="relative group">
      <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 ${disabled ? "text-gray-600" : "text-orange-500 group-focus-within:text-orange-400"} transition-colors`} />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => !disabled && playSound("focus")} // SONIDO AL ENFOCAR
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-4 py-3.5 rounded-xl border outline-none transition-all duration-300
            ${disabled 
              ? "bg-neutral-900/50 border-neutral-800 text-gray-500 cursor-not-allowed" 
              : "bg-neutral-900 border-neutral-800 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-lg"}
          `}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      
      {/* Fondo Decorativo Sutil */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-orange-900/20 to-transparent pointer-events-none" />
      
      <main className="relative max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Header Animado */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-2">
            Finalizar Compra
          </h1>
          <p className="text-gray-400">Estás a un paso de disfrutar tu pedido.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* 📝 COLUMNA 1: FORMULARIO (7 columnas en desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Tarjeta Glassmorphism */}
            <div className="bg-neutral-950/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-neutral-800 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <User className="text-orange-500 w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Información de Envío</h2>
              </div>

              <div className="space-y-5">
                <InputField 
                  label="Correo Electrónico" 
                  name="email" type="email" icon={Mail} 
                  value={formData.email} disabled 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="Nombre" name="first_name" type="text" icon={User}
                    value={formData.first_name} placeholder="Tu nombre" 
                  />
                  <InputField 
                    label="Apellido" name="last_name" type="text" icon={User}
                    value={formData.last_name} placeholder="Tu apellido" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="Celular" name="phone" type="tel" icon={Phone}
                    value={formData.phone} placeholder="999 999 999" 
                  />
                  <InputField 
                    label="Dirección" name="address" type="text" icon={MapPin}
                    value={formData.address} placeholder="Av. Principal 123" 
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 💰 COLUMNA 2: RESUMEN (Sticky en Desktop, 5 columnas) */}
          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="lg:col-span-5"
          >
            <div className="sticky top-8 space-y-6">
              
              <div className="bg-neutral-900 p-6 md:p-8 rounded-3xl border border-neutral-800 shadow-xl relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="text-orange-400 w-5 h-5" />
                  <h2 className="text-lg font-bold">Resumen del Pedido</h2>
                </div>

                {/* Lista de Items (Scrollable si es muy larga) */}
                <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-4 mb-6 pr-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm group">
                      <div className="flex items-center gap-3">
                         <span className="text-orange-500 font-bold bg-orange-500/10 w-6 h-6 flex items-center justify-center rounded text-xs">
                           {item.quantity}x
                         </span>
                         <span className="text-gray-300 group-hover:text-white transition-colors">
                           {item.product.name}
                         </span>
                      </div>
                      <span className="text-gray-400 font-medium">
                        S/{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cálculos */}
                <div className="border-t border-dashed border-neutral-700 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>S/{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? "text-green-400" : ""}>
                      {delivery === 0 ? "GRATIS" : `S/${delivery.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Total Grande */}
                <div className="flex justify-between items-end mt-6 pt-4 border-t border-neutral-700">
                  <span className="text-gray-300 font-medium">Total a Pagar</span>
                  <span className="text-3xl font-bold text-white tracking-tight">
                    S/{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botón / Integración de Pago con Animación */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => playSound("success")} // Sonido al intentar pagar
                className="relative z-10"
              >
                {/* Pasamos los datos y estilos al componente de pago */}
                <CheckoutCulqi 
                  total={total} 
                  userData={formData} 
                />
                
                {/* Overlay visual para unificar el diseño si Culqi es un botón simple */}
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <CreditCard className="w-3 h-3" />
                  <span>Pagos procesados de forma segura por Culqi</span>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}