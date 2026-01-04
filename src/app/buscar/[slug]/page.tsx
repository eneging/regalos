"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";

import { searchProducts } from "@/services/search.service";
import type { Product } from "@/app/types";

export default function SearchResultsPage() {
  const { slug } = useParams<{ slug: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  /* ============================
     BUSCAR PRODUCTOS
  ============================ */
  useEffect(() => {
    if (!slug) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await searchProducts(slug, page);
        setProducts(res.data);
        setLastPage(res.meta.last_page);
      } catch (err) {
        console.error("Search error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [slug, page]);

  /* ============================
     UI
  ============================ */
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Resultados para:{" "}
        <span className="text-orange-600">{slug}</span>
      </h1>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      )}

      {/* VACÍO */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Search className="w-10 h-10 mx-auto mb-3" />
          <p>No se encontraron productos</p>
        </div>
      )}

      {/* RESULTADOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/producto/${product.slug}`}
            className="border rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-contain h-full w-full"
                />
              ) : (
                <Search className="w-6 h-6 text-gray-300" />
              )}
            </div>

            <h3 className="font-medium text-sm line-clamp-2">
              {product.name}
            </h3>

            {product.category && (
              <p className="text-xs text-gray-400">
                {product.category.name}
              </p>
            )}

            <p className="font-bold mt-2">
              S/ {Number(product.price).toFixed(2)}
            </p>
          </Link>
        ))}
      </div>

      {/* PAGINACIÓN */}
      {lastPage > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="px-4 py-2">
            {page} / {lastPage}
          </span>

          <button
            disabled={page === lastPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
