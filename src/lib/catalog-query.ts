import { brands, products, type Product, type SkinType } from "@/data/catalog";
import { priceBuckets, type SortId } from "@/lib/config";
import { normalizeSearch } from "@/lib/format";

export const discounted = () =>
  products.filter((p) => p.oldPrice && p.oldPrice > p.price && p.inStock).sort((a, b) => b.oldPrice! / b.price - a.oldPrice! / a.price);

export const bestSellers = () => products.filter((p) => p.inStock).sort((a, b) => b.sold - a.sold);

export const newArrivals = () => [...products].sort((a, b) => b.addedAt.localeCompare(a.addedAt));

export type Filters = {
  brands: string[];
  price?: string;
  skin: SkinType[];
  inStock: boolean;
  sub?: string;
};

export function applyFilters(list: Product[], f: Filters) {
  const bucket = priceBuckets.find((b) => b.id === f.price);
  return list.filter(
    (p) =>
      (!f.sub || p.sub === f.sub) &&
      (!f.brands.length || f.brands.includes(p.brand)) &&
      (!bucket || (p.price >= bucket.min && p.price <= bucket.max)) &&
      (!f.skin.length || f.skin.some((s) => p.skinTypes?.includes(s))) &&
      (!f.inStock || p.inStock),
  );
}

export function sortProducts(list: Product[], sort: SortId) {
  const sorted = [...list].sort((a, b) => {
    switch (sort) {
      case "cheapest":
        return a.price - b.price;
      case "expensive":
        return b.price - a.price;
      case "bestselling":
        return b.sold - a.sold;
      default:
        return b.addedAt.localeCompare(a.addedAt);
    }
  });
  // Out-of-stock items stay visible but go last
  return [...sorted.filter((p) => p.inStock), ...sorted.filter((p) => !p.inStock)];
}

/** Matches Dari names, English names and brand names in either script. */
export function searchProducts(query: string) {
  const q = normalizeSearch(query);
  if (!q) return [];
  const terms = q.split(" ");
  return products.filter((p) => {
    const brand = brands.find((b) => b.slug === p.brand);
    const haystack = normalizeSearch([p.name, p.nameEn, brand?.name, brand?.nameFa].join(" "));
    return terms.every((t) => haystack.includes(t));
  });
}
