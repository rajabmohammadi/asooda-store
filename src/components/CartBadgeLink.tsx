"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/components/CartProvider";
import { toFaDigits } from "@/lib/format";

export function CartBadgeLink() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`سبد خرید، ${toFaDigits(count)} جنس`}
      className="relative grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -end-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold leading-5 text-white">
          {toFaDigits(count)}
        </span>
      )}
    </Link>
  );
}
