import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Package, Tag, Gift } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import ProductActions from "@/app/components/ProductActions";
import { getProduct } from "@/services/products";
import type { Product as AppProduct } from "@/app/types"; 

// Helper para limpiar URLs
function slugify(text: any) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const rawProduct = await getProduct(slug);

  if (!rawProduct) notFound();

  // NORMALIZACIÓN
  const cleanProduct: AppProduct = {
    ...rawProduct,
    product_category_id: Number(rawProduct.product_category_id) || 0,
    price: Number(rawProduct.price) || 0,
    offer_price: rawProduct.offer_price ? Number(rawProduct.offer_price) : undefined,
    stock: Number(rawProduct.stock) || 0,
    discount: rawProduct.discount ? Number(rawProduct.discount) : undefined,
    image_url: rawProduct.image_url || "",
    created_at: rawProduct.created_at || "", 
    updated_at: rawProduct.updated_at || "", 
    available: !!rawProduct.available,
    is_offer: !!rawProduct.is_offer,
    category: rawProduct.category,
    id: rawProduct.id,
    name: rawProduct.name || "Sin nombre",
    slug: rawProduct.slug || "",
    description: rawProduct.description || ""
  };

  // VARIABLES DE PRESENTACIÓN
  const price = cleanProduct.price;
  const offerPrice = cleanProduct.offer_price || 0;
  // Validación de descuento real
  const hasDiscount = Boolean(cleanProduct.is_offer) && offerPrice > 0 && offerPrice < price;
  const priceToShow = hasDiscount ? offerPrice : price;
  
  const categoryId = cleanProduct.category?.id;
  
  // Prioridad: URL Cloudinary > Local
  const imageSrc = cleanProduct.image_url && cleanProduct.image_url.startsWith("http") 
    ? cleanProduct.image_url 
    : `/assets/${categoryId}/${cleanProduct.name}.png`;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-rose-500/30">
      <div className="container mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link href="/" className="hover:text-rose-500 transition-colors">Inicio</Link>
          <ChevronRight className="w-4 h-4 shrink-0 text-zinc-600" />
          <Link 
            href={`/categoria/${slugify(cleanProduct.category?.slug || 'catalogo')}`} 
            className="hover:text-white transition-colors"
          >
            {cleanProduct.category?.name || "Catálogo"}
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0 text-zinc-600" />
          <span className="text-rose-200 font-medium truncate max-w-[200px]">
            {cleanProduct.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Columna Izquierda: Imagen */}
          <div className="relative group rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 flex items-center justify-center overflow-hidden aspect-square lg:aspect-auto lg:h-[600px]">
            {/* Glow Rosado */}
            <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none" />
            
            <div className="relative w-full h-full">
                <Image
                    src={imageSrc}
                    alt={cleanProduct.name}
                    fill
                    className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {hasDiscount && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg transform -rotate-2">
                    OFERTA ESPECIAL
                </div>
            )}
          </div>

          {/* Columna Derecha: Detalles */}
          <div className="flex flex-col h-full justify-center">
            
            <div className="flex items-center gap-2 text-rose-500 font-bold text-sm uppercase tracking-wider mb-3">
                <Gift size={16} />
                {cleanProduct.category?.name || "Detalle"}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
              {cleanProduct.name}
            </h1>

            <div className="flex items-end gap-4 mb-8">
              <div className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                S/ {priceToShow.toFixed(2)}
              </div>
              
              {hasDiscount && (
                <div className="flex flex-col mb-1">
                    <span className="text-sm text-rose-400 font-semibold">Antes</span>
                    <span className="text-xl line-through text-zinc-600">
                    S/ {price.toFixed(2)}
                    </span>
                </div>
              )}
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-lg border-l-2 border-rose-500/50 pl-4">
              {cleanProduct.description || "Sorprende con este detalle único, preparado con dedicación para esa persona especial."}
            </p>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full max-w-xl">
              <div className="flex-1 h-12"> 
                 {/* Asegúrate de que AddToCartButton también esté estilizado o sea neutro */}
                 <AddToCartButton product={cleanProduct} />
              </div>
              <div className="flex items-center gap-2">
                 <ProductActions product={cleanProduct} />
              </div>
            </div>

            {/* Meta Data */}
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 hover:border-rose-500/30 transition-colors">
                <div className="p-2 bg-rose-500/10 rounded-lg">
                   <Tag className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-0.5">CÓDIGO</span>
                  <span className="block font-mono text-sm text-zinc-300 truncate max-w-[100px]" title={cleanProduct.slug}>
                      {cleanProduct.slug}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 hover:border-green-500/30 transition-colors">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Package className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-0.5">DISPONIBILIDAD</span>
                  <span className="block text-green-400 text-sm font-medium">
                      {cleanProduct.stock > 0 ? "En Stock" : "Agotado"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}