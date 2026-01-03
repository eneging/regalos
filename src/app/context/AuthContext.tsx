"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getToken,
  getUser,
  login as loginService,
  logout as logoutService,
  saveAuth,
  clearAuth,
  fetchWithAuth,
} from "@/services/authService";

interface User {
  id: number;
  name: string;
  email: string;
  role: "free" | "registered" | "premium" | "admin";
  downloads_today?: number;
  last_download_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  isFree: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  downloadProduct: (productId: number) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // 🔄 Hidratar auth al cargar la app
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(storedUser);

    setHydrated(true);
  }, []);

  // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    const data = await loginService(email, password);

    if (data?.token && data?.user) {
      saveAuth(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return true;
    }

    return false;
  };

  // 🔓 LOGOUT
  const logout = async () => {
    try {
      await logoutService();
    } finally {
      clearAuth();
      setToken(null);
      setUser(null);
    }
  };

  // 🔄 REFRESCAR USUARIO
  const refreshUser = async () => {
    if (!token) return;

    try {
      const res = await fetchWithAuth("/api/me");
      if (!res.ok) return;

      const json = await res.json();

      const freshUser = json.data;
      saveAuth(token, freshUser);
      setUser(freshUser);
    } catch (e) {
      console.error("Error al refrescar usuario", e);
    }
  };

  // ⬇️ DESCARGA
  const downloadProduct = async (productId: number) => {
    try {
      const res = await fetchWithAuth(
        `/api/products/${productId}/download`,
        { method: "POST" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (user) {
        const updatedUser = {
          ...user,
          downloads_today: data.downloads_today,
          last_download_at: data.last_download_at,
        };

        saveAuth(token!, updatedUser);
        setUser(updatedUser);
      }

      return data.download_url;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  if (!hydrated) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token, // ✅ CORRECTO
        isAdmin: user?.role === "admin",
        isPremium: user?.role === "premium",
        isFree: user?.role === "free",
        login,
        logout,
        refreshUser,
        downloadProduct,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
