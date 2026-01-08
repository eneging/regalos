"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/products";
import { getCategories, Category } from "@/services/categories.service";
import type { Product } from "@/app/types";

/* ----- Cache ----- */
const CACHE_KEY_PRODUCTS   = "store_products_v3";
const CACHE_KEY_CATEGORIES = "store_categories_v3";
const CACHE_KEY_TIMESTAMP  = "store_timestamp_v3";

const CACHE_TTL =
  process.env.NODE_ENV === "development" ? 0 : 30 * 60 * 1000;

export function useStoreData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY_PRODUCTS);
    localStorage.removeItem(CACHE_KEY_CATEGORIES);
    localStorage.removeItem(CACHE_KEY_TIMESTAMP);
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

      /* 1️⃣ CACHE */
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
            Array.isArray(cachedCategories)
          ) {
            console.log("⚡ Cache usada");
            if (mounted) {
              setProducts(cachedProducts);
              setCategories(cachedCategories);
              setLoading(false);
            }
            return;
          }
        } catch (e) {
          console.warn("⚠️ Cache corrupta, limpiando", e);
          clearCache();
        }
      }

      /* 2️⃣ API */
      try {
        console.log("🌍 Consultando API...");
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        if (!productsRes.success || !categoriesRes.success) {
          throw new Error("Respuesta inválida de la API");
        }

        const rawProducts = productsRes.data;
        const rawCategories = categoriesRes.data;

        const mappedProducts: Product[] = rawProducts.map((p:any) => ({
          ...p,
          category:
            rawCategories.find(
              (c:any) => c.id === p.product_category_id
            ) || p.category,
        }));

        if (mounted) {
          setProducts(mappedProducts);
          setCategories(rawCategories);
          setLoading(false);

          localStorage.setItem(
            CACHE_KEY_PRODUCTS,
            JSON.stringify(mappedProducts)
          );
          localStorage.setItem(
            CACHE_KEY_CATEGORIES,
            JSON.stringify(rawCategories)
          );
          localStorage.setItem(
            CACHE_KEY_TIMESTAMP,
            now.toString()
          );
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
