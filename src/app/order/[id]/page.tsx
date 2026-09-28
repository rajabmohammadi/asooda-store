import { CircleCheck, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { WhatsAppIcon } from "@/components/icons";
import { store } from "@/lib/config";
import { formatAfn, toFaDigits, whatsappLink } from "@/lib/format";
import { getOrder } from "@/lib/orders";

export const metadata: Metadata = { title: "سفارش شما ثبت شد", robots: { index: false } };

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-lg space-y-5 px-4 pt-8 text-center">
      <CircleCheck className="mx-auto size-16 text-ok" strokeWidth={1.6} />
      <h1 className="text-2xl font-extrabold">سفارش شما ثبت شد</h1>
      <p className="leading-7 text-muted">
        همکار ما تا {toFaDigits(store.confirmCallWithinHours)} ساعت با شما به شماره{" "}
        <b className="ltr text-ink">{toFaDigits(order.customer.phone)}</b> تماس می گیرد.
      </p>

      <div className="rounded-2xl border border-line bg-surface p-4 text-start">
        <div className="mb-3 flex justify-between border-b border-line pb-3">
          <span className="text-muted">شماره سفارش</span>
          <b className="ltr tracking-wider">{order.id}</b>
        </div>
        <ul className="space-y-1.5 text-sm">
          {order.items.map((i) => (
            <li key={`${i.slug}-${i.shade ?? ""}`} className="flex justify-between gap-3">
              <span>
                {i.name}
                {i.shade && ` (${i.shade})`} × {toFaDigits(i.qty)}
              </span>
              <span className="shrink-0">{formatAfn(i.price * i.qty)}</span>
            </li>
          ))}
          <li className="flex justify-between text-muted">
            <span>کرایه انتقال</span>
            <span>{formatAfn(order.deliveryFee)}</span>
          </li>
        </ul>
        <p className="mt-3 flex justify-between border-t border-line pt-3 font-extrabold">
          <span>مجموع (نقد در وقت تحویل)</span>
          <span>{formatAfn(order.total)}</span>
        </p>
      </div>

      <a
        href={whatsappLink(store.whatsapp, `سلام، سفارش من به شماره ${order.id} ثبت شد. می خواهم پیگیری کنم.`)}
        target="_blank"
        rel="noopener"
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-wa font-bold text-white"
      >
        <WhatsAppIcon className="size-5" /> در واتساپ تعقیب کنید
      </a>
      <p className="flex items-center justify-center gap-2 text-sm text-muted">
        <Phone className="size-4" /> شماره پشتیبانی: <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="ltr font-medium text-ink">{store.phone}</a>
      </p>
      <Link href="/" className="inline-block font-medium text-brand">
        ادامه خرید
      </Link>
    </div>
  );
}
