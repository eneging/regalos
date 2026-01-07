const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("❌ NEXT_PUBLIC_API_URL no está definida");
}

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

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Error al cargar categorías:", res.status);
    return [];
  }

  const json = await res.json();
  return json?.data ?? [];
}

/* ================================
   PRODUCTOS POR CATEGORÍA
================================ */

export async function getProductsByCategory(slug: string) {
  if (!slug) {
    throw new Error("Slug de categoría requerido");
  }

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
}
