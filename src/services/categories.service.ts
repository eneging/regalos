/* ================================
   API CONFIG (SAFE PARA SSR)
================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ================================
   CATEGORÍAS
================================ */

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  created_at: string;
  updated_at: string;
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
      console.error("Error al cargar categorías:", res.status);
      return [];
    }

    const json = await res.json();
    return json?.data ?? [];
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    return [];
  }
}

/* ================================
   PRODUCTOS POR CATEGORÍA
================================ */

export async function getProductsByCategory(slug: string) {
  if (!slug || !API_URL) {
    if (!API_URL) {
      console.error("❌ NEXT_PUBLIC_API_URL no está definida");
    }

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
      console.error("Error fetching category products:", res.status);
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
    console.error("GET PRODUCTS BY CATEGORY ERROR:", error);
    return {
      category: null,
      products: [],
      meta: null,
    };
  }
}
