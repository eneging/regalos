// app/page.tsx
import { getCategories } from "@/services/categories.service";

import HomeView from "@/app/components/home/HomeView";

export default async function Page() {
  // 1. Pedimos los datos
  const [categoriesRaw, productsRaw] = await Promise.all([
    getCategories(),
    
  ]);

  // 2. Depuración (Mira tu terminal de VS Code cuando recargues la web)
  console.log("Categorías cargadas:", categoriesRaw?.length);
  console.log("Productos cargados:", productsRaw?.length);

  // 3. Validación de seguridad
  const safeCategories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
  const safeProducts = Array.isArray(productsRaw) ? productsRaw : [];

  return (
    <HomeView 
      categories={safeCategories} 
      products={safeProducts} 
    />
  );
}