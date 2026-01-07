"use client";

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* =====================================================
   COOKIE OPTIONS
===================================================== */
function cookieOptions(days = 7) {
  return {
    expires: days,
    sameSite: "Lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

/* =====================================================
   AUTH REQUESTS
===================================================== */

export async function login(email: string, password: string) {
  if (!API_URL) {
    throw new Error("API no configurada");
  }

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    throw new Error(body?.message || "Credenciales inválidas");
  }

  return {
    user: body.data.user,
    token: body.data.token,
  };
}

export async function register(
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) {
  if (!API_URL) {
    throw new Error("API no configurada");
  }

  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation,
    }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    throw new Error(body?.message || "Error en el registro");
  }

  return {
    user: body.data.user,
    token: body.data.token,
  };
}

/* =====================================================
   AUTH STORAGE (CLIENT ONLY)
===================================================== */

export function saveAuth(token: string, user: any, days = 7) {
  if (typeof window === "undefined") return;
  if (!token || !user) return;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  Cookies.set("auth_token", token, cookieOptions(days));

  if (user?.role) {
    Cookies.set("role", user.role, cookieOptions(days));
  }
}

export function clearAuth() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  Cookies.remove("auth_token");
  Cookies.remove("role");
}

/* =====================================================
   LOGOUT
===================================================== */

export async function logout() {
  if (typeof window === "undefined") return;

  const token = getToken();

  try {
    if (token && API_URL) {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    }
  } catch {
    // no bloquear
  } finally {
    clearAuth();
  }
}

/* =====================================================
   GETTERS (CLIENT SAFE)
===================================================== */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("token") ||
    Cookies.get("auth_token") ||
    null
  );
}

export function getUser(): any | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("user");
  if (!raw || raw === "undefined") return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function getRole(): string | null {
  if (typeof window === "undefined") return null;

  return getUser()?.role || Cookies.get("role") || null;
}

/* =====================================================
   FETCH WITH AUTH (CLIENT ONLY)
===================================================== */

export async function fetchWithAuth(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  if (typeof window === "undefined") {
    throw new Error("fetchWithAuth solo puede usarse en el cliente");
  }

  if (!API_URL) {
    throw new Error("API no configurada");
  }

  const token = getToken();
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...init,
    headers,
  });

  if (res.status === 401) {
    clearAuth();
    throw new Error("Sesión expirada. Inicia sesión nuevamente.");
  }

  return res;
}
