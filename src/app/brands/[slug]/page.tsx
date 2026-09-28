import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumb, ProductGrid } from "@/components/sections";
import { brands, getBrand, products } from "@/data/catalog";
import { sortProducts } from "@/lib/catalog-query";
import { toFaDigits } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = getBrand((await params).slug);
  return { title: b ? `${b.nameFa} (${b.name})` : "یافت نشد" };
}

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export default async function BrandPage({ params }: Props) {
  const brand = getBrand((await params).slug);
  if (!brand) notFound();
  const list = sortProducts(
    products.filter((p) => p.brand === brand.slug),
    "bestselling",
  );

  return (
    <div>
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "برندها", href: "/brands" }, { label: brand.nameFa }]} />
      <header className="mx-4 mb-5 rounded-3xl border border-line bg-surface p-5 text-center">
        <h1 className="ltr text-3xl font-extrabold" style={{ color: brand.color }}>
          {brand.name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {brand.nameFa} • ساخت {brand.origin} • {toFaDigits(list.length)} جنس
        </p>
        {/* TODO phase 2: short brand story */}
      </header>
      <ProductGrid products={list} />
    </div>
  );
}
