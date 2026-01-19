import React from "react";
import { getProducts } from "@/services/products"; // 👈 Tu servicio actualizado
import StoreClient from "./StoreClient"; // 👈 El componente visual que hicimos

export const metadata = {
  title: "La Carta | Puerto Rico Restobar",
  description: "Explora toda nuestra variedad de licores, cervezas y tragos. Delivery Flash en Ica.",
};

export const dynamic = "force-dynamic"; // Importante: Para que no cachee datos viejos si cambian precios

export default async function StorePage() {
  console.log("⚡ Cargando La Carta completa...");

  // 1. Llamamos a tu servicio (que ahora pide 1000 productos)
  const response = await getProducts();
  
  // 2. Validación de seguridad para extraer el Array de productos
  // A veces las APIs devuelven { data: [...] } y otras veces { data: { data: [...] } } si hay paginación
  let products = [];

  if (response?.data) {
    if (Array.isArray(response.data)) {
      // Caso A: La API devuelve el array directo en data
      products = response.data;
    } else if (Array.isArray((response.data as any).data)) {
      // Caso B: La API devuelve un objeto paginado (Laravel Default)
      products = (response.data as any).data;
    }
  }

  console.log(`✅ Productos cargados: ${products.length}`);

  // 3. Renderizamos el Cliente pasándole los datos
  return <StoreClient initialProducts={products} />;
}