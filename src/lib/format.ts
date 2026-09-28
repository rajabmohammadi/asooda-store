import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const faDigits = "۰۱۲۳۴۵۶۷۸۹";

/** Converts Western digits to Persian (Dari) digits. */
export function toFaDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => faDigits[Number(d)]);
}

/** Converts Persian and Arabic-Indic digits to Western digits. */
export function toEnDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/** 1250 → "۱٬۲۵۰ ؋" */
export function formatAfn(amount: number) {
  const grouped = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  return `${toFaDigits(grouped)} ؋`;
}

export function discountPercent(price: number, oldPrice?: number) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/**
 * Normalises an Afghan mobile number. Accepts 07XXXXXXXX, 7XXXXXXXX,
 * +937XXXXXXXX, 00937XXXXXXXX, with Western or Eastern digits.
 * Returns "07XXXXXXXX" or null.
 */
export function normalizeAfPhone(input: string) {
  const digits = toEnDigits(input).replace(/[^\d]/g, "");
  let local = digits;
  if (local.startsWith("0093")) local = local.slice(4);
  else if (local.startsWith("93")) local = local.slice(2);
  if (local.startsWith("0")) local = local.slice(1);
  return /^7\d{8}$/.test(local) ? `0${local}` : null;
}

export function whatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/** Folds Arabic/Persian letter variants so search is tolerant of spelling. */
export function normalizeSearch(value: string) {
  return toEnDigits(value)
    .toLowerCase()
    .replace(/[ي]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ة]/g, "ه")
    .replace(/[ً-ٟ‌]/g, "")
    .replace(/[''`\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
