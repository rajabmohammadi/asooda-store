import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CartBadgeLink } from "@/components/CartBadgeLink";
import { categories } from "@/data/catalog";
import { store } from "@/lib/config";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="bg-brand text-center text-[12px] font-medium text-white">
        <p className="mx-auto max-w-6xl truncate px-4 py-1.5">پرداخت نقد در وقت تحویل • اجناس اصل • کابل: تحویل امروز یا فردا</p>
      </div>

      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-1.5">
        <Link href="/" className="shrink-0" aria-label={`${store.name} - صفحه اصلی`}>
          <Image src="/logo.png" alt={`${store.name} - ${store.nameLatin}`} width={236} height={133} priority className="h-11 w-auto md:h-13" />
        </Link>

        <form action="/search" className="relative min-w-0 flex-1">
          <label htmlFor="site-search" className="sr-only">
            جستجو
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="جنس یا برند را جستجو کنید"
            className="h-10 w-full rounded-full border border-line bg-bg pe-10 ps-4 text-sm outline-none placeholder:text-muted focus:border-brand"
          />
          <button type="submit" aria-label="جستجو" className="absolute inset-y-0 end-0 grid w-10 place-items-center text-muted">
            <Search className="size-4.5" />
          </button>
        </form>

        <div className="hidden md:block">
          <CartBadgeLink />
        </div>
      </div>

      <nav aria-label="دسته بندی ها" className="hidden border-t border-line md:block">
        <ul className="mx-auto flex max-w-6xl gap-6 px-4 text-sm font-medium">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/c/${c.slug}`} className="block py-2.5 text-ink/80 hover:text-brand">
                {c.name}
              </Link>
            </li>
          ))}
          <li className="ms-auto">
            <Link href="/brands" className="block py-2.5 text-ink/80 hover:text-brand">
              برندها
            </Link>
          </li>
          <li>
            <Link href="/c/discounts" className="block py-2.5 font-bold text-brand">
              تخفیف ها
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
