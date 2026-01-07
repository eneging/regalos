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

  try {
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

    const json = await res.json();

    return {
      success: json?.success ?? true,
      data: json?.data ?? [],
      meta: json?.meta ?? {
        current_page: 1,
        last_page: 1,
        total: 0,
      },
    };
  } catch (error) {
    console.error("SEARCH ERROR:", error);

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
}

/* ================================
   AUTOCOMPLETE (HOME / NAV)
================================ */

export async function autocompleteProducts(
  query: string
): Promise<Product[]> {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(
      `${API_URL}/products/autocomplete?q=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    const json = await res.json();
    return json?.data ?? [];
  } catch (error) {
    console.error("AUTOCOMPLETE ERROR:", error);
    return [];
  }
}
