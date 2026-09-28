import { Banknote, CalendarCheck, ChevronLeft, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/catalog";

export function SectionHeader({ title, href, linkLabel = "همه" }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between px-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center text-sm font-medium text-brand">
          {linkLabel}
          <ChevronLeft className="size-4" />
        </Link>
      )}
    </div>
  );
}

export function ProductRow({ products }: { products: Product[] }) {
  return (
    <ul className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 pb-1">
      {products.map((p) => (
        <li key={p.slug} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[19%]">
          <ProductCard product={p} className="h-full" />
        </li>
      ))}
    </ul>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((p) => (
        <li key={p.slug}>
          <ProductCard product={p} className="h-full" />
        </li>
      ))}
    </ul>
  );
}

const trustItems = [
  { Icon: ShieldCheck, title: "اجناس ۱۰۰٪ اصل", text: "مستقیم از نماینده رسمی" },
  { Icon: CalendarCheck, title: "تاریخ ختم معلوم", text: "روی هر جنس نوشته شده" },
  { Icon: Banknote, title: "پرداخت در وقت تحویل", text: "اول ببینید، بعد بپردازید" },
  { Icon: RefreshCw, title: "تبدیلی تا ۷ روز", text: "برای جنس خراب یا اشتباه" },
];

export function TrustStrip() {
  return (
    <ul className="mx-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
      {trustItems.map(({ Icon, title, text }) => (
        <li key={title} className="flex items-center gap-3 bg-surface p-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ok-soft text-ok">
            <Icon className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-bold">{title}</p>
            <p className="mt-0.5 text-[11px] text-muted">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="مسیر" className="no-scrollbar overflow-x-auto px-4 py-3 text-[12px] text-muted">
      <ol className="flex items-center gap-1 whitespace-nowrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronLeft className="size-3.5" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
