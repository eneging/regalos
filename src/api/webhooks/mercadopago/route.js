import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export async function POST(req) {
  try {
    const body = await req.json();

    // Mercado Pago envía diferentes tipos de eventos
    if (body.type !== "payment") {
      return Response.json({ message: "event ignored" }, { status: 200 });
    }

    const paymentId = body.data.id;

    // Validación del pago (muy importante)
    const payment = await mercadopago.payment.findById(paymentId);

    const status = payment.body.status;
    const email = payment.body.payer.email;
    const total = payment.body.transaction_amount;
    const items = payment.body.additional_info?.items;

    // Aquí guardas el pedido en tu BD
    await saveOrderInDB({
      paymentId,
      status,
      email,
      total,
      items,
    });

    return Response.json({ ok: true }, { status: 200 });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
