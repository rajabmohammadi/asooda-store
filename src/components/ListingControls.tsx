"use client";

import { ArrowUpDown, Check, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { brands, type Product, skinTypes } from "@/data/catalog";
import { applyFilters, type Filters } from "@/lib/catalog-query";
import { priceBuckets, sortOptions, type SortId } from "@/lib/config";
import { cn, toFaDigits } from "@/lib/format";

type Props = { pool: Product[]; initial: Filters; sort: SortId; showSkin: boolean };

export function ListingControls({ pool, initial, sort, showSkin }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);
  const [draft, setDraft] = useState<Filters>(initial);

  useEffect(() => setDraft(initial), [initial]);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const poolBrands = useMemo(() => brands.filter((b) => pool.some((p) => p.brand === b.slug)), [pool]);
  const count = applyFilters(pool, draft).length;
  const activeCount = initial.brands.length + initial.skin.length + (initial.price ? 1 : 0) + (initial.inStock ? 1 : 0);

  const navigate = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k));
    next.delete("page");
    const s = next.toString();
    router.push(`${pathname}${s ? `?${s}` : ""}`, { scroll: false });
    setSheet(null);
  };

  const applyDraft = () =>
    navigate({
      brand: draft.brands.join(",") || undefined,
      skin: draft.skin.join(",") || undefined,
      price: draft.price,
      stock: draft.inStock ? "1" : undefined,
    });

  const toggle = <K extends "brands" | "skin">(key: K, value: Filters[K][number]) =>
    setDraft((d) => {
      const list = d[key] as string[];
      return { ...d, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] };
    });

  return (
    <>
      <div className="flex gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setSheet("filter")}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-sm font-medium"
        >
          <SlidersHorizontal className="size-4" /> فیلتر
          {activeCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-brand text-[11px] font-bold text-white">{toFaDigits(activeCount)}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setSheet("sort")}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-sm font-medium"
        >
          <ArrowUpDown className="size-4" /> {sortOptions.find((o) => o.id === sort)?.label}
        </button>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" role="dialog" aria-modal="true">
          <button type="button" aria-label="بستن" className="absolute inset-0 bg-black/40" onClick={() => setSheet(null)} />
          <div className="relative flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-3xl bg-surface md:rounded-3xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-bold">{sheet === "filter" ? "فیلتر" : "ترتیب"}</h2>
              <button type="button" onClick={() => setSheet(null)} aria-label="بستن" className="grid size-8 place-items-center rounded-full bg-bg">
                <X className="size-4.5" />
              </button>
            </div>

            {sheet === "sort" ? (
              <ul className="p-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
                {sortOptions.map((o) => (
                  <li key={o.id}>
                    <button
                      type="button"
                      onClick={() => navigate({ sort: o.id })}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-start hover:bg-bg"
                    >
                      {o.label}
                      {o.id === sort && <Check className="size-5 text-brand" />}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
                  <label className="flex items-center justify-between">
                    <span className="font-medium">فقط اجناس موجود</span>
                    <input
                      type="checkbox"
                      checked={draft.inStock}
                      onChange={(e) => setDraft((d) => ({ ...d, inStock: e.target.checked }))}
                      className="size-5 accent-brand"
                    />
                  </label>

                  <fieldset>
                    <legend className="mb-2 font-bold">قیمت</legend>
                    <div className="flex flex-wrap gap-2">
                      {priceBuckets.map((b) => (
                        <Chip
                          key={b.id}
                          active={draft.price === b.id}
                          onClick={() => setDraft((d) => ({ ...d, price: d.price === b.id ? undefined : b.id }))}
                        >
                          {b.label} ؋
                        </Chip>
                      ))}
                    </div>
                  </fieldset>

                  {showSkin && (
                    <fieldset>
                      <legend className="mb-2 font-bold">نوع پوست</legend>
                      <div className="flex flex-wrap gap-2">
                        {skinTypes.map((s) => (
                          <Chip key={s.id} active={draft.skin.includes(s.id)} onClick={() => toggle("skin", s.id)}>
                            {s.label}
                          </Chip>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  {poolBrands.length > 1 && (
                    <fieldset>
                      <legend className="mb-2 font-bold">برند</legend>
                      <div className="flex flex-wrap gap-2">
                        {poolBrands.map((b) => (
                          <Chip key={b.slug} active={draft.brands.includes(b.slug)} onClick={() => toggle("brands", b.slug)}>
                            <span className="ltr">{b.name}</span>
                          </Chip>
                        ))}
                      </div>
                    </fieldset>
                  )}
                </div>

                <div className="flex gap-2 border-t border-line p-4 pb-[max(env(safe-area-inset-bottom),1rem)]">
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, brands: [], skin: [], price: undefined, inStock: false })}
                    className="h-12 rounded-xl border border-line px-4 text-sm font-medium"
                  >
                    پاک کردن
                  </button>
                  <button
                    type="button"
                    onClick={applyDraft}
                    disabled={count === 0}
                    className="h-12 flex-1 rounded-xl bg-brand font-bold text-white disabled:bg-line disabled:text-muted"
                  >
                    {count ? `نمایش ${toFaDigits(count)} جنس` : "جنسی پیدا نشد"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[13px] font-medium",
        active ? "border-brand bg-brand-soft text-brand" : "border-line text-ink/80",
      )}
    >
      {children}
    </button>
  );
}
