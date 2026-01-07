"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { autocompleteProducts } from "@/services/search.service";
import { useClickOutside } from "@/app/hooks/useClickOutside";

/* 🔥 INTERFAZ LOCAL (evita conflictos de tipos externos) */
interface Product {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  image_url?: string | null;
  category?: {
    id: number;
    name: string;
    slug?: string; // slug opcional para evitar choque de tipos
  } | null;
}

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ✅ REF CORRECTO PARA <div> */
  const containerRef = useRef<HTMLDivElement>(null);

  /* ✅ CAST SEGURO SOLO PARA EL HOOK */
  useClickOutside(
    containerRef as React.RefObject<HTMLElement>,
    () => setIsOpen(false)
  );

  /* ============================
      AUTOCOMPLETE
  ============================ */
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await autocompleteProducts(query);

        if (Array.isArray(data)) {
          setSuggestions(data as Product[]);
          setIsOpen(true);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /* ============================
      SELECCIONAR PRODUCTO
  ============================ */
  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/producto/${slug}`);
  };

  /* ============================
      BUSQUEDA GENERAL
  ============================ */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    router.push(`/buscar/${encodeURIComponent(query)}`);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl mx-auto z-50"
    >
      <form onSubmit={handleSubmit} className="relative group">
        {/* INPUT */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Buscar ron, whisky..."
          className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 py-3 pl-12 pr-10 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-lg shadow-black/50"
        />

        {/* ICONO SEARCH / LOADER */}
        <button
          type="submit"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>

        {/* CLEAR */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* ============================
          DROPDOWN
      ============================ */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 rounded-xl shadow-2xl border border-zinc-800 overflow-hidden">
          <ul>
            <li className="px-4 py-2 text-xs font-bold text-orange-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
              Sugerencias
            </li>

            {suggestions.map((product) => (
              <li
                key={product.id}
                className="border-b border-zinc-800 last:border-0"
              >
                <button
                  onClick={() => handleSelectProduct(product.slug)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 transition-colors text-left group"
                >
                  {/* IMAGEN */}
                  <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                     
 <Image
                        src= {`/assets/${product.category?.id}/${product.name}.png`}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-contain"

            ></Image>        
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors truncate">
                      {product.name}
                    </p>

                    {product.category?.name && (
                      <p className="text-xs text-zinc-500">
                        {product.category.name}
                      </p>
                    )}
                  </div>

                  {/* PRECIO */}
                  <span className="text-sm font-bold text-orange-500 whitespace-nowrap">
                    S/ {Number(product.price).toFixed(2)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
