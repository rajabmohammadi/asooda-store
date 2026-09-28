import type { Metadata } from "next";

export const metadata: Metadata = { title: "ثبت سفارش", robots: { index: false } };

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
