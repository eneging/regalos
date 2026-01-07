import { getProductsByCategory } from "../../../services/categories.service";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard"; // <--- Importamos la card reutilizable

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProductsByCategory(slug);
  const categoryTitle = slug.replace(/-/g, " ");

  return (
    <main className="bg-[#050505] min-h-screen text-white px-6 py-16">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold capitalize">
          {categoryTitle}
        </h1>
        <p className="text-gray-400 mt-2">
          Productos disponibles en esta categoría
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.products.length > 0 ? (
          data.products.map((product: any) => (
            // REUTILIZACIÓN DE LA CARD
            <ProductCard 
                key={product.id}
                product={product}
                categoryName={categoryTitle}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-10">
            No hay productos en esta categoría
          </div>
        )}
      </div>

      <div className="text-center mt-14">
        <Link href="/" className="text-amber-500 hover:text-amber-400 font-bold">
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}