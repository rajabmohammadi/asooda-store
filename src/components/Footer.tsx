import { Clock, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons";
import { store } from "@/lib/config";
import { whatsappLink } from "@/lib/format";

const policyLinks = [
  { href: "/info/how-to-order", label: "رهنمای خرید" },
  { href: "/info/authenticity", label: "اصل بودن اجناس" },
  { href: "/info/returns", label: "شرایط واپسی و تبدیلی" },
  { href: "/info/delivery", label: "قیمت و وقت انتقال" },
  { href: "/info/faq", label: "پرسش های معمول" },
  { href: "/info/about", label: "درباره ما" },
  { href: "/info/contact", label: "تماس با ما" },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-3">
        <section>
          <h2 className="mb-3 font-bold">تماس با ما</h2>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <a href={whatsappLink(store.whatsapp, "سلام")} className="flex items-center gap-2 font-medium text-wa">
                <WhatsAppIcon className="size-4.5" /> واتساپ: <span className="ltr">{store.phone}</span>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4" /> <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="ltr">{store.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4" /> {store.hours}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4" /> {store.address}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-bold">معلومات خرید</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted md:grid-cols-1">
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-bold">ما را دنبال کنید</h2>
          <ul className="flex gap-3 text-sm">
            <li><a href={store.instagram} className="rounded-full border border-line px-3 py-1.5 hover:border-brand hover:text-brand" rel="noopener">Instagram</a></li>
            <li><a href={store.facebook} className="rounded-full border border-line px-3 py-1.5 hover:border-brand hover:text-brand" rel="noopener">Facebook</a></li>
            <li><a href={store.tiktok} className="rounded-full border border-line px-3 py-1.5 hover:border-brand hover:text-brand" rel="noopener">TikTok</a></li>
          </ul>
          <Image src="/logo.png" alt={store.nameLatin} width={236} height={133} className="mt-5 h-16 w-auto" />
          <p className="mt-2 text-sm leading-7 text-muted">
            {store.name}: {store.tagline}. همه اجناس با تاریخ ختم معلوم و ضمانت اصل بودن.
          </p>
        </section>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">© {store.name} - همه حقوق محفوظ است</p>
    </footer>
  );
}
