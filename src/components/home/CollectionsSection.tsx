"use client";

import Image from "next/image";
import Link from "next/link";

export type CategoryItem = {
  name: string;
  href: string;
  image: string;
  blurb: string;
  size?: "featured" | "tall" | "wide" | "standard";
};

const CATEGORIES: CategoryItem[] = [
  {
    name: "Toys",
    href: "/shop?category=Toys",
    image: "/assets/categories/toys.webp",
    blurb: "Amigurumi friends",
    size: "featured",
  },
  {
    name: "Bags",
    href: "/shop?category=Bags",
    image: "/assets/categories/bags.webp",
    blurb: "Everyday carry",
    size: "tall",
  },
  {
    name: "Accessories",
    href: "/shop?category=Accessories",
    image: "/assets/categories/accessories.webp",
    blurb: "Tiny joys",
    size: "standard",
  },
  {
    name: "Wall Decor",
    href: "/shop?category=Home",
    image: "/assets/categories/wall-decor.webp",
    blurb: "Soft corners",
    size: "wide",
  },
  {
    name: "Wearables",
    href: "/shop?category=Apparel",
    image: "/assets/categories/wearables.webp",
    blurb: "Warm layers",
    size: "standard",
  },
];

function CategoryCard({
  item,
  className = "",
}: {
  item: CategoryItem;
  className?: string;
}) {
  return (
    <Link
      href={item.href}
      className={`group relative block h-full w-full overflow-hidden rounded-[1.35rem] bg-[var(--cream-light)] shadow-[var(--shadow-soft)] border border-[rgba(48,35,31,0.05)] ${className}`}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        loading="lazy"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width:768px) 75vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(48,35,31,0.62)] via-[rgba(48,35,31,0.12)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-[var(--cream)]">
        <p className="font-display text-2xl sm:text-3xl leading-none">{item.name}</p>
        <p className="text-xs sm:text-sm mt-1.5 opacity-90">{item.blurb}</p>
      </div>
    </Link>
  );
}

/**
 * PHASE 7 — Explore Handmade Happiness
 * Desktop: editorial asymmetric grid (row1: Toys/Bags/Accessories, row2: Wall Decor/Wearables)
 * Mobile: horizontal snap carousel
 */
export function CollectionsSection() {
  const [toys, bags, accessories, wall, wearables] = CATEGORIES;

  return (
    <section className="section-pad" id="collections" data-sprint="5-collections">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-8 sm:mb-10 px-1">
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight">
            Explore Handmade Happiness
          </h2>
          <p className="mt-3 text-[var(--brown)] text-base sm:text-lg">
            From crochet characters to charming accessories, we crochet it all — with love.
          </p>
        </div>

        {/* Mobile snap carousel */}
        <div
          className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 scroll-px-4 collections-snap"
          style={{ WebkitOverflowScrolling: "touch" }}
          aria-label="Category carousel"
        >
          {CATEGORIES.map((c) => (
            <div key={c.name} className="snap-center shrink-0 w-[78%] max-w-[20rem]">
              <CategoryCard item={c} className="aspect-[3/4] block min-h-[22rem]" />
            </div>
          ))}
        </div>

        {/* Desktop editorial composition */}
        <div className="hidden md:grid grid-cols-12 gap-4 lg:gap-5 auto-rows-[11rem] lg:auto-rows-[12.5rem]">
          {/* Row 1: Toys (large) · Bags · Accessories */}
          <CategoryCard
            item={toys}
            className="col-span-5 row-span-2 min-h-[22rem]"
          />
          <CategoryCard item={bags} className="col-span-4 row-span-2" />
          <CategoryCard item={accessories} className="col-span-3 row-span-2" />

          {/* Row 2: Wall Decor (wide) · Wearables */}
          <CategoryCard item={wall} className="col-span-7 row-span-2" />
          <CategoryCard item={wearables} className="col-span-5 row-span-2" />
        </div>
      </div>
    </section>
  );
}
