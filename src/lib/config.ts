// Business settings. Replace placeholder values (marked TODO) with real ones before launch.

export const store = {
  name: "آسودا",
  nameLatin: "Asooda Store",
  // TODO: set NEXT_PUBLIC_SITE_URL to the real domain
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://asooda.af",
  tagline: "اجناس اصل آرایشی و مراقبت پوست",
  // TODO: real WhatsApp number in international format, digits only (no +)
  whatsapp: "93784283623",
  // TODO: real phone number shown to customers
  phone: "93784283623",
  hours: "شنبه تا پنجشنبه، ۹ صبح تا ۸ شام",
  // TODO: real shop address
  address: "شهرنو، چهارراهی انصاری، مارکیت پارکمال، منزل سوم، دوکان ۳۲۴",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  tiktok: "https://tiktok.com/",
  confirmCallWithinHours: 2,
};

export type City = { id: string; name: string; fee: number; eta: string };

// TODO: confirm real delivery fees and times
export const cities: City[] = [
  { id: "kabul", name: "کابل", fee: 100, eta: "امروز یا فردا" },
  { id: "herat", name: "هرات", fee: 250, eta: "۲ تا ۴ روز" },
  { id: "mazar", name: "مزار شریف", fee: 250, eta: "۲ تا ۴ روز" },
  { id: "kandahar", name: "کندهار", fee: 300, eta: "۳ تا ۵ روز" },
  { id: "jalalabad", name: "جلال آباد", fee: 250, eta: "۲ تا ۴ روز" },
  { id: "other", name: "دیگر", fee: 350, eta: "۳ تا ۵ روز" },
];

// Orders above this amount outside Kabul need a small advance (see doc: fraud and refusal control)
export const advanceThreshold = 5000;

export const priceBuckets = [
  { id: "lt500", label: "کمتر از ۵۰۰", min: 0, max: 499 },
  { id: "500-1500", label: "۵۰۰ تا ۱٬۵۰۰", min: 500, max: 1500 },
  { id: "gt1500", label: "بیشتر از ۱٬۵۰۰", min: 1501, max: Infinity },
] as const;

export const sortOptions = [
  { id: "newest", label: "نوترین" },
  { id: "cheapest", label: "ارزان ترین" },
  { id: "expensive", label: "گران ترین" },
  { id: "bestselling", label: "پرفروش ترین" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];
