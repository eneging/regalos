"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight,  CheckCircle } from "lucide-react";
import { signIn } from "next-auth/react"; 

// 👇 IMPORTACIÓN CORRECTA DE TU SERVICE
import { register } from "@/services/authService"; 

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectParam = searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : "";
  const callbackUrl = searchParams.get("redirect") || "/checkout";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "", // 👀 Ojo con el nombre del campo, debe coincidir con tu API
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSocialRegister = async (provider: "google" | "facebook") => {
    await signIn(provider, { callbackUrl });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Usamos 'register' de tu authService
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.password_confirmation
      );
      
      // 2. Redirección al Login
      router.push(`/login${redirectParam}`);

    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden px-4 py-10">
      
      {/* Fondos animados */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[500px] relative z-10"
      >
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
          
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
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Crea tu cuenta</h1>
            <p className="text-zinc-400 text-sm">Únete a nosotros para disfrutar de ofertas exclusivas</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Nombre Completo</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className="w-full bg-black/40 border border-zinc-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-black/40 border border-zinc-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Contraseña</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-zinc-700 text-white rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Confirmar</label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors">
                      <CheckCircle size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password_confirmation" 
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-zinc-700 text-white rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-600"
                    />
                     <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
            </div>

            <AnimatePresence>
                {error && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 overflow-hidden"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {error}
                </motion.div>
                )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-900/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <span>Registrarme</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-[1px] bg-zinc-800 flex-1" />
            <span className="text-zinc-600 text-xs uppercase font-medium">O regístrate con</span>
            <div className="h-[1px] bg-zinc-800 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button type="button" onClick={() => handleSocialRegister("google")} className="flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-xl font-medium hover:bg-zinc-200 transition-colors text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
             </button>
             <button type="button" onClick={() => handleSocialRegister("facebook")} className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2.5 rounded-xl font-medium hover:bg-[#166fe5] transition-colors text-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
             </button>
          </div>

          <div className="mt-8 text-center text-zinc-500 text-sm">
             ¿Ya tienes una cuenta?{" "}
             <Link href={`/login${redirectParam}`} className="text-white font-medium hover:text-amber-500 underline decoration-zinc-700 hover:decoration-amber-500 underline-offset-4 transition-all">
                Inicia sesión aquí
             </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}