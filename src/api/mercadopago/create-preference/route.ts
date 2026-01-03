// /src/app/api/checkout/create-preference/route.ts
import { NextResponse } from "next/server";
import { mp } from "./../../../app/lib/mercadopago";
import { Preference } from "mercadopago";

export async function POST(req: Request) {
  try {
    const { items, orderId } = await req.json();

    const client = new Preference(mp);

    const preference = await client.create({
      body: {
        items,
        external_reference: orderId, // IMPORTANTE para validar el pago luego
        back_urls: {
          success: "https://tusitio.com/checkout/success",
          failure: "https://tusitio.com/checkout/error",
          pending: "https://tusitio.com/checkout/pending",
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({ preferenceId: preference.id });
  } catch (e) {
    console.error("❌ Error Mercado Pago:", e);
    return NextResponse.json({ error: "Error creando preferencia" }, { status: 500 });
  }
}
