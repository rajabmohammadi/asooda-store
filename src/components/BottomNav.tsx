"use client";

import { House, LayoutGrid, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/components/CartProvider";
import { WhatsAppIcon } from "@/components/icons";
import { store } from "@/lib/config";
import { cn, toFaDigits, whatsappLink } from "@/lib/format";

const items = [
  { href: "/", label: "خانه", Icon: House },
  { href: "/categories", label: "دسته ها", Icon: LayoutGrid },
  { href: "/search", label: "جستجو", Icon: Search },
  { href: "/cart", label: "سبد", Icon: ShoppingBag },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav
      aria-label="منوی اصلی"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex flex-col items-center gap-0.5 py-2 text-[11px]", active ? "text-brand" : "text-muted")}
              >
                <Icon className="size-5.5" strokeWidth={active ? 2.2 : 1.8} />
                {label}
                {href === "/cart" && count > 0 && (
                  <span className="absolute start-[calc(50%+4px)] top-1 grid min-w-4.5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold leading-4.5 text-white">
                    {toFaDigits(count)}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
        <li>
          <a
            href={whatsappLink(store.whatsapp, "سلام، از ویب سایت آسودا پیام می دهم.")}
            target="_blank"
            rel="noopener"
            className="flex flex-col items-center gap-0.5 py-2 text-[11px] text-wa"
          >
            <WhatsAppIcon className="size-5.5" />
            واتساپ
          </a>
        </li>
      </ul>
    </nav>
  );
}
