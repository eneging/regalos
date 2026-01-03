"use client";

import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";
import { useEffect } from "react";

export default function PayButton({ preferenceId }: { preferenceId: string }) {

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "es-PE"
    });
  }, []);

  if (!preferenceId) return <p>Cargando botón...</p>;

  return (
    <div className="w-full flex justify-center mt-4">
      <Wallet initialization={{ preferenceId }} />
    </div>
  );
}
