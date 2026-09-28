# Asooda Store (آسودا)

Dari, RTL, mobile-first beauty store for Afghanistan. Cash on delivery, WhatsApp ordering, phone confirmation.
Built from the "Khanoumi.com as a Reference" blueprint (MVP scope).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | File |
| --- | --- |
| Shop settings (WhatsApp, phone, address, delivery fees, price buckets) | `src/lib/config.ts` |
| Categories, brands, products (sample data) | `src/data/catalog.ts` |
| Orders API + storage + Telegram staff alert | `src/app/api/orders/route.ts`, `src/lib/orders.ts` |
| Pages | `src/app/**` (home, `/c/[slug]`, `/p/[slug]`, `/brands`, `/search`, `/cart`, `/checkout`, `/order/[id]`, `/info/[slug]`) |

Orders are saved to `data/orders.json` (MVP only, move to a database before launch).

## Before launch (TODO)

- Real WhatsApp number, phone, address, delivery fees in `src/lib/config.ts`
- Real catalogue: Dari names, prices in AFN, expiry, importer, shades, skin types
- Real product photos (WebP, 30–60 KB, back label with batch and expiry; no faces)
- Native Kabuli copy-editor review of all Dari text
- Admin order list with statuses (new → confirmed → shipped → delivered / refused)
- Database for orders + refused-phone list
