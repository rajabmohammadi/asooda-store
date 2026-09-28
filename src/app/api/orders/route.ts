import { NextResponse } from "next/server";

import { createOrder, orderInput } from "@/lib/orders";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = orderInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path[0]) }, { status: 400 });
  }

  try {
    const order = await createOrder(parsed.data);
    return NextResponse.json({ id: order.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    if (message.startsWith("unavailable:") || message.startsWith("shade:")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
