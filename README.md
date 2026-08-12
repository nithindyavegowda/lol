# LOL — Loops of Love

Handmade crochet storefront. **Made by me, made for you.**

Fast 2D storefront: floating nav, photographic hero, real product photos, collections, custom-order story — checkout / WhatsApp / admin unchanged.

## Run locally (port 1234)

```bash
cd C:\P\lol   # or your clone path
npm install
copy .env.example .env.local
# Edit .env.local:
#   - DATABASE_URL = Neon Postgres for THIS app only (not shared with other projects)
#   - NEXTAUTH_SECRET = long random string
#   - ADMIN_EMAIL / ADMIN_PASSWORD = your admin login
npm run db:setup
npm run dev:host
```

- Storefront: http://localhost:1234  
- LAN share: http://\<your-lan-ip\>:1234  
- Admin: http://localhost:1234/admin/login  
- Remote preview: `npm run tunnel` (needs `dev:host` running)

### Vercel env vars (required)

Use **Import .env file** on Vercel and select local `C:\P\lol\.env.vercel` (gitignored — has real secrets).  
Template in git: `.env.vercel.example`.

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Neon LOL Postgres URL (pooler OK) |
| `NEXTAUTH_SECRET` / `AUTH_SECRET` | Same long random secret (set both) |
| `NEXTAUTH_URL` / `AUTH_URL` | Exact site URL e.g. `https://loopoflove-crochet.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | Same HTTPS origin |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | e.g. `918884558657` |
| `ORDER_NOTIFY_EMAIL` | Optional merchant notify inbox |
| `RESEND_API_KEY` | Optional order emails |
| `CLOUDINARY_*` | Required on Vercel for admin image uploads |

Deploy steps:

1. Import `nithindyavegowda/lol` on Vercel  
2. **Before deploy**, Environment Variables → **Import** → choose `.env.vercel`  
3. Confirm Production + Preview are checked  
4. Deploy — build runs `prisma generate && next build`  
5. If the live URL differs from `https://lol.vercel.app`, edit `NEXTAUTH_URL`, `AUTH_URL`, `NEXT_PUBLIC_SITE_URL` and **Redeploy**  
6. DB is already seeded on Neon; only re-run `npm run db:setup` if products are missing

Production locally:

```bash
npm run build
npm run start
```

## Admin

- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` before `npm run db:setup`  
- Login: http://localhost:1234/admin/login  
- WhatsApp orders: `8884558657` → `wa.me/918884558657`

## Test coupons

- `LOVE10` — 10% off  
- `WELCOME50` — ₹50 off  

## Stack

- Next.js 15 + TypeScript + Tailwind  
- Prisma + Neon Postgres (`DATABASE_URL`) via serverless WebSocket adapter  
- NextAuth credentials (single admin)  
- Product photos in `public/assets/products/`  
- Orders via short WhatsApp link + `/order/[token]` status page  
- Admin uploads: Cloudinary in production; local `public/uploads` only in development  

## Notes

- `.env*` is gitignored — never commit real secrets  
- Neon Postgres via `DATABASE_URL` (prefer a dedicated Neon project for LOL)  
- `POST /api/orders` is rate-limited (in-memory per instance) + honeypot field  
- Only products with real `/assets/products/` images are published by `publish-real-photos-only.ts`  
- Large `spiderman.glb` is not in git (not needed for 2D hero)
