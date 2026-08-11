import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { ShopFilters } from "@/components/shop-filters";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Search = {
  q?: string;
  category?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const category = (sp.category || "").trim();
  const color = (sp.color || "").trim();
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined;

  const allPublished = await prisma.product.findMany({
    where: { status: "published" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
      variants: true,
    },
    orderBy: [{ featured: "desc" }, { title: "asc" }],
  });

  const categories = Array.from(new Set(allPublished.map((p) => p.category))).sort();
  const colors = Array.from(
    new Set(allPublished.flatMap((p) => p.variants.map((v) => v.color).filter(Boolean)))
  ).sort();

  let products = allPublished;

  if (q) {
    const lower = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.subtitle.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  }
  if (category) products = products.filter((p) => p.category === category);
  if (color) products = products.filter((p) => p.variants.some((v) => v.color === color));
  if (minPrice != null && !Number.isNaN(minPrice)) {
    products = products.filter((p) => p.price >= minPrice);
  }
  if (maxPrice != null && !Number.isNaN(maxPrice)) {
    products = products.filter((p) => p.price <= maxPrice);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-3 sm:pt-8 pb-10" data-sprint="shop-mobile-first">
      {/* Mobile: products first under floating nav — title/filters follow grid on small screens */}
      <div className="md:hidden mb-3">
        <Suspense fallback={<div className="h-12 rounded-full bg-[rgba(48,35,31,0.06)] animate-pulse" />}>
          <ShopCategoryChips categories={categories} active={category} />
        </Suspense>
      </div>

      <div className="hidden md:block">
        <h1 className="font-display text-4xl">Shop</h1>
        <p className="opacity-75 mt-2 mb-6">
          Browse handmade pieces — every order is crocheted just for you.
        </p>
        <Suspense fallback={<div className="h-28 stitched rounded-2xl animate-pulse" />}>
          <ShopFilters categories={categories} colors={colors} />
        </Suspense>
      </div>

      <p className="text-sm opacity-70 mb-3 md:mt-6">
        {products.length} piece{products.length === 1 ? "" : "s"}
      </p>

      {products.length === 0 ? (
        <p className="opacity-70">No pieces match these filters. Try clearing a few.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((p) => (
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
      )}

      {/* Mobile: full filters + title after the grid */}
      <div className="md:hidden mt-10">
        <h1 className="font-display text-3xl mb-2">Shop</h1>
        <p className="opacity-75 mb-4 text-sm">
          Every order is crocheted just for you.
        </p>
        <Suspense fallback={null}>
          <ShopFilters categories={categories} colors={colors} />
        </Suspense>
      </div>
    </div>
  );
}

/** Compact category chips for mobile-first shop */
function ShopCategoryChips({
  categories,
  active,
}: {
  categories: string[];
  active: string;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" aria-label="Categories">
      <a
        href="/shop"
        className="shrink-0 px-3.5 py-1.5 rounded-full text-sm font-semibold border"
        style={{
          background: !active ? "var(--espresso)" : "var(--cream-light)",
          color: !active ? "var(--cream)" : "var(--espresso)",
          borderColor: "rgba(48,35,31,0.12)",
        }}
      >
        All
      </a>
      {categories.map((c) => {
        const on = active === c;
        return (
          <a
            key={c}
            href={`/shop?category=${encodeURIComponent(c)}`}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-sm font-semibold border"
            style={{
              background: on ? "var(--espresso)" : "var(--cream-light)",
              color: on ? "var(--cream)" : "var(--espresso)",
              borderColor: "rgba(48,35,31,0.12)",
            }}
          >
            {c}
          </a>
        );
      })}
    </div>
  );
}
