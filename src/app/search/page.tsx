import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons";
import { ProductGrid } from "@/components/sections";
import { brands } from "@/data/catalog";
import { searchProducts, sortProducts } from "@/lib/catalog-query";
import { store } from "@/lib/config";
import { toFaDigits, whatsappLink } from "@/lib/format";

export const metadata: Metadata = { title: "جستجو" };

const popular = ["ضد آفتاب", "مسکارا", "لب سرین", "سیروم", "Nivea", "Garnier"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim();
  const results = q ? sortProducts(searchProducts(q), "bestselling") : [];

  return (
    <div className="pt-4">
      <form action="/search" className="relative mx-4 md:hidden">
        <input
          name="q"
          type="search"
          defaultValue={q}
          autoFocus={!q}
          placeholder="جنس یا برند را جستجو کنید"
          aria-label="جستجو"
          className="h-12 w-full rounded-2xl border border-line bg-surface pe-12 ps-4 outline-none focus:border-brand"
        />
        <button type="submit" aria-label="جستجو" className="absolute inset-y-0 end-0 grid w-12 place-items-center text-muted">
          <Search className="size-5" />
        </button>
      </form>

      {!q ? (
        <div className="space-y-6 px-4 pt-5">
          <section>
            <h2 className="mb-2 font-bold">جستجوهای پرطرفدار</h2>
            <ul className="flex flex-wrap gap-2">
              {popular.map((p) => (
                <li key={p}>
                  <Link href={`/search?q=${encodeURIComponent(p)}`} className="block rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm">
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-2 font-bold">برندها</h2>
            <ul className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <li key={b.slug}>
                  <Link href={`/brands/${b.slug}`} className="ltr block rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <>
          <h1 className="px-4 py-4 text-lg font-bold">
            نتیجه برای «{q}»: {toFaDigits(results.length)} جنس
          </h1>
          {results.length ? (
            <ProductGrid products={results} />
          ) : (
            <div className="mx-4 space-y-3 rounded-2xl border border-dashed border-line p-8 text-center">
              <p className="text-muted">جنسی پیدا نشد. شاید املای دیگری را امتحان کنید، یا از ما در واتساپ بپرسید.</p>
              <a
                href={whatsappLink(store.whatsapp, `سلام، دنبال این جنس هستم: ${q}`)}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-xl bg-wa px-5 py-2.5 font-bold text-white"
              >
                <WhatsAppIcon className="size-5" /> در واتساپ بپرسید
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
