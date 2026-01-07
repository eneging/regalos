import { Product } from "../services/types/product";

/* ================================
   API CONFIG
================================ */

const API = process.env.NEXT_PUBLIC_API_URL;

if (!API) {
  throw new Error("❌ NEXT_PUBLIC_API_URL no está definida");
}

/* ================================
   GET ALL PRODUCTS
================================ */

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Error cargando productos:", res.status);
    return [];
  }

  const json = await res.json();

  // API: { success, data, meta }
  return json?.data ?? [];
}

/* ================================
   GET SINGLE PRODUCT
================================ */

export async function getProduct(slug: string): Promise<Product | null> {
  if (!slug) return null;

  const res = await fetch(`${API}/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Producto no encontrado:", slug);
    return null;
  }

  const json = await res.json();

  // API: { success, data }
  return json?.data ?? null;
}

/* ================================
   GET OFFERS
================================ */

export async function getOffers(): Promise<Product[]> {
  const res = await fetch(`${API}/products?offer=true`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Error cargando ofertas:", res.status);
    return [];
  }

  const json = await res.json();
  return json?.data ?? [];
}
