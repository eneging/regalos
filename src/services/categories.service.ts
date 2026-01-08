/* ================================
   API CONFIG (SAFE PARA SSR)
================================ */

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

export async function getCategories(): Promise<Category[]> {
  if (!API_URL) {
    console.error("❌ NEXT_PUBLIC_API_URL no está definida");
    return [];
  }

  try {
    const res = await fetch(`${API_URL}/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`❌ Error API categories: ${res.status}`);
      return [];
    }

    const json = await res.json();

    if (!json?.success) {
      console.warn("⚠️ API respondió success=false");
      return [];
    }

    if (!Array.isArray(json.data)) {
      console.error("❌ data no es un array");
      return [];
    }

    console.log("✅ Categories cargadas:", json.data.length);
    return json.data;
  } catch (error) {
    console.error("🔥 GET CATEGORIES ERROR:", error);
    return [];
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
