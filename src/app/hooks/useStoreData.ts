import { useEffect, useState } from "react";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories.service";
import type { Product } from "@/app/types";
import { Category } from "@/services/categories.service"; 

/* ----- Constantes de Caché ----- */
const CACHE_KEY_PRODUCTS   = "store_products_v3"; 
const CACHE_KEY_CATEGORIES = "store_categories_v3";
const CACHE_KEY_TIMESTAMP  = "store_timestamp_v3";

const CACHE_TTL = process.env.NODE_ENV === 'development' ? 0 : 30 * 60 * 1000;

export function useStoreData() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY_PRODUCTS);
    localStorage.removeItem(CACHE_KEY_CATEGORIES);
    localStorage.removeItem(CACHE_KEY_TIMESTAMP);
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      const now = Date.now();
      const cachedStampStr = localStorage.getItem(CACHE_KEY_TIMESTAMP);
      const cacheIsFresh = cachedStampStr && (now - parseInt(cachedStampStr, 10) < CACHE_TTL);

      // 1. INTENTO DE LEER CACHÉ
      if (cacheIsFresh && CACHE_TTL > 0) {
        try {
          const cachedProds = JSON.parse(localStorage.getItem(CACHE_KEY_PRODUCTS) || "null");
          const cachedCats  = JSON.parse(localStorage.getItem(CACHE_KEY_CATEGORIES) || "null");

          if (Array.isArray(cachedProds) && Array.isArray(cachedCats)) {
            if (isMounted) {
              console.log("⚡️ [useStoreData] Usando caché local");
              setProducts(cachedProds);
              setCategories(cachedCats);
              setLoading(false);
            }
            return;
          }
        } catch (e) {
          // CORRECCIÓN: Usamos 'e' para loguear el error real
          console.warn("⚠️ Caché corrupta, limpiando...", e);
          clearCache();
        }
      }

      // 2. FETCH A LA API
      try {
        console.log("🌍 [useStoreData] Consultando API...");
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        const rawProducts = Array.isArray(productsRes) 
            ? productsRes 
            : (productsRes as any).data || [];

        const rawCategories = Array.isArray(categoriesRes) 
            ? categoriesRes 
            : (categoriesRes as any).data || [];

        if (!Array.isArray(rawProducts)) throw new Error("Formato de productos inválido");
        if (!Array.isArray(rawCategories)) throw new Error("Formato de categorías inválido");

        const prods: Product[] = rawProducts.map((p: any) => {
          const category = rawCategories.find((c: Category) => c.id === p.product_category_id) 
                           || p.category;
          return { ...p, category };
        });

        if (isMounted) {
          setProducts(prods);
          setCategories(rawCategories);
          setLoading(false);

          if (prods.length > 0) {
            try {
              localStorage.setItem(CACHE_KEY_PRODUCTS,   JSON.stringify(prods));
              localStorage.setItem(CACHE_KEY_CATEGORIES, JSON.stringify(rawCategories));
              localStorage.setItem(CACHE_KEY_TIMESTAMP,  now.toString());
            } catch (e) {
               // CORRECCIÓN: Usamos 'e' aquí también
               console.error("Error guardando caché (QuotaExceeded?)", e);
            }
          }
        }

      } catch (err: any) {
        console.error("❌ Error useStoreData:", err);
        if (isMounted) {
          setError(err.message || "Error de conexión");
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => { isMounted = false; };
  }, []);

  return { products, categories, loading, error, refresh: clearCache };
}