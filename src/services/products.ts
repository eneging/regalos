import { Product } from "../services/types/product";
import { ApiResponse } from "./types/api";




/* ================================
   API CONFIG (SAFE)
================================ */

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ================================
   1. GET ALL PRODUCTS (General)
================================ */

export async function getProducts(): Promise<ApiResponse<Product[]>> {
  try {
    // 🚀 MEJORA: Pedimos 1000 items para traer TODO de una vez si es necesario.
    // Esto asegura que la paginación no oculte productos en el Hook principal.
    const res = await fetch(`${API}/products?per_page=1000`, {
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
   2. GET COMBOS (NUEVO - Optimizado)
================================ */

export async function getCombos(): Promise<Product[]> {
  if (!API) return [];

  try {
    // Consume la ruta específica creada en el backend
    const res = await fetch(`${API}/products/combos`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error cargando combos:", res.status);
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("❌ getCombos error:", error);
    return [];
  }
}

/* ================================
   3. GET BY CATEGORY (NUEVO - Optimizado)
================================ */

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  if (!API || !slug) return [];

  try {
    // Consume la ruta específica para categorías
    const res = await fetch(`${API}/products/category/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
        // Es normal que falle si la categoría no existe o está vacía
        return []; 
    }

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(`❌ Error cargando categoría ${slug}:`, error);
    return [];
  }
}

/* ================================
   4. GET SINGLE PRODUCT
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
   5. GET OFFERS
================================ */

export async function getOffers(): Promise<Product[]> {
  if (!API) return [];

  try {
    // ⚡️ ACTUALIZADO: Usamos la ruta directa '/products/offers' 
    // en lugar de filtrar con '?offer=true' (es más eficiente en el backend)
    const res = await fetch(`${API}/products/offers`, {
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