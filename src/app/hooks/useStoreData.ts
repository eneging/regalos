"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/products";
import { getCategories, Category } from "@/services/categories.service";
import type { Product } from "@/app/types";

/* ----- Cache ----- */
// 🚀 CAMBIO CLAVE: Subimos a v6 para borrar la memoria vieja y traer los 1000 productos nuevos
const CACHE_KEY_PRODUCTS   = "store_products_v6"; 
const CACHE_KEY_CATEGORIES = "store_categories_v6";
const CACHE_KEY_TIMESTAMP  = "store_timestamp_v6";

const CACHE_TTL =
  process.env.NODE_ENV === "development" ? 0 : 30 * 60 * 1000; // 30 Minutos en producción

export function useStoreData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearCache = () => {
    try {
        localStorage.removeItem(CACHE_KEY_PRODUCTS);
        localStorage.removeItem(CACHE_KEY_CATEGORIES);
        localStorage.removeItem(CACHE_KEY_TIMESTAMP);
    } catch (e) {
        console.error("Error limpiando cache:", e);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      const now = Date.now();
      const cachedStamp = localStorage.getItem(CACHE_KEY_TIMESTAMP);
      const isFresh =
        cachedStamp && now - Number(cachedStamp) < CACHE_TTL;

      /* 1️⃣ CACHE (Si es reciente, la usamos) */
      if (isFresh && CACHE_TTL > 0) {
        try {
          const cachedProducts = JSON.parse(
            localStorage.getItem(CACHE_KEY_PRODUCTS) || "null"
          );
          const cachedCategories = JSON.parse(
            localStorage.getItem(CACHE_KEY_CATEGORIES) || "null"
          );

          if (
            Array.isArray(cachedProducts) &&
            Array.isArray(cachedCategories) &&
            cachedProducts.length > 0 // Aseguramos que no sea un array vacío cacheado por error
          ) {
            console.log(`⚡ Cache v6 usada (${cachedProducts.length} productos)`);
            if (mounted) {
              setProducts(cachedProducts);
              setCategories(cachedCategories);
              setLoading(false);
            }
            return;
          }
        } catch (e) {
          console.warn("⚠️ Cache corrupta o versión anterior, limpiando...", e);
          clearCache();
        }
      }

      /* 2️⃣ API (Si no hay cache o expiró) */
      try {
        console.log("🌍 Consultando API (Trayendo catálogo completo)...");
        
        // getProducts() ahora trae 1000 items gracias al cambio en services/products.ts
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (!productsRes.success || !categoriesRes.success) {
          throw new Error("No se pudo obtener la respuesta del servidor");
        }

        const rawProducts = productsRes.data || [];
        const rawCategories = categoriesRes.data || [];

        // Mapeamos para asegurar que cada producto tenga su objeto categoría completo
        const mappedProducts: Product[] = rawProducts.map((p: any) => ({
          ...p,
          category:
            rawCategories.find(
              (c: any) => c.id === (p.category_id || p.product_category_id)
            ) || p.category,
        }));

        if (mounted) {
          setProducts(mappedProducts);
          setCategories(rawCategories);
          setLoading(false);

          // Guardamos en Cache v6
          try {
              localStorage.setItem(CACHE_KEY_PRODUCTS, JSON.stringify(mappedProducts));
              localStorage.setItem(CACHE_KEY_CATEGORIES, JSON.stringify(rawCategories));
              localStorage.setItem(CACHE_KEY_TIMESTAMP, now.toString());
          } catch (storageError) {
              console.warn("No se pudo guardar en localStorage (posiblemente lleno):", storageError);
          }
        }
      } catch (err: any) {
        console.error("❌ useStoreData error:", err);
        if (mounted) {
          setError(err.message || "Error de conexión");
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return { products, categories, loading, error, refresh: clearCache };
}