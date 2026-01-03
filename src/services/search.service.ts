import { Product } from "@/app/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/* ================================
   TYPES
================================ */
export interface SearchResponse {
  success: boolean;
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

/* ================================
   SEARCH (PAGE /buscar/[slug])
================================ */
export async function searchProducts(
  query: string,
  page = 1
): Promise<SearchResponse> {
  const url = `${API_URL}/products/search?q=${encodeURIComponent(
    query
  )}&page=${page}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error("SEARCH FAILED:", res.status, url);
    throw new Error("Error al buscar productos");
  }

  return res.json();
}

/* ================================
   AUTOCOMPLETE (HOME / NAV)
================================ */
const autocompleteCache: Record<string, Product[]> = {};

export async function autocompleteProducts(
  query: string
): Promise<Product[]> {
  if (autocompleteCache[query]) {
    return autocompleteCache[query];
  }

  const url = `${API_URL}/products/autocomplete?q=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) return [];

  const json = await res.json();

  autocompleteCache[query] = json.data;
  return json.data;
}
