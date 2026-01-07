import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Package, Tag } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import ProductActions from "@/app/components/ProductActions"; // <--- IMPORTAR AQUÍ

// ... (Tu función getProduct sigue igual) ...
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

function slugify(text:any ) {
  return text
    .toLowerCase() // 1. Convertir a minúsculas
    .normalize('NFD') // 2. Separar base de acentos
    .replace(/[\u0300-\u036f]/g, '') // 3. Eliminar acentos
    .replace(/[^a-z0-9 -]/g, '') // 4. Eliminar caracteres no permitidos
    .trim() // 5. Eliminar espacios al inicio/final
    .replace(/\s+/g, '-') // 6. Reemplazar espacios por guiones
    .replace(/-+/g, '-'); // 7. Eliminar guiones duplicados
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const hasDiscount = false; // Puedes calcular esto dinámicamente si tienes lógica

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-500/30">
      <div className="container mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-orange-500 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="hover:text-white transition-colors cursor-default"><a href={`/categoria/${slugify(product.category?.slug)}`}  >{product.category?.name|| "Catálogo"}</a> </span>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-white font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Imagen con efecto sutil */}
          <div className="relative group rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 flex items-center justify-center overflow-hidden aspect-square lg:aspect-auto lg:h-[600px]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl" />
            
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="object-contain w-full h-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                priority
              />
            ) : (
              <Image
                src={`/assets/${product.category?.id}/${product.name}.png`}
                alt={product.name}
                width={600}
                height={600}
                className="object-contain w-full h-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                priority
              />
            )}
          </div>

          {/* Detalles */}
          <div className="flex flex-col h-full justify-center">
            <span className="text-orange-500 font-bold text-sm uppercase tracking-wider mb-2">
              {product.category?.name || "Bebidas"}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 mb-8">
              <div className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                S/ {Number(product.price).toFixed(2)}
              </div>
              {hasDiscount && (
                <span className="text-xl line-through text-zinc-600 mb-1">
                  S/ {(Number(product.price) * 1.2).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-lg">
              {product.description || "Producto original seleccionado cuidadosamente, ideal para celebraciones especiales y momentos únicos."}
            </p>

            {/* ZONA DE ACCIONES (Updated) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {/* Botón Añadir (Asumo que ya es interactivo) */}
              <div className="flex-1">
                 <AddToCartButton product={product} />
              </div>

              {/* Nuevos Botones Interactivos */}
              <ProductActions product={product} />
            </div>

            {/* Meta Data */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                   <Tag className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">SKU</span>
                  <span className="block font-mono text-zinc-300">{product.slug}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Package className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Stock</span>
                  <span className="block text-green-400 font-medium">Disponible</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}