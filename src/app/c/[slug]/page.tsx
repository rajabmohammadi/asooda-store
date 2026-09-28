import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ListingControls } from "@/components/ListingControls";
import { Breadcrumb, ProductGrid } from "@/components/sections";
import { categories, getCategory, products, type Product, type SkinType, skinTypes } from "@/data/catalog";
import { applyFilters, bestSellers, discounted, newArrivals, sortProducts } from "@/lib/catalog-query";
import { sortOptions, type SortId } from "@/lib/config";
import { cn, toFaDigits } from "@/lib/format";

const PAGE_SIZE = 20;

const collections: Record<string, { name: string; list: () => Product[]; defaultSort: SortId }> = {
  discounts: { name: "تخفیف ها", list: discounted, defaultSort: "newest" },
  bestsellers: { name: "پرفروش ترین ها", list: bestSellers, defaultSort: "bestselling" },
  new: { name: "اجناس نو", list: newArrivals, defaultSort: "newest" },
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const asArray = (v: string | string[] | undefined) => (v ? (Array.isArray(v) ? v : v.split(",")) : []);

function resolve(slug: string) {
  const category = getCategory(slug);
  if (category) return { name: category.name, base: products.filter((p) => p.category === slug), category, defaultSort: "newest" as SortId };
  const col = collections[slug];
  if (col) return { name: col.name, base: col.list(), category: undefined, defaultSort: col.defaultSort };
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = resolve((await params).slug);
  return { title: found?.name ?? "یافت نشد" };
}

export function generateStaticParams() {
  return [...categories.map((c) => ({ slug: c.slug })), ...Object.keys(collections).map((slug) => ({ slug }))];
}

export default async function ListingPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const found = resolve(slug);
  if (!found) notFound();

  const { name, base, category, defaultSort } = found;
  const sub = typeof sp.sub === "string" ? sp.sub : undefined;
  const filters = {
    sub,
    brands: asArray(sp.brand),
    price: typeof sp.price === "string" ? sp.price : undefined,
    skin: asArray(sp.skin).filter((s): s is SkinType => skinTypes.some((t) => t.id === s)),
    inStock: sp.stock === "1",
  };
  const sort = (sortOptions.find((o) => o.id === sp.sort)?.id ?? defaultSort) as SortId;
  const page = Math.max(1, Number(sp.page) || 1);

  const results = sortProducts(applyFilters(base, filters), sort);
  const visible = results.slice(0, page * PAGE_SIZE);
  const subName = category?.subs.find((s) => s.slug === sub)?.name;

  const qs = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) if (typeof v === "string") next.set(k, v);
    for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k));
    const s = next.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          subName ? { label: name, href: `/c/${slug}` } : { label: name },
          ...(subName ? [{ label: subName }] : []),
        ]}
      />

      <h1 className="px-4 text-xl font-extrabold">{subName ?? name}</h1>

      {category && (
        <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4">
          {[{ slug: undefined, name: "همه" }, ...category.subs].map((s) => {
            const active = s.slug === sub;
            return (
              <li key={s.slug ?? "all"} className="shrink-0">
                <Link
                  href={`/c/${slug}${qs({ sub: s.slug, page: undefined })}`}
                  className={cn(
                    "block rounded-full border px-3.5 py-1.5 text-[13px] font-medium",
                    active ? "border-brand bg-brand text-white" : "border-line bg-surface text-ink/80",
                  )}
                >
                  {s.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <ListingControls
        pool={applyFilters(base, { ...filters, brands: [], price: undefined, skin: [], inStock: false })}
        initial={filters}
        sort={sort}
        showSkin={slug === "skincare" || base.some((p) => p.skinTypes?.length)}
      />

      {visible.length ? (
        <ProductGrid products={visible} />
      ) : (
        <div className="mx-4 rounded-2xl border border-dashed border-line p-8 text-center text-muted">
          جنسی با این فیلترها پیدا نشد.
          <Link href={`/c/${slug}`} className="mt-2 block font-medium text-brand">
            پاک کردن فیلترها
          </Link>
        </div>
      )}

      {results.length > visible.length && (
        <div className="mt-6 px-4 text-center">
          <Link
            href={`/c/${slug}${qs({ page: String(page + 1) })}`}
            scroll={false}
            className="inline-block rounded-xl border border-brand px-8 py-2.5 font-bold text-brand"
          >
            بیشتر ببینید ({toFaDigits(results.length - visible.length)})
          </Link>
        </div>
      )}
    </div>
  );
}
