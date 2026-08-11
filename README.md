# LOL — Loops of Love

Handmade crochet storefront. **Made by me, made for you.**

Fast 2D storefront: floating nav, photographic hero, real product photos, collections, custom-order story — checkout / WhatsApp / admin unchanged.

## Run locally (port 1234)

```bash
cd C:\P\lol   # or your clone path
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npx prisma db push
npx tsx prisma/seed.ts
npx tsx scripts/seed-photo-products.ts
npx tsx scripts/publish-real-photos-only.ts
npm run dev:host
```

- Storefront: http://localhost:1234  
- LAN share: http://\<your-lan-ip\>:1234  
- Admin: http://localhost:1234/admin/login  
- Remote preview: `npm run tunnel` (needs `dev:host` running)

Production:

```bash
npm run build
npm run start
```

## Admin defaults

- Email: `g.amie0311@gmail.com`
- Password: `Ammu@0311` (change after first login / via env)
- WhatsApp orders: `8884558657` → `wa.me/918884558657`

## Test coupons

- `LOVE10` — 10% off  
- `WELCOME50` — ₹50 off  

## Stack

- Next.js 15 + TypeScript + Tailwind  
- Prisma + SQLite (`prisma/dev.db`, gitignored)  
- NextAuth credentials (single admin)  
- Product photos in `public/assets/products/`  
- Orders via WhatsApp (`wa.me`); optional Resend email if `RESEND_API_KEY` is set  

## Notes

- `.env*` and `prisma/*.db` are gitignored — copy from `.env.example`  
- Only products with real `/assets/products/` images are published by `publish-real-photos-only.ts`  
- Large `spiderman.glb` is not in git (not needed for 2D hero)
