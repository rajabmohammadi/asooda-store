import "./globals.css";

import type { Metadata, Viewport } from "next";

import { BottomNav } from "@/components/BottomNav";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { store } from "@/lib/config";

export const metadata: Metadata = {
  title: { default: `${store.name} | ${store.tagline}`, template: `%s | ${store.name}` },
  description: "خرید آنلاین اجناس اصل آرایشی، مراقبت پوست، مو و عطر در افغانستان. پرداخت نقد در وقت تحویل.",
};

export const viewport: Viewport = {
  themeColor: "#74114f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa-AF" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800&display=swap"
        />
      </head>
      <body className="min-h-dvh antialiased">
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl pb-24 md:pb-10">{children}</main>
          <Footer />
          <BottomNav />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
