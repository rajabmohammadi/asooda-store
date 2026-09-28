import { BadgeCheck, CalendarCheck, ChevronDown, Factory, Globe, ShieldQuestion, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductArt } from "@/components/ProductArt";
import { ProductPurchase } from "@/components/ProductPurchase";
import { Breadcrumb, ProductRow, SectionHeader } from "@/components/sections";
import { getBrand, getCategory, getProduct, getSubName, products } from "@/data/catalog";
import { cities } from "@/lib/config";
import { discountPercent, formatAfn, toFaDigits } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return { title: "یافت نشد" };
  return { title: `${p.name} ${getBrand(p.brand)?.name ?? ""}`, description: p.bullets.join("، ") };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const brand = getBrand(product.brand)!;
  const category = getCategory(product.category)!;
  const off = discountPercent(product.price, product.oldPrice);
  const kabul = cities.find((c) => c.id === "kabul")!;
  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category && p.inStock).slice(0, 8);
  const expiry = product.expiry === "—" ? "ندارد" : toFaDigits(product.expiry);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: category.name, href: `/c/${category.slug}` },
          { label: getSubName(product.category, product.sub), href: `/c/${category.slug}?sub=${product.sub}` },
        ]}
      />

      <div className="md:grid md:grid-cols-2 md:gap-8 md:px-4">
        {/* Gallery: replace with 3–4 real photos incl. back label with batch and expiry */}
        <div className="relative mx-4 aspect-square overflow-hidden rounded-3xl bg-gradient-to-b from-surface to-brand-soft/50 md:mx-0">
          <ProductArt shape={product.shape} color={product.color} label={product.name} className="size-full p-10" />
          {off > 0 && (
            <span className="absolute start-4 top-4 rounded-full bg-brand px-3 py-1 text-sm font-bold text-white">
              {toFaDigits(off)}٪ تخفیف
            </span>
          )}
        </div>

        <div className="space-y-5 px-4 pt-5 md:px-0 md:pt-0">
          <div className="space-y-1">
            <Link href={`/brands/${brand.slug}`} className="ltr block text-end text-sm font-bold text-brand">
              {brand.name}
            </Link>
            <h1 className="text-xl font-extrabold leading-snug md:text-2xl">{product.name}</h1>
            <p className="ltr text-end text-[13px] text-muted">{product.nameEn}</p>
            <p className="text-[13px] text-muted">اندازه: {product.size}</p>
          </div>

          <div className="flex items-end justify-between rounded-2xl bg-surface p-4 ring-1 ring-line">
            <div>
              {off > 0 && <p className="text-sm text-muted line-through">{formatAfn(product.oldPrice!)}</p>}
              <p className="text-2xl font-extrabold">{formatAfn(product.price)}</p>
            </div>
            <span
              className={
                product.inStock
                  ? "rounded-full bg-ok-soft px-3 py-1 text-sm font-bold text-ok"
                  : "rounded-full bg-line px-3 py-1 text-sm font-bold text-muted"
              }
            >
              {product.inStock ? "موجود است" : "ختم شده"}
            </span>
          </div>

          <ProductPurchase product={product} />

          {/* Trust row: the core answer to counterfeit and expired goods */}
          <ul className="grid grid-cols-2 gap-2 text-[13px]">
            <li className="flex items-center gap-2 rounded-xl bg-ok-soft p-3 font-bold text-ok">
              <BadgeCheck className="size-5 shrink-0" /> اصل و اورجینال
            </li>
            <li className="flex items-center gap-2 rounded-xl bg-surface p-3 ring-1 ring-line">
              <CalendarCheck className="size-5 shrink-0 text-brand" />
              <span>
                تاریخ ختم: <b className="ltr">{expiry}</b>
              </span>
            </li>
            <li className="flex items-center gap-2 rounded-xl bg-surface p-3 ring-1 ring-line">
              <Globe className="size-5 shrink-0 text-brand" /> ساخت: {brand.origin}
            </li>
            <li className="flex items-center gap-2 rounded-xl bg-surface p-3 ring-1 ring-line">
              <Factory className="size-5 shrink-0 text-brand" /> وارد کننده: {product.importer}
            </li>
          </ul>

          <p className="flex items-start gap-2 rounded-xl bg-gold-soft p-3 text-[13px] leading-6">
            <Truck className="mt-0.5 size-5 shrink-0 text-gold" />
            <span>
              کابل: {kabul.eta} • ولایات: ۲ تا ۵ روز • کرایه کابل: {formatAfn(kabul.fee)}{" "}
              <Link href="/info/delivery" className="font-medium text-brand">
                (جزئیات)
              </Link>
            </span>
          </p>

          <section>
            <h2 className="mb-2 font-bold">معرفی</h2>
            <ul className="list-disc space-y-1 ps-5 text-[14px] leading-7">
              {product.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {product.skinTypes && (
              <p className="mt-2 text-[13px] text-muted">
                مناسب پوست:{" "}
                {product.skinTypes
                  .map((s) => ({ oily: "چرب", dry: "خشک", combination: "مختلط", sensitive: "حساس", acne: "جوش دار" })[s])
                  .join("، ")}
              </p>
            )}
          </section>

          <div className="divide-y divide-line rounded-2xl bg-surface ring-1 ring-line">
            {product.howToUse && <Collapsible title="طریقه استفاده">{product.howToUse}</Collapsible>}
            {product.ingredients && (
              <Collapsible title="ترکیبات و هشدارها">
                <span className="ltr block text-start">{product.ingredients}</span>
              </Collapsible>
            )}
            {product.genuineTip && (
              <Collapsible title="چطور بفهمیم اصل است؟" icon>
                {product.genuineTip}
              </Collapsible>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="اجناس مشابه" href={`/c/${category.slug}`} />
          <ProductRow products={related} />
        </section>
      )}
    </div>
  );
}

function Collapsible({ title, children, icon }: { title: string; children: React.ReactNode; icon?: boolean }) {
  return (
    <details className="group px-4">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 font-medium">
        <span className="flex items-center gap-2">
          {icon && <ShieldQuestion className="size-5 text-ok" />}
          {title}
        </span>
        <ChevronDown className="size-4.5 text-muted transition group-open:rotate-180" />
      </summary>
      <div className="pb-4 text-[14px] leading-7 text-ink/85">{children}</div>
    </details>
  );
}
