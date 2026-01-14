import { getProductsByCategory } from "@/services/products";
import CategoryView from "@/app/components/home/CategoryView";
// Importamos el tipo "Destino" (el que usa tu componente visual)
import { Product } from "@/app/types";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // 1. Obtenemos los datos "crudos" del servicio (donde price es string)
  const rawProducts = await getProductsByCategory(slug);

  // 2. CONVERSIÓN DE TIPOS:
  // Mapeamos los productos para convertir el precio de String a Number
  // y asegurarnos de que coincida con el tipo 'Product' que espera el CategoryView.
  const cleanProducts: Product[] = rawProducts.map((p: any) => ({
    ...p,
    // Convertimos a número. Si falla, ponemos 0.
    price: Number(p.price) || 0, 
    // Hacemos lo mismo con offer_price por si acaso
    offer_price: p.offer_price ? Number(p.offer_price) : null,
  }));

  return (
    <CategoryView initialProducts={cleanProducts} slug={slug} />
  );
}