import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { getBrand, getProduct } from "@/data/catalog";
import { cities } from "@/lib/config";
import { formatAfn, normalizeAfPhone, toFaDigits } from "@/lib/format";

// MVP storage: a JSON file. Move to a database (Postgres/SQLite) before real volume.
const FILE = path.join(process.cwd(), "data", "orders.json");

export const orderInput = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().transform((v, ctx) => {
    const n = normalizeAfPhone(v);
    if (!n) ctx.addIssue({ code: "custom", message: "invalid phone" });
    return n ?? "";
  }),
  altPhone: z
    .string()
    .optional()
    .transform((v) => (v ? normalizeAfPhone(v) ?? undefined : undefined)),
  city: z.enum(cities.map((c) => c.id) as [string, ...string[]]),
  address: z.string().trim().min(5).max(300),
  note: z.string().trim().max(300).optional(),
  lines: z
    .array(z.object({ slug: z.string(), shade: z.string().optional(), qty: z.number().int().min(1).max(20) }))
    .min(1)
    .max(50),
});

export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refused";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; phone: string; altPhone?: string; city: string; address: string; note?: string };
  items: { slug: string; name: string; brand: string; shade?: string; qty: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: "cod";
};

async function readAll(): Promise<Order[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

let queue: Promise<void> = Promise.resolve();

export async function createOrder(input: z.infer<typeof orderInput>): Promise<Order> {
  const items = input.lines.map((l) => {
    const p = getProduct(l.slug);
    if (!p || !p.inStock) throw new Error(`unavailable:${l.slug}`);
    if (p.shades?.length && !p.shades.some((s) => s.name === l.shade)) throw new Error(`shade:${l.slug}`);
    // Prices always come from the catalogue, never from the client
    return { slug: p.slug, name: p.name, brand: getBrand(p.brand)?.name ?? "", shade: l.shade, qty: l.qty, price: p.price };
  });
  const city = cities.find((c) => c.id === input.city)!;
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);

  const order: Order = {
    id: `A${Date.now().toString(36).slice(-5).toUpperCase()}${randomBytes(2).toString("hex").toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "new",
    customer: { name: input.name, phone: input.phone, altPhone: input.altPhone, city: city.name, address: input.address, note: input.note },
    items,
    subtotal,
    deliveryFee: city.fee,
    total: subtotal + city.fee,
    payment: "cod",
  };

  // Serialise writes so concurrent orders don't overwrite each other
  const write = queue.then(async () => {
    const all = await readAll();
    all.push(order);
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(all, null, 2));
  });
  queue = write.catch(() => {});
  await write;

  notifyStaff(order).catch((e) => console.error("staff notification failed", e));
  return order;
}

export async function getOrder(id: string) {
  return (await readAll()).find((o) => o.id === id);
}

/** Instant staff alert via a Telegram bot, if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set. */
async function notifyStaff(order: Order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    `🛍 سفارش نو ${order.id}`,
    `${order.customer.name} - ${order.customer.phone}`,
    `${order.customer.city}: ${order.customer.address}`,
    order.customer.note ? `یادداشت: ${order.customer.note}` : "",
    ...order.items.map((i) => `• ${i.name} (${i.brand})${i.shade ? ` - ${i.shade}` : ""} × ${toFaDigits(i.qty)}`),
    `مجموع: ${formatAfn(order.total)}`,
  ]
    .filter(Boolean)
    .join("\n");

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
