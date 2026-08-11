import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { ShareButtons } from "@/components/share-buttons";
import { YarnDivider } from "@/components/icons";
import { prisma } from "@/lib/prisma";
import { estimateShipDate, formatInr, parseJson } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** PHASE 19 — Product SEO */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, status: "published" },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  if (!product) {
    return { title: "Product not found" };
  }

  const title = product.title;
  const description =
    product.subtitle?.trim() ||
    product.description?.slice(0, 155) ||
    `Handmade ${product.category.toLowerCase()} crochet — made to order by LOL.`;
  const image = product.images[0]?.url || "/assets/hero/hero-fallback.webp";
  const path = `/products/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · LOL`,
      description,
      url: path,
      type: "website",
      siteName: "LOL — Loops of Love",
      images: [{ url: image, alt: product.images[0]?.alt || title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · LOL`,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, status: "published" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      relatedFrom: {
        include: {
          related: {
            include: { images: { orderBy: { sortOrder: "asc" }, take: 2 } },
          },
        },
      },
    },
  });

  if (!product) notFound();

  await prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  });

  const bullets = parseJson<string[]>(product.bullets, []);
  const materials = parseJson<Record<string, string>>(product.materials, {});
  const shipDate = estimateShipDate(product.leadTimeDays);
  const onSale =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const shareUrl = siteUrl ? `${siteUrl.replace(/\/$/, "")}/products/${product.slug}` : "";

  const related = product.relatedFrom
    .map((r) => r.related)
    .filter((r) => r.status === "published")
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="relative aspect-square stitched rounded-2xl overflow-hidden bg-[rgba(170,127,102,0.12)]">
            <Image
              src={product.images[0]?.url || "/placeholders/bunny.svg"}
              alt={product.images[0]?.alt || product.title}
              fill
              priority
              unoptimized={(product.images[0]?.url || "").endsWith(".svg")}
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square stitched rounded-xl overflow-hidden bg-[rgba(255,255,255,0.35)]"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.title}
                    fill
                    unoptimized={img.url.endsWith(".svg")}
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide opacity-70">{product.category}</p>
          <h1 className="font-display text-4xl mt-1">{product.title}</h1>
          {product.subtitle ? (
            <p className="mt-2 opacity-80">{product.subtitle}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatInr(product.price)}</span>
            {onSale ? (
              <span className="line-through opacity-60">
                {formatInr(product.compareAtPrice!)}
              </span>
            ) : null}
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--color-sakura)]">
              Made to order
            </span>
          </div>
          <p className="text-sm mt-2 opacity-75">
            Est. ready around {shipDate} · {product.leadTimeDays} days lead time
          </p>

          <div className="mt-6">
            <ProductPurchase
              product={{
                id: product.id,
                slug: product.slug,
                title: product.title,
                price: product.price,
                maxQty: product.maxQty,
                leadTimeDays: product.leadTimeDays,
                image: product.images[0]?.url,
                variants: product.variants.map((v) => ({
                  id: v.id,
                  color: v.color,
                  size: v.size,
                  priceOverride: v.priceOverride,
                })),
              }}
            />
          </div>

          <div className="mt-6">
            <ShareButtons title={product.title} url={shareUrl} />
          </div>
        </div>
      </div>

      <YarnDivider />

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-2xl mb-3">Details</h2>
          <p className="whitespace-pre-wrap leading-relaxed opacity-90">{product.description}</p>
          {bullets.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-[var(--color-sakura)]" aria-hidden>
                    ✦
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="space-y-4">
          {Object.keys(materials).length > 0 ? (
            <div className="stitched rounded-2xl p-4 bg-[rgba(255,255,255,0.35)]">
              <h3 className="font-display text-xl mb-2">Materials</h3>
              <dl className="space-y-1 text-sm">
                {Object.entries(materials).map(([k, v]) =>
                  v ? (
                    <div key={k} className="flex gap-2">
                      <dt className="font-semibold capitalize min-w-[6rem]">{k}</dt>
                      <dd className="opacity-85">{v}</dd>
                    </div>
                  ) : null
                )}
              </dl>
            </div>
          ) : null}
          {(product.dimensions || product.weight || product.care) && (
            <div className="stitched rounded-2xl p-4 bg-[rgba(255,255,255,0.35)] text-sm space-y-2">
              {product.dimensions ? (
                <p>
                  <span className="font-semibold">Dimensions: </span>
                  {product.dimensions}
                </p>
              ) : null}
              {product.weight ? (
                <p>
                  <span className="font-semibold">Weight: </span>
                  {product.weight}
                </p>
              ) : null}
              {product.care ? (
                <p>
                  <span className="font-semibold">Care: </span>
                  {product.care}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 ? (
        <>
          <YarnDivider />
          <h2 className="font-display text-2xl mb-4">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  slug: p.slug,
                  title: p.title,
                  price: p.price,
                  compareAtPrice: p.compareAtPrice,
                  image: p.images[0]?.url,
                  imageHover: p.images[1]?.url || p.images[0]?.url,
                  category: p.category,
                  leadTimeDays: p.leadTimeDays,
                }}
              />
            ))}
          </div>
        </>
      ) : null}

      <p className="mt-8 text-sm">
        <Link href="/shop" className="underline underline-offset-4">
          ← Back to shop
        </Link>
      </p>
    </div>
  );
}
