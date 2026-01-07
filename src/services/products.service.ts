import { Product } from "@/app/types";

/* ================================
   API CONFIG
================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("❌ NEXT_PUBLIC_API_URL no está definida");
}

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
  if (!query) {
    return {
      success: true,
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        total: 0,
      },
    };
  }

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
    return {
      success: false,
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        total: 0,
      },
    };
  }

  return res.json();
}

/* ================================
   AUTOCOMPLETE (HOME / NAV)
================================ */

export async function autocompleteProducts(term: string): Promise<Product[]> {
  if (!term || term.length < 2) return [];

  try {
    const res = await fetch(
      `${API_URL}/products/autocomplete?q=${encodeURIComponent(term)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("AUTOCOMPLETE FAILED:", res.status);
      return [];
    }

    const json = await res.json();
    return json?.data ?? [];
  } catch (error) {
    console.error("AUTOCOMPLETE ERROR:", error);
    return [];
  }
}
