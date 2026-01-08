import { Product } from "../services/types/product";
import { ApiResponse } from "./types/api";

/* ================================
   API CONFIG (SAFE)
================================ */

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ================================
   GET ALL PRODUCTS
================================ */

export async function getProducts(): Promise<ApiResponse<Product[]>> {
  try {
    const res = await fetch(`${API}/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("❌ getProducts error:", error);
    return {
      success: false,
      message: "Error de conexión",
      data: [],
      errors: error,
    };
  }
}

/* ================================
   GET SINGLE PRODUCT
================================ */

export async function getProduct(slug: string): Promise<Product | null> {
  if (!slug || !API) return null;

  try {
    const res = await fetch(`${API}/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Producto no encontrado:", slug);
      return null;
    }

    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error("getProduct fetch error:", error);
    return null;
  }
}

/* ================================
   GET OFFERS
================================ */

export async function getOffers(): Promise<Product[]> {
  if (!API) return [];

  try {
    const res = await fetch(`${API}/products?offer=true`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error cargando ofertas:", res.status);
      return [];
    }

    const json = await res.json();
    return json?.data ?? [];
  } catch (error) {
    console.error("getOffers fetch error:", error);
    return [];
  }
}
