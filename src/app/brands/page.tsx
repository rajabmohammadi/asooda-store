import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/sections";
import { brands, products } from "@/data/catalog";
import { toFaDigits } from "@/lib/format";

export const metadata: Metadata = { title: "برندها" };

export default function BrandsPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "برندها" }]} />
      <h1 className="px-4 text-xl font-extrabold">برندها</h1>
      <ul className="mt-4 grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 md:grid-cols-4">
        {brands.map((b) => (
          <li key={b.slug}>
            <Link href={`/brands/${b.slug}`} className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-surface p-4 text-center">
              <span className="ltr text-lg font-extrabold" style={{ color: b.color }}>
                {b.name}
              </span>
              <span className="text-[12px] text-muted">
                {b.nameFa} • {b.origin}
              </span>
              <span className="text-[11px] text-muted">{toFaDigits(products.filter((p) => p.brand === b.slug).length)} جنس</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
