"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getProduct } from "@/data/catalog";

export type CartLine = { slug: string; shade?: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (slug: string, shade?: string, qty?: number) => void;
  setQty: (slug: string, shade: string | undefined, qty: number) => void;
  remove: (slug: string, shade?: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "asooda-cart";

const sameLine = (l: CartLine, slug: string, shade?: string) => l.slug === slug && l.shade === shade;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CartLine[];
      setLines(saved.filter((l) => getProduct(l.slug)));
    } catch {
      // storage unavailable or corrupt: start with an empty cart
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore quota/private-mode errors
    }
  }, [lines, ready]);

  const add = useCallback((slug: string, shade?: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(l, slug, shade));
      if (existing) return prev.map((l) => (l === existing ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { slug, shade, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, shade: string | undefined, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => !sameLine(l, slug, shade)) : prev.map((l) => (sameLine(l, slug, shade) ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((slug: string, shade?: string) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, slug, shade)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
    return { lines, ready, count, subtotal, add, setQty, remove, clear };
  }, [lines, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
