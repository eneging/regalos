"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

interface Props {
  onClose: () => void;
}

export default function AuthModal({ onClose }: Props) {
  const { login, isAuthenticated } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // 🔑 Si ya está logueado, cerramos modal automáticamente
  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (isRegister) {
        // 🟢 REGISTRO
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Error al registrarse");
        }

        toast.success("Cuenta creada correctamente 🎉");

        // auto login después de registro
        const success = await login(form.email, form.password);
        if (!success) throw new Error("Error al iniciar sesión después del registro");
      } else {
        // 🟢 LOGIN
        const success = await login(form.email, form.password);
        if (!success) throw new Error("Credenciales inválidas");
        toast.success("Bienvenido 👋");
      }

      onClose();
    } catch (e: any) {
      toast.error(e.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-md relative">
        {/* cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        {isRegister && (
          <input
            name="name"
            placeholder="Nombre"
            className="w-full mb-3 p-2 rounded bg-neutral-800"
            onChange={handleChange}
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Correo"
          className="w-full mb-3 p-2 rounded bg-neutral-800"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="w-full mb-3 p-2 rounded bg-neutral-800"
          onChange={handleChange}
        />

        {isRegister && (
          <input
            name="password_confirmation"
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full mb-3 p-2 rounded bg-neutral-800"
            onChange={handleChange}
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-2 bg-orange-500 py-2 rounded-lg font-bold text-black"
        >
          {loading
            ? "Procesando..."
            : isRegister
            ? "Registrarme"
            : "Entrar"}
        </button>

        <p
          onClick={() => setIsRegister(!isRegister)}
          className="text-center text-sm text-orange-400 mt-4 cursor-pointer"
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </p>
      </div>
    </div>
  );
}
