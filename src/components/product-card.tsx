"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/lib/cart";
import { formatInr } from "@/lib/utils";
import { IconHeart } from "./icons";

export type ProductCardData = {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  /** Optional second image for desktop hover swap */
  imageHover?: string | null;
  category: string;
  leadTimeDays: number;
};

/**
 * PHASE 8 product card — ₹ price, Made to order badge, wishlist heart,
 * yarn-texture accent, desktop hover zoom + second image.
 */
export function ProductCard({ product }: { product: ProductCardData }) {
  const { toggle, has } = useWishlist();
  const on = has(product.id);
  const primary = product.image || "/placeholders/bunny.svg";
  const secondary = product.imageHover || product.image || primary;

  return (
    <article
      className="product-tile group relative"
      data-sprint="5-product-card"
      style={{
        boxShadow: "var(--shadow-soft)",
        backgroundImage:
          "linear-gradient(var(--cream-light), var(--cream-light)), url(/assets/textures/yarn-texture-sm.webp)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        border: "2px solid transparent",
        backgroundSize: "cover, 180px",
      }}
    >
      <div className="relative aspect-square overflow-hidden bg-[rgba(139,103,85,0.08)] rounded-t-[calc(var(--radius-md)-2px)]">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 block">
          {/* Primary */}
          <Image
            src={primary}
            alt={product.title}
            fill
            loading="lazy"
            className="object-cover transition-all duration-500 ease-out md:group-hover:scale-110 md:group-hover:opacity-0"
            sizes="(max-width:768px) 50vw, 33vw"
            unoptimized
          />
          {/* Second image on hover (desktop) */}
          <Image
            src={secondary}
            alt=""
            fill
            aria-hidden
            loading="lazy"
            className="object-cover opacity-0 scale-105 transition-all duration-500 ease-out md:group-hover:opacity-100 md:group-hover:scale-100"
            sizes="(max-width:768px) 50vw, 33vw"
            unoptimized
          />
        </Link>

        <button
          type="button"
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-[rgba(255,249,245,0.94)] shadow-sm hover:scale-105 transition-transform"
          aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={on}
          onClick={() => toggle(product.id)}
        >
          <IconHeart className={on ? "wish-loop is-on text-[var(--lol-pink)]" : "wish-loop"} />
        </button>

        <span className="absolute left-2.5 top-2.5 z-10 text-[0.65rem] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-[var(--cream-light)]/95 text-[var(--brown)] border border-[rgba(48,35,31,0.06)]">
          Made to order
        </span>

        {/* Yarn texture corner accent */}
        <span
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-1.5 opacity-70"
          style={{
            backgroundImage: "url(/assets/textures/yarn-texture-sm.webp)",
            backgroundSize: "cover",
          }}
          aria-hidden
        />
      </div>

      <div className="p-3.5 sm:p-4">
        <p className="text-[0.7rem] uppercase tracking-wide text-[var(--brown)] opacity-80">
          {product.category}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="font-display text-lg sm:text-xl leading-tight"
        >
          {product.title}
        </Link>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-semibold text-base sm:text-lg">{formatInr(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <span className="text-sm line-through opacity-50">
              {formatInr(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
        <p className="text-xs mt-1.5 text-[var(--brown)]">Ships ~{product.leadTimeDays} days</p>
      </div>
    </article>
  );
}
