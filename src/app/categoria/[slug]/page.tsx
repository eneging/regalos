import { getProductsByCategory } from "../../../services/categories.service";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = params;

  const data = await getProductsByCategory(slug);

  return (
    <main className="bg-[#050505] min-h-screen text-white px-6 py-16">
      {/* TÍTULO */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold capitalize">
         
        </h1>
        <p className="text-gray-400 mt-2">
          Productos disponibles en esta categoría
        </p>
      </div>

      {/* PRODUCTOS */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.products.length > 0 ? (
          data.products.map((product:any) => (
         
            <div
              key={product.id}
              className="bg-[#121212] rounded-2xl p-4 border border-white/5 hover:border-amber-500/30 transition-all"
            >
              <div className="relative w-full aspect-[3/4] mb-4 rounded-xl overflow-hidden">
                <Image
                  src={product.image_url || ""}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="font-medium truncate">{product.name}</h3>
              <p className="text-amber-500 font-bold mt-1">
                S/ {product.price}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            No hay productos en esta categoría
          </div>
        )}
      </div>

      {/* VOLVER */}
      <div className="text-center mt-14">
        <Link
          href="/"
          className="text-amber-500 hover:text-amber-400"
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
