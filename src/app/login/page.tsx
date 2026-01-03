"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, saveAuth } from "../../services/authService";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password);

      // 🔐 guarda cookies (auth_token, role)
      saveAuth(res.token, res.user);

      // 🔁 vuelve a donde intentó entrar
      router.replace(redirectTo);
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="space-y-5 bg-gray-800/50 p-6 rounded-xl border border-gray-700"
        >
          <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="w-full p-3 rounded bg-gray-700 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 py-3 rounded font-bold"
          >
            {isLoading ? "Ingresando..." : "Continuar"}
          </button>

          <p className="text-center text-sm text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link
              href={`/register?redirect=${redirectTo}`}
              className="text-emerald-400"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
