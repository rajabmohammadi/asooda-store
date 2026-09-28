import { Banknote, BadgeCheck, ChevronLeft, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";

import { ProductArt } from "@/components/ProductArt";
import { products, type Product } from "@/data/catalog";
import { discounted } from "@/lib/catalog-query";
import { discountPercent, formatAfn, toFaDigits } from "@/lib/format";

const bySlug = (slug: string) => products.find((p) => p.slug === slug) as Product;

/**
 * Static hero (no auto-rotating slider, to save data). Decoration is pure CSS/SVG,
 * so the banner costs no image downloads.
 */
export function HomeHero() {
  const featured = bySlug("neutrogena-ultra-sheer-spf50");
  const side = [bySlug("garnier-vitamin-c-serum"), bySlug("golden-rose-velvet-matte-lipstick")];
  const topDeal = discounted()[0];
  const maxOff = topDeal ? discountPercent(topDeal.price, topDeal.oldPrice) : 0;
  const featuredOff = discountPercent(featured.price, featured.oldPrice);

  return (
    <section className="relative mx-4 overflow-hidden rounded-3xl bg-brand-dark text-white">
      {/* Decorative layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 100% 0%, #9b1d6c 0%, transparent 60%), radial-gradient(50% 70% at 0% 100%, #b7862f55 0%, transparent 60%), linear-gradient(135deg, #74114f, #3f0729)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "14px 14px" }}
      />

      <div className="relative grid items-center gap-4 p-5 sm:grid-cols-[1.15fr_1fr] md:gap-8 md:p-10">
        {/* Copy */}
        <div className="space-y-4">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-medium backdrop-blur">
            <BadgeCheck className="size-4 text-gold-soft" /> ضمانت اصل بودن و تاریخ ختم
          </p>

          <h1 className="text-[26px] font-extrabold leading-snug md:text-[42px] md:leading-tight">
            معتبرترین فروشگاه
            <br />
            <span className="bg-gradient-to-l from-[#f3d08a] to-[#fff4dc] bg-clip-text text-transparent">آرایشی و بهداشتی</span>
          </h1>

          <p className="max-w-md text-sm text-white/80 md:text-base">
            محصولات اورجینال با ضمانت اصالت. پول را وقت تحویل گرفتن بپردازید؛ اول جنس را ببینید.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/c/discounts"
              className="inline-flex items-center gap-1 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand shadow-lg shadow-black/20 transition hover:bg-brand-soft"
            >
              {maxOff > 0 ? `تا ${toFaDigits(maxOff)}٪ تخفیف` : "دیدن تخفیف ها"}
              <ChevronLeft className="size-4" />
            </Link>
            <Link
              href="/c/bestsellers"
              className="inline-flex items-center rounded-xl border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              پرفروش ترین ها
            </Link>
          </div>

          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-[12px] text-white/75">
            <li className="flex items-center gap-1.5">
              <Banknote className="size-4 text-gold-soft" /> پرداخت در وقت تحویل
            </li>
            <li className="flex items-center gap-1.5">
              <RefreshCw className="size-4 text-gold-soft" /> تبدیلی تا ۷ روز
            </li>
          </ul>
        </div>

        {/* Product stage */}
        <div className="relative mx-auto aspect-[5/4] w-full max-w-[300px] sm:max-w-[340px] md:max-w-[420px]">
          <div aria-hidden className="absolute bottom-[4%] left-1/2 aspect-square h-[92%] -translate-x-1/2 rounded-full bg-white/10 ring-1 ring-white/15" />
          <div aria-hidden className="absolute inset-x-[20%] bottom-[14%] top-[16%] rounded-full bg-white/10 blur-2xl" />
          <Sparkles aria-hidden className="absolute end-[10%] top-[6%] size-5 text-gold-soft/80" />
          <Sparkles aria-hidden className="absolute start-[6%] bottom-[30%] size-4 text-gold-soft/60" />

          <ProductArt
            shape={side[0].shape}
            color={side[0].color}
            className="absolute bottom-[8%] start-[4%] w-[34%] -rotate-6 drop-shadow-xl"
          />
          <ProductArt
            shape={side[1].shape}
            color={side[1].color}
            className="absolute bottom-[8%] end-[4%] w-[32%] rotate-6 drop-shadow-xl"
          />
          <ProductArt
            shape={featured.shape}
            color={featured.color}
            label={featured.name}
            className="absolute bottom-[4%] left-1/2 w-[46%] -translate-x-1/2 drop-shadow-2xl"
          />

          {/* Price tag for the featured product */}
          <Link
            href={`/p/${featured.slug}`}
            className="absolute start-0 top-[2%] whitespace-nowrap rounded-2xl bg-white py-2 ps-3 pe-6 text-ink shadow-xl shadow-black/25 transition hover:-translate-y-0.5"
          >
            <span className="block text-[11px] leading-tight text-muted">ضد آفتاب نیتروژینا</span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-sm font-extrabold text-brand">{formatAfn(featured.price)}</span>
              {featured.oldPrice && <s className="text-[11px] text-muted">{formatAfn(featured.oldPrice)}</s>}
            </span>
            {featuredOff > 0 && (
              <span className="absolute -end-2 -top-2 grid size-8 place-items-center rounded-full bg-gold text-[11px] font-bold text-white">
                {toFaDigits(featuredOff)}٪
              </span>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}
