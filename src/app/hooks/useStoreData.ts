// src/hooks/useStoreData.ts
import { useEffect, useState } from "react";
import { getProducts, getCategories } from "../lib/api";          // ajusta la ruta si cambia
import type { Product, Category } from "../types";            // 👉 tipos centralizados

/* ----- constantes de caché ----- */
const CACHE_KEY_PRODUCTS   = "cachedProducts";
const CACHE_KEY_CATEGORIES = "cachedCategories";
const CACHE_KEY_TIMESTAMP  = "cacheTimestamp";
const CACHE_TTL            = 3600 * 1000; // 1 hora

export function useStoreData() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      const now            = Date.now();
      const cachedStampStr = localStorage.getItem(CACHE_KEY_TIMESTAMP);
      const cacheIsFresh   =
        cachedStampStr && now - parseInt(cachedStampStr, 10) < CACHE_TTL;

      /* ----- intenta leer caché ----- */
      if (cacheIsFresh) {
        try {
          const cachedProds = JSON.parse(
            localStorage.getItem(CACHE_KEY_PRODUCTS) || "null"
          ) as Product[] | null;
          const cachedCats  = JSON.parse(
            localStorage.getItem(CACHE_KEY_CATEGORIES) || "null"
          ) as Category[] | null;

          if (cachedProds && cachedCats) {
            setProducts(cachedProds);
            setCategories(cachedCats);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Error al leer caché, se descartará:", e);
        }
      }

      /* ----- fetch en paralelo ----- */
      try {
        const [prodsRaw, cats] = await Promise.all([
          getProducts(),          // debe devolver { …, product_category_id }
          getCategories(),
        ]);

        /* mapa product_category_id → category */
        const prods: Product[] = prodsRaw.map((p: any) => {
          const category = cats.find((c: Category) => c.id === p.product_category_id);
          return { ...p, category };
        });

        /* guarda en estado y caché */
        setProducts(prods);
        setCategories(cats);

        localStorage.setItem(CACHE_KEY_PRODUCTS,   JSON.stringify(prods));
        localStorage.setItem(CACHE_KEY_CATEGORIES, JSON.stringify(cats));
        localStorage.setItem(CACHE_KEY_TIMESTAMP,  now.toString());
      } catch (err) {
        console.error(err);
        setError("Error al cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { products, categories, loading, error };
}
