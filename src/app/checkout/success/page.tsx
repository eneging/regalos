"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SuccessPage() {
  const params = useSearchParams();
  
const executed = useRef(false);


  useEffect(() => {
    if (executed.current) return;
  executed.current = true;
    const paymentId = params.get("payment_id");
    const status = params.get("status");
    const orderId = params.get("external_reference");

    if (status === "approved") {
      fetch("/api/checkout/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId, orderId }),
      });
    }
  }, [params]); // ✅ dependencia correcta

  return <h1>¡Pago exitoso! 🎉</h1>;
}
