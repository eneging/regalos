import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ChevronRight,
  Share2,
  Package,
  Tag,
} from "lucide-react";
import AddToCartButton from "./AddToCartButton";

// ==========================
// Server data fetch
// ==========================
async function getProduct(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

// ==========================
// Page (Next 15)
// ==========================
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) notFound();

  const hasDiscount = false;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-orange-500">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <span>{product.category?.name || "Catálogo"}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Imagen */}
          <div className="relative rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex items-center justify-center">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={700}
                className="object-contain drop-shadow-2xl"
                priority
              />
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-zinc-600">
                <Package className="w-16 h-16 opacity-20" />
                <span>Sin imagen disponible</span>
              </div>
            )}
          </div>

          {/* Detalles */}
          <div>
            <span className="text-orange-500 font-bold text-sm uppercase">
              {product.category?.name || "Bebidas"}
            </span>

            <h1 className="text-3xl md:text-5xl font-extrabold my-4">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 mb-6">
              <div className="text-4xl font-bold">
                S/ {Number(product.price).toFixed(2)}
              </div>
              {hasDiscount && (
                <span className="text-lg line-through text-zinc-500">
                  S/ {(Number(product.price) * 1.2).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-zinc-400 text-lg mb-8">
              Producto original, ideal para celebraciones especiales.
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <AddToCartButton product={product} />

              <div className="flex gap-4">
                <button className="p-4 rounded-xl border border-zinc-700">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="p-4 rounded-xl border border-zinc-700">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <div className="flex gap-3">
                <Tag className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="text-xs text-zinc-500">SKU</span>
                  <span className="block">{product.slug}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Package className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="text-xs text-zinc-500">Disponibilidad</span>
                  <span className="block text-green-400">En stock</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
