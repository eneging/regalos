import { getProductsByCategory } from "../../../services/categories.service";
import CategoryView from "../../components/home/CategoryView"; // <--- Importamos el componente cliente

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Fetch inicial en el servidor (Vital para SEO)
  const data = await getProductsByCategory(slug);

  
  // Validamos que 'data.products' sea un array, si falla la API enviamos vacío
  const serverProducts = data && Array.isArray(data.products) ? data.products : [];


  
  return (
    // Pasamos los datos iniciales y el slug al componente cliente
    <CategoryView initialProducts={serverProducts} slug={slug} />
  );
}