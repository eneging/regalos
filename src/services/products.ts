import { Product } from "../services/types/product";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Error cargando productos");

  return res.json();
}

export async function getProduct(slug: string): Promise<Product> {
  const res = await fetch(`${API}/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Producto no encontrado");

  return res.json();
}


export async function getOffers(): Promise<Product[]> {
  const res = await fetch(`${API}/products/offers`, {
    cache: "no-store", // O "force-cache" si quieres caché en Next.js
  });

  if (!res.ok) throw new Error("Error cargando ofertas");

  const json = await res.json();
  
  // Tu API devuelve { success: true, data: [...] }
  return json.data || [];
}