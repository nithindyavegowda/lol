"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconArrowRight } from "@/components/icons";
import { ProductCard, type ProductCardData } from "@/components/product-card";

export function ProductShowcase({ products }: { products: ProductCardData[] }) {
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return products;
    return products.filter((p) => p.category === active);
  }, [products, active]);

  return (
    <section
      className="section-pad !pt-8 sm:!pt-10 relative overflow-hidden"
      id="showcase"
      data-sprint="fresh-products"
      style={{
        background: "linear-gradient(180deg, #FFF9F5 0%, #F8F1EB 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-[0.07] hidden lg:block"
        style={{
          backgroundImage: "url(/assets/textures/yarn-texture-sm.webp)",
          backgroundSize: "320px",
        }}
        aria-hidden
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-[var(--lol-pink)] mb-2">
              Just stitched
            </p>
            <h2 className="font-display text-3xl sm:text-5xl tracking-tight">
              Fresh from the hook
            </h2>
            <p className="mt-3 text-[var(--brown)] max-w-lg">
              Made to order favourites — soft stitches, honest prices, ready when you are.
            </p>
          </div>
          <Link href="/shop" className="btn-secondary self-start">
            View all <IconArrowRight size={16} />
          </Link>
        </div>

        {/* Category filter toggles */}
        <div
          className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-1 px-1 snap-x"
          role="tablist"
          aria-label="Filter by category"
        >
          {categories.map((c) => {
            const on = active === c;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(c)}
                className="snap-start shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors"
                style={{
                  background: on ? "var(--espresso)" : "var(--cream-light)",
                  color: on ? "var(--cream)" : "var(--espresso)",
                  borderColor: on ? "var(--espresso)" : "rgba(48,35,31,0.12)",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="text-[var(--brown)]">No pieces in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
