# LOL — Loops of Love

Handmade crochet storefront. **Made by me, made for you.**

Premium 2026 homepage: floating nav, interactive 3D crochet hero (React Three Fiber), collections, and custom-order story — without changing checkout / WhatsApp / admin business logic.

Asset map: [`docs/ASSET-MANIFEST.md`](docs/ASSET-MANIFEST.md) · preview: `/dev/assets`

## Local start (port 1234)

```bash
# ensure Node is on PATH, then:
cd C:\P\lol
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run build
npm run start
```

Dev mode:

```bash
npm run dev
```

- Storefront: http://localhost:1234  
- Admin login: http://localhost:1234/admin/login  

## Admin

- Email: `g.amie0311@gmail.com`
- Password: `Ammu@0311`
- WhatsApp orders: `8884558657` (`wa.me/918884558657`)

## Test coupons

- `LOVE10` — 10% off  
- `WELCOME50` — ₹50 off  

## Sample order status

http://localhost:1234/order/sample-status-token-lol-1001

## Stack

- Next.js 15 + TypeScript + Tailwind  
- Prisma + SQLite (`prisma/dev.db`)  
- NextAuth credentials (single admin)  
- Local uploads in `public/uploads`  
- Order email via Resend if `RESEND_API_KEY` is set; otherwise logged to console  
- WhatsApp handoff via `wa.me`

## Feature map

Customer: shop search/filters, wishlist, featured, MTO lead times, custom request, guides, policies, Instagram gallery, testimonials, cart/checkout with gift message + coupons + shipping estimate, WhatsApp order + confirmation + status link.

Admin: dashboard, products CRUD, CSV import, duplicate, image upload/reorder, orders/status, coupons, testimonials, settings (pause/capacity/UPI/WhatsApp/shipping), guides, policies, Instagram links.
