"use client";

import { Check, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";

import { AddToCartButton } from "@/components/AddToCartButton";
import { WhatsAppIcon } from "@/components/icons";
import { getBrand, type Product } from "@/data/catalog";
import { store } from "@/lib/config";
import { cn, formatAfn, whatsappLink } from "@/lib/format";

export function ProductPurchase({ product }: { product: Product }) {
  const [shade, setShade] = useState<string | undefined>(product.shades?.length === 1 ? product.shades[0].name : undefined);
  const brand = getBrand(product.brand);
  const url = `${store.siteUrl}/p/${product.slug}`;

  const orderText = [
    "سلام، می خواهم این جنس را سفارش بدهم:",
    `${product.name} - ${brand?.name ?? ""}`,
    shade ? `رنگ: ${shade}` : null,
    `قیمت: ${formatAfn(product.price)}`,
    url,
  ]
    .filter(Boolean)
    .join("\n");

  const askText = `سلام، درباره این جنس سوال دارم: ${product.name} - ${brand?.name ?? ""}\n${url}`;

  return (
    <div className="space-y-4">
      {product.shades && (
        <fieldset>
          <legend className="mb-2 text-sm font-bold">
            رنگ: <span className="font-normal text-muted">{shade ?? "انتخاب نشده"}</span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {product.shades.map((s) => {
              const active = s.name === shade;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setShade(s.name)}
                  aria-pressed={active}
                  aria-label={s.name}
                  title={s.name}
                  className={cn(
                    "relative grid size-10 place-items-center rounded-full ring-offset-2 ring-offset-bg transition",
                    active ? "ring-2 ring-brand" : "ring-1 ring-line",
                  )}
                  style={{ background: s.hex }}
                >
                  {active && <Check className="size-4.5 text-white drop-shadow" />}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="grid grid-cols-2 gap-2">
        <AddToCartButton product={product} shade={shade} />
        <a
          href={whatsappLink(store.whatsapp, orderText)}
          target="_blank"
          rel="noopener"
          aria-disabled={!product.inStock}
          className={cn(
            "flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-wa px-2 py-2 text-[14px] leading-tight font-bold text-white hover:brightness-95",
            !product.inStock && "pointer-events-none opacity-40",
          )}
        >
          <WhatsAppIcon className="size-5 shrink-0" />
          سفارش از طریق واتساپ
        </a>
      </div>

      <a
        href={whatsappLink(store.whatsapp, product.inStock ? askText : `سلام، وقتی «${product.name}» دوباره موجود شد، لطفاً خبرم کنید.`)}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-2 text-sm font-medium text-wa"
      >
        <MessageCircleQuestion className="size-5" />
        {product.inStock ? "سوال دارید؟ در واتساپ بپرسید" : "وقتی موجود شد در واتساپ خبرم کنید"}
      </a>
    </div>
  );
}
