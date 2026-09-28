import { BadgeCheck, LayoutGrid, MousePointerClick, PhoneCall, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { CategoryIcon } from "@/components/icons";
import { ProductArt } from "@/components/ProductArt";
import { ProductRow, SectionHeader, TrustStrip } from "@/components/sections";
import { brands, categories, products, skinTypes } from "@/data/catalog";
import { bestSellers, discounted } from "@/lib/catalog-query";

const skinTiles = skinTypes.slice(0, 4);
const skinTileColors = ["#fde2c8", "#e3eefc", "#eee3f7", "#e2f3e7"];

export default function HomePage() {
  const featured = products.find((p) => p.slug === "neutrogena-ultra-sheer-spf50")!;

  return (
    <div className="space-y-8 pt-4">
      {/* Static hero: no auto-rotating slider, to save data */}
      <section className="mx-4 overflow-hidden rounded-3xl bg-gradient-to-l from-brand to-brand-dark text-white">
        <div className="flex items-center gap-2 p-5 md:p-10">
          <div className="flex-1 space-y-3">
            <p className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium">
              <BadgeCheck className="size-4" /> ضمانت اصل بودن و تاریخ ختم
            </p>
            <h1 className="text-2xl font-extrabold leading-tight md:text-4xl">
             معتبر ترین فروشگاه آرایشی و بهداشتی
              <br />
             محصولات اورجینال با ضمانت اصالت
            </h1>
            <p className="text-sm text-white/85 md:text-base">پول را وقت تحویل گرفتن بپردازید. اول جنس را ببینید.</p>
            <Link
              href="/c/discounts"
              className="inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand shadow-sm hover:bg-brand-soft"
            >
              دیدن تخفیف ها
            </Link>
          </div>
          <ProductArt shape={featured.shape} color={featured.color} className="w-28 shrink-0 drop-shadow-xl md:w-56" />
        </div>
      </section>

      {/* Category grid, 2 rows × 4 */}
      <section aria-labelledby="cats-title">
        <h2 id="cats-title" className="sr-only">
          دسته بندی ها
        </h2>
        <ul className="grid grid-cols-4 gap-x-2 gap-y-4 px-4 md:grid-cols-8">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/c/${c.slug}`} className="flex flex-col items-center gap-1.5 text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand md:size-16">
                  <CategoryIcon icon={c.icon} className="size-7" />
                </span>
                <span className="text-[12px] font-medium leading-tight">{c.short}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/categories" className="flex flex-col items-center gap-1.5 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-gold-soft text-gold md:size-16">
                <LayoutGrid className="size-7" strokeWidth={1.6} />
              </span>
              <span className="text-[12px] font-medium leading-tight">همه</span>
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <SectionHeader title="تخفیف ها" href="/c/discounts" />
        <ProductRow products={discounted().slice(0, 10)} />
      </section>

      <section aria-label="چرا آسودا">
        <TrustStrip />
      </section>

      <section>
        <SectionHeader title="پرفروش ترین ها" href="/c/bestsellers" />
        <ProductRow products={bestSellers().slice(0, 10)} />
      </section>

      <section>
        <SectionHeader title="خرید بر اساس نوع پوست" />
        <ul className="grid grid-cols-2 gap-3 px-4 md:grid-cols-4">
          {skinTiles.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/c/skincare?skin=${s.id}`}
                className="flex h-20 items-center justify-between rounded-2xl px-4 font-bold"
                style={{ background: skinTileColors[i] }}
              >
                پوست {s.label}
                <span className="text-xl opacity-60">←</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeader title="برندها" href="/brands" />
        <ul className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {brands.map((b) => (
            <li key={b.slug} className="shrink-0">
              <Link
                href={`/brands/${b.slug}`}
                className="ltr grid h-14 min-w-28 place-items-center rounded-xl border border-line bg-surface px-4 text-sm font-extrabold"
                style={{ color: b.color }}
              >
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4">
        <div className="rounded-3xl border border-line bg-surface p-5">
          <h2 className="mb-4 text-lg font-bold">سفارش در ۳ قدم</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              { Icon: MousePointerClick, title: "جنس را انتخاب کنید", text: "به سبد اضافه کنید" },
              { Icon: ShoppingBag, title: "«ثبت سفارش» را بزنید", text: "فقط نام، شماره و آدرس" },
              { Icon: PhoneCall, title: "ما زنگ می زنیم و تحویل می دهیم", text: "پول را وقت تحویل بپردازید" },
            ].map(({ Icon, title, text }, i) => (
              <li key={title} className="flex items-center gap-3">
                <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <Icon className="size-5.5" />
                  <span className="absolute -end-1 -top-1 grid size-5 place-items-center rounded-full bg-brand text-[11px] font-bold text-white">
                    {["۱", "۲", "۳"][i]}
                  </span>
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-1 text-[12px] text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/info/how-to-order" className="mt-4 inline-block text-sm font-medium text-brand">
            رهنمای کامل خرید ←
          </Link>
        </div>
      </section>

      {/* TODO: customer feedback screenshots (real, with consent, no faces) go here once collected */}
    </div>
  );
}
