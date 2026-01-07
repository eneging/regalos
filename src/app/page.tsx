// app/page.tsx

export const dynamic = "force-dynamic";
import { getCategories } from "@/services/categories.service";
import HomeView from "@/app/components/home/HomeView";

export default async function Page() {
  // 1. Pedimos SOLO categorías
  const categoriesRaw = await getCategories();

  // 2. Seguridad
  const safeCategories = Array.isArray(categoriesRaw) ? categoriesRaw : [];

  return (
    <HomeView
      categories={safeCategories}
      products={[]} 
    />
  );
}
