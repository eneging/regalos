import { Product } from "@/app/types";
import { ApiResponse } from "./types/api";

/* ================================
   API CONFIG (SAFE PARA SSR)
================================ */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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
export async function getProducts(): Promise<ApiResponse<Product[]>> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status} al cargar productos`);
    }

    return res.json();
  } catch (error) {
    console.error("❌ getProducts error:", error);
    return {
      success: false,
      message: "Error de conexión",
      data: [],
      errors: error,
    };
  }
}


export async function searchProducts(
  query: string,
  page = 1
): Promise<SearchResponse> {
  if (!query || !API_URL) {
    if (!API_URL) {
      console.error("❌ NEXT_PUBLIC_API_URL no está definida");
    }

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
  term: string
): Promise<Product[]> {
  if (!term || term.length < 2 || !API_URL) {
    if (!API_URL) {
      console.error("❌ NEXT_PUBLIC_API_URL no está definida");
    }
    return [];
  }

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
