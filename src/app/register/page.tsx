"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { register, saveAuth } from "../../services/authService";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔁 a dónde volver después de registrarse
  const redirectTo = searchParams.get("redirect") || "/checkout";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !passwordConfirmation) {
      setError("Completa todos los campos");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      const res = await register(
        name,
        email,
        password,
        passwordConfirmation
      );

      // 🔐 guarda token + role en cookies
      saveAuth(res.token, res.user);

      // 🔁 vuelve a checkout o admin
      router.replace(redirectTo);
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleRegister}
          className="space-y-5 bg-gray-800/50 p-6 rounded-xl border border-gray-700"
        >
          <h1 className="text-2xl font-bold text-center">Crear Cuenta</h1>
          <p className="text-center text-gray-400 text-sm">
            Regístrate para continuar con tu compra
          </p>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full p-3 rounded bg-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full p-3 rounded bg-gray-700"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 py-3 rounded font-bold"
          >
            {isLoading ? "Creando cuenta..." : "Registrarme"}
          </button>

          <p className="text-center text-sm text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              href={`/login?redirect=${redirectTo}`}
              className="text-emerald-400"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
