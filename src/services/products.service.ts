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



export async function autocompleteProducts(term: string) {
  try {
    const res = await fetch(`${API_URL}/products/autocomplete?q=${term}`);
    
    if (!res.ok) throw new Error('Error en búsqueda');
    
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}