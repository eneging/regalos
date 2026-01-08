/* ================================
   API CONFIG (SAFE PARA SSR)
================================ */

import { ApiResponse } from "./types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ================================
   TYPES
================================ */

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

/* ================================
   GET CATEGORIES
================================ */

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status} al cargar categorías`);
    }

    return res.json();
  } catch (error) {
    console.error("❌ getCategories error:", error);
    return {
      success: false,
      message: "Error de conexión",
      data: [],
      errors: error,
    };
  }
}


/* ================================
   PRODUCTS BY CATEGORY
================================ */

export async function getProductsByCategory(slug: string) {
  if (!slug || !API_URL) {
    console.error("❌ slug o API_URL inválido");
    return {
      category: null,
      products: [],
      meta: null,
    };
  }

  try {
    const res = await fetch(
      `${API_URL}/categories/${slug}/products`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error(`❌ Error products by category: ${res.status}`);
      return {
        category: null,
        products: [],
        meta: null,
      };
    }

    const json = await res.json();

    return {
      category: json?.data?.category ?? null,
      products: json?.data?.products ?? [],
      meta: json?.data?.meta ?? null,
    };
  } catch (error) {
    console.error("🔥 GET PRODUCTS BY CATEGORY ERROR:", error);
    return {
      category: null,
      products: [],
      meta: null,
    };
  }
}
