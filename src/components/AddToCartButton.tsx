"use client";

import { Check, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useCart } from "@/components/CartProvider";
import type { Product } from "@/data/catalog";
import { cn } from "@/lib/format";

type Props = { product: Product; shade?: string; compact?: boolean; className?: string };

export function AddToCartButton({ product, shade, compact, className }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  // Products with shades must be chosen on the product page first
  const needsShade = !!product.shades?.length && !shade;

  if (compact) {
    if (!product.inStock) return null;
    if (needsShade) {
      return (
        <Link
          href={`/p/${product.slug}`}
          className="shrink-0 rounded-full border border-brand px-2.5 py-1 text-[12px] font-bold text-brand"
        >
          انتخاب رنگ
        </Link>
      );
    }
    return (
      <button
        type="button"
        onClick={() => {
          add(product.slug);
          setAdded(true);
        }}
        aria-label={`${product.name} را به سبد اضافه کنید`}
        className={cn(
          "flex shrink-0 items-center gap-0.5 rounded-full px-2.5 py-1 text-[12px] font-bold transition",
          added ? "bg-ok text-white" : "bg-brand text-white active:scale-95",
        )}
      >
        {added ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
        سبد
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={!product.inStock || needsShade}
      onClick={() => {
        add(product.slug, shade);
        setAdded(true);
      }}
      className={cn(
        "flex min-h-12 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[14px] leading-tight font-bold transition disabled:cursor-not-allowed disabled:bg-line disabled:text-muted",
        added ? "bg-ok text-white" : "bg-brand text-white hover:bg-brand-dark active:scale-[.98]",
        className,
      )}
    >
      {added ? <Check className="size-5" /> : null}
      {!product.inStock ? "ناموجود" : added ? "به سبد اضافه شد" : needsShade ? "اول رنگ را انتخاب کنید" : "به سبد اضافه کنید"}
    </button>
  );
}
