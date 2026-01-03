import { Product } from "./types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
  const json = await res.json();
  return json.data;
}



export async function getProductsByCategory(slug: string) {
  const res = await fetch(
    `${API_URL}/categories/${slug}/products`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("Error fetching category products:", res.status);
    throw new Error("No se pudieron cargar los productos");
  }

  const json = await res.json();

  // 🔥 NORMALIZAMOS LA RESPUESTA
  return {
    category: json.data.category,
    products: json.data.products ?? [],
    meta: json.data.meta,
  };
}
