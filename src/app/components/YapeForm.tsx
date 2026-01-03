
import { useState } from "react";

export default function YapeForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleYape = async () => {
  try {
    if (typeof window === "undefined" || !window.MercadoPago) {
      alert("SDK de Mercado Pago no cargó aún");
      return;
    }

    const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);

    const yape = mp.yape({
      phoneNumber: phone,
      otp: otp,
    });

    const token = await yape.create();
    console.log("TOKEN YAPE:", token);

    const res = await fetch("http://127.0.0.1:8000/api/yape/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token.id,
        amount: 45,
        description: "Pedido Puerto Rico",
        email: "cliente@correo.com",
      }),
    });

    if (!res.ok) {
  console.error("Error backend:", await res.text());
  return;
}
const data = await res.json();

    console.log("RESPUESTA BACK:", data);
  } catch (e) {
    console.error(e);
  }
};

  return (
    <div className="p-4 rounded-lg border mt-4">
      <h2 className="font-bold text-xl mb-3">Pagar con Yape</h2>

      <label>Celular Yape</label>
      <input
        className="border p-2 w-full mb-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label>OTP</label>
      <input
        className="border p-2 w-full mb-4"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        onClick={handleYape}
        className="bg-purple-600 text-white px-5 py-2 rounded-lg"
      >
        Pagar con Yape
      </button>
    </div>
  );
}
