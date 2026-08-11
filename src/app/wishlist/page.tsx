"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { useWishlist } from "@/lib/cart";
import { LoopIcon } from "@/components/icons";

export default function WishlistPage() {
  const { ids, ready } = useWishlist();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    setLoading(true);
    fetch(`/api/products?ids=${encodeURIComponent(ids.join(","))}`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(
          list.map(
            (p: {
              id: string;
              slug: string;
              title: string;
              price: number;
              compareAtPrice?: number | null;
              category: string;
              leadTimeDays: number;
              images?: { url: string }[];
              image?: string | null;
            }) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              category: p.category,
              leadTimeDays: p.leadTimeDays,
              image: p.image || p.images?.[0]?.url || null,
              imageHover: p.images?.[1]?.url || p.images?.[0]?.url || p.image || null,
            })
          )
        );
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [ids, ready]);

  if (!ready || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center opacity-70">
        Loading wishlist…
      </div>
    );
  }

  if (ids.length === 0 || products.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <LoopIcon className="w-10 h-10 mx-auto mb-4 opacity-70" />
        <h1 className="font-display text-3xl">Wishlist is empty</h1>
        <p className="opacity-75 mt-2 mb-6">Tap the loop on a product to save it here.</p>
        <Link href="/shop" className="btn-primary btn-yarn">
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Wishlist</h1>
      <p className="opacity-75 mt-2 mb-6">
        {products.length} saved piece{products.length === 1 ? "" : "s"}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
