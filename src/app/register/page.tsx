"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight,  CheckCircle } from "lucide-react";


// 👇 IMPORTACIÓN CORRECTA DE TU SERVICE
import { register } from "@/services/authService"; 

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectParam = searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : "";


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