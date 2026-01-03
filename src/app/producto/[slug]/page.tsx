// app/producto/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Heart, ChevronRight, Share2, Package, Tag } from "lucide-react";

// 1. Función para obtener datos (Server Component)
async function getProduct(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// 2. Componente de Página
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Calculamos un descuento ficticio para diseño (opcional) o usamos lógica real si existe
  const hasDiscount = false; 

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-orange-500 selection:text-white">
      <div className="container mx-auto px-4 py-10">
        
        {/* ==============================
            BREADCRUMB (Navegación)
           ============================== */}
        <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Inicio
          </Link> 
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-orange-500 transition-colors cursor-pointer">
            {product.category?.name || "Catálogo"}
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* ==============================
              COLUMNA IZQUIERDA: IMAGEN
             ============================== */}
          <div className="relative group rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
            {/* Efecto de luz de fondo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {product.image ? (
              <image
                src={product.image} 
                alt={product.name} 
                className="relative z-10 max-h-[500px] w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-zinc-600 gap-4">
                <Package className="w-16 h-16 opacity-20" />
                <span>Sin imagen disponible</span>
              </div>
            )}

            {/* Badge Flotante (Ejemplo: Nuevo o Descuento) */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-xs font-bold rounded-full text-white uppercase tracking-wider">
                Original
              </span>
            </div>
          </div>

          {/* ==============================
              COLUMNA DERECHA: DETALLES
             ============================== */}
          <div className="flex flex-col">
            
            {/* Encabezado */}
            <div className="mb-6 border-b border-zinc-800 pb-6">
              <span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-2 block">
                {product.category?.name || "Bebidas"}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-4">
                <div className="text-4xl font-bold text-white">
                  S/ {Number(product.price).toFixed(2)}
                </div>
                {hasDiscount && (
                  <span className="text-lg text-zinc-500 line-through mb-1">
                    S/ {(Number(product.price) * 1.2).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Descripción */}
            <p className="text-zinc-400 leading-relaxed text-lg mb-8">
                {/* Aquí iría product.description si existiera en la BD */}
                Disfruta de la calidad excepcional de este {product.category?.name}. 
                Ideal para celebraciones especiales o para darte un gusto refinado. 
                Producto 100% original garantizado.
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 transform active:scale-95">
                <ShoppingCart className="w-5 h-5" />
                Añadir al Carrito
              </button>
              
              <div className="flex gap-4">
                <button className="p-4 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition-all bg-zinc-900/50">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="p-4 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition-all bg-zinc-900/50">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Meta Información (Grid) */}
            <div className="grid grid-cols-2 gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-800 rounded-lg text-orange-500">
                   <Tag className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-zinc-500 uppercase">SKU</span>
                  <span className="text-sm font-medium text-white">{product.slug}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-zinc-800 rounded-lg text-orange-500">
                   <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-zinc-500 uppercase">Disponibilidad</span>
                  <span className="text-sm font-medium text-green-400">En Stock</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}