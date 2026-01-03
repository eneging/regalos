"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
  const params = useSearchParams();

  useEffect(() => {
    const paymentId = params.get("payment_id");
    const status = params.get("status");
    const orderId = params.get("external_reference");

    if (status === "approved") {
      fetch("/api/checkout/confirm", {
        method: "POST",
        body: JSON.stringify({ paymentId, orderId }),
      });
    }
  }, []);

  return <h1>¡Pago exitoso! 🎉</h1>;
}
