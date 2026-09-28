"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/components/CartProvider";
import { WhatsAppIcon } from "@/components/icons";
import { ProductArt } from "@/components/ProductArt";
import { getBrand, getProduct } from "@/data/catalog";
import { cities, store } from "@/lib/config";
import { formatAfn, toFaDigits, whatsappLink } from "@/lib/format";

export default function CartPage() {
  const { lines, ready, subtotal, setQty, remove } = useCart();
  const kabulFee = cities.find((c) => c.id === "kabul")!.fee;
  const minProvinceFee = Math.min(...cities.filter((c) => c.id !== "kabul").map((c) => c.fee));

  if (!ready) return <div className="p-8" />;

  if (!lines.length) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-brand-soft text-brand">
          <ShoppingBag className="size-9" />
        </span>
        <h1 className="text-lg font-bold">سبد خرید شما خالی است</h1>
        <Link href="/" className="rounded-xl bg-brand px-6 py-2.5 font-bold text-white">
          شروع خرید
        </Link>
      </div>
    );
  }

  const cartText = [
    "سلام، می خواهم این اجناس را سفارش بدهم:",
    ...lines.map((l) => {
      const p = getProduct(l.slug)!;
      return `• ${p.name} (${getBrand(p.brand)?.name})${l.shade ? ` - رنگ: ${l.shade}` : ""} × ${toFaDigits(l.qty)}`;
    }),
    `جمع: ${formatAfn(subtotal)}`,
  ].join("\n");

  return (
    <div className="px-4 pt-4 md:grid md:grid-cols-[1fr_340px] md:items-start md:gap-6">
      <section>
        <h1 className="mb-3 text-xl font-extrabold">سبد خرید ({toFaDigits(lines.reduce((n, l) => n + l.qty, 0))})</h1>
        <ul className="space-y-3">
          {lines.map((l) => {
            const p = getProduct(l.slug)!;
            return (
              <li key={`${l.slug}-${l.shade ?? ""}`} className="flex gap-3 rounded-2xl border border-line bg-surface p-3">
                <Link href={`/p/${p.slug}`} className="size-20 shrink-0 rounded-xl bg-bg">
                  <ProductArt shape={p.shape} color={p.color} className="size-full p-2" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="ltr text-end text-[11px] text-muted">{getBrand(p.brand)?.name}</p>
                  <Link href={`/p/${p.slug}`} className="line-clamp-2 text-sm font-medium leading-snug">
                    {p.name}
                  </Link>
                  {l.shade && <p className="text-[12px] text-muted">رنگ: {l.shade}</p>}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        aria-label="یکی بیشتر"
                        onClick={() => setQty(l.slug, l.shade, l.qty + 1)}
                        className="grid size-8 place-items-center"
                      >
                        <Plus className="size-4" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-bold">{toFaDigits(l.qty)}</span>
                      <button
                        type="button"
                        aria-label={l.qty === 1 ? "حذف" : "یکی کمتر"}
                        onClick={() => setQty(l.slug, l.shade, l.qty - 1)}
                        className="grid size-8 place-items-center"
                      >
                        {l.qty === 1 ? <Trash2 className="size-4 text-danger" /> : <Minus className="size-4" />}
                      </button>
                    </div>
                    <p className="font-bold">{formatAfn(p.price * l.qty)}</p>
                  </div>
                </div>
                <button type="button" onClick={() => remove(l.slug, l.shade)} aria-label="حذف از سبد" className="self-start text-muted">
                  <Trash2 className="size-4.5" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="mt-5 space-y-3 rounded-2xl border border-line bg-surface p-4 md:sticky md:top-32 md:mt-11">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">جمع اجناس</dt>
            <dd className="font-bold">{formatAfn(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">کرایه انتقال</dt>
            <dd className="text-end">
              کابل {formatAfn(kabulFee)}
              <br />
              <span className="text-[12px] text-muted">ولایات از {formatAfn(minProvinceFee)}</span>
            </dd>
          </div>
        </dl>
        <p className="rounded-xl bg-ok-soft p-2.5 text-center text-[13px] font-medium text-ok">پول را وقت تحویل گرفتن بپردازید</p>
        <Link href="/checkout" className="flex h-12 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white hover:bg-brand-dark">
          ثبت سفارش
        </Link>
        <a
          href={whatsappLink(store.whatsapp, cartText)}
          target="_blank"
          rel="noopener"
          className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-wa font-bold text-wa"
        >
          <WhatsAppIcon className="size-5" /> سفارش از طریق واتساپ
        </a>
      </aside>
    </div>
  );
}
