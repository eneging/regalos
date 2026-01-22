"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Heart } from "lucide-react"; // Agregué Heart 💖
import Link from "next/link";

// 👇 IMPORTACIÓN CORRECTA DE TU SERVICE
import { login, saveAuth } from "@/services/authService"; 

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/checkout";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  // Login Manual (Tu Backend)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Login
      const response = await login(formData.email, formData.password);
      
      // 2. Guardar sesión
      saveAuth(response.token, response.user);

      console.log("Login exitoso, redirigiendo a:", callbackUrl);

      // 3. Redirigir
      router.refresh(); 
      router.replace(callbackUrl);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden px-4">
      
      {/* Fondos animados (Tonos Rosa/Púrpura para Regalos) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Borde sutil rosa */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 ring-1 ring-white/5">
          
          <div className="text-center mb-8">
            <div className="relative w-40 h-12 mx-auto mb-4">
              <Image 
                src="https://res.cloudinary.com/dck9uinqa/image/upload/v1765050033/logopuertoricoblanco_abvacb.svg"
                alt="Puerto Rico Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight flex items-center justify-center gap-2">
                Bienvenido de nuevo <Heart className="text-rose-500 fill-rose-500 w-5 h-5" />
            </h1>
            <p className="text-zinc-400 text-sm">Ingresa para continuar con tu sorpresa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  // Focus ring en Rose
                  className="w-full bg-black/40 border border-zinc-700 text-white rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Contraseña</label>
                 <Link href="/forgot-password" className="text-xs text-rose-500 hover:text-rose-400 transition-colors">
                   ¿Olvidaste tu contraseña?
                 </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-zinc-700 text-white rounded-xl py-3.5 pl-10 pr-12 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              // Gradiente Rose/Pink
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-[1px] bg-zinc-800 flex-1" />
            <span className="text-zinc-600 text-xs uppercase font-medium">O continúa con</span>
            <div className="h-[1px] bg-zinc-800 flex-1" />
          </div>

          {/* Aquí irían los botones sociales si los tienes configurados */}

          <div className="mt-8 text-center text-zinc-500 text-sm">
             ¿Aún no tienes cuenta?{" "}
             <Link href="/register" className="text-white font-medium hover:text-rose-500 underline decoration-zinc-700 hover:decoration-rose-500 underline-offset-4 transition-all">
               Regístrate aquí
             </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}