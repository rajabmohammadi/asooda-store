import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CategoryIcon } from "@/components/icons";
import { categories } from "@/data/catalog";

export const metadata: Metadata = { title: "دسته بندی ها" };

const collections = [
  { href: "/c/discounts", label: "تخفیف ها" },
  { href: "/c/new", label: "اجناس نو" },
  { href: "/c/bestsellers", label: "پرفروش ترین ها" },
  { href: "/brands", label: "برندها" },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-4 px-4 pt-4">
      <h1 className="text-xl font-extrabold">دسته بندی ها</h1>

      <ul className="grid grid-cols-2 gap-2">
        {collections.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="block rounded-xl bg-brand-soft px-4 py-3 text-center text-sm font-bold text-brand">
              {c.label}
            </Link>
          </li>
        ))}
      </ul>

      <ul className="space-y-3">
        {categories.map((c) => (
          <li key={c.slug} className="overflow-hidden rounded-2xl border border-line bg-surface">
            <Link href={`/c/${c.slug}`} className="flex items-center gap-3 p-3">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-soft text-brand">
                <CategoryIcon icon={c.icon} className="size-6" />
              </span>
              <span className="flex-1 font-bold">{c.name}</span>
              <ChevronLeft className="size-5 text-muted" />
            </Link>
            <ul className="flex flex-wrap gap-2 border-t border-line p-3">
              {c.subs.map((s) => (
                <li key={s.slug}>
                  <Link href={`/c/${c.slug}?sub=${s.slug}`} className="block rounded-full bg-bg px-3 py-1.5 text-[13px]">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
