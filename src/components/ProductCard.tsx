import { BadgeCheck } from "lucide-react";
import Link from "next/link";

import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductArt } from "@/components/ProductArt";
import { getBrand, type Product } from "@/data/catalog";
import { cn, discountPercent, formatAfn, toFaDigits } from "@/lib/format";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const brand = getBrand(product.brand);
  const off = discountPercent(product.price, product.oldPrice);

  return (
    <article className={cn("group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface", className)}>
      <Link href={`/p/${product.slug}`} className="relative block aspect-square bg-gradient-to-b from-bg to-brand-soft/40">
        <ProductArt
          shape={product.shape}
          color={product.color}
          label={product.name}
          className={cn("size-full p-4 transition group-hover:scale-105", !product.inStock && "opacity-45 grayscale")}
        />
        <div className="absolute inset-x-2 top-2 flex items-start justify-between">
          {off > 0 ? (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">{toFaDigits(off)}٪</span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-0.5 rounded-full bg-surface/90 px-1.5 py-0.5 text-[10px] font-bold text-ok">
            <BadgeCheck className="size-3.5" /> اصل
          </span>
        </div>
        {!product.inStock && (
          <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-ink/80 px-3 py-0.5 text-[11px] text-white">ناموجود</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="ltr text-end text-[11px] font-medium text-muted">{brand?.name}</p>
        <h3 className="line-clamp-2 min-h-[2.8em] text-[13px] font-medium leading-snug">
          <Link href={`/p/${product.slug}`}>{product.name}</Link>
        </h3>
        {product.shades && <p className="text-[11px] text-muted">{toFaDigits(product.shades.length)} رنگ</p>}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="leading-tight">
            {off > 0 && <p className="text-[11px] text-muted line-through">{formatAfn(product.oldPrice!)}</p>}
            <p className="text-[15px] font-bold">{formatAfn(product.price)}</p>
          </div>
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
