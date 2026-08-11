"use client";

import { useMemo, useState } from "react";
import { useCart, useWishlist } from "@/lib/cart";
import { formatInr } from "@/lib/utils";
import { LoopIcon, YarnBallIcon } from "./icons";

export type PurchaseVariant = {
  id: string;
  color: string;
  size: string;
  priceOverride: number | null;
};

export function ProductPurchase({
  product,
}: {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    maxQty: number;
    leadTimeDays: number;
    image?: string | null;
    variants: PurchaseVariant[];
  };
}) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const [variantId, setVariantId] = useState(product.variants[0]?.id || "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId),
    [product.variants, variantId]
  );

  const unitPrice = variant?.priceOverride ?? product.price;
  const label = variant
    ? [variant.color, variant.size].filter(Boolean).join(" / ")
    : "";

  const onAdd = () => {
    addItem({
      productId: product.id,
      variantId: variant?.id,
      title: product.title,
      variantLabel: label || undefined,
      price: unitPrice,
      qty,
      image: product.image || undefined,
      maxQty: product.maxQty,
      leadTimeDays: product.leadTimeDays,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const wished = has(product.id);

  return (
    <div className="space-y-4">
      {product.variants.length > 0 ? (
        <div>
          <label className="label" htmlFor="variant">
            Colour / size
          </label>
          <select
            id="variant"
            className="input"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
          >
            {product.variants.map((v) => {
              const text = [v.color, v.size].filter(Boolean).join(" / ");
              const priceNote =
                v.priceOverride != null && v.priceOverride !== product.price
                  ? ` — ${formatInr(v.priceOverride)}`
                  : "";
              return (
                <option key={v.id} value={v.id}>
                  {text}
                  {priceNote}
                </option>
              );
            })}
          </select>
        </div>
      ) : null}

      <div>
        <label className="label" htmlFor="qty">
          Quantity (max {product.maxQty})
        </label>
        <input
          id="qty"
          className="input max-w-[8rem]"
          type="number"
          min={1}
          max={product.maxQty}
          value={qty}
          onChange={(e) =>
            setQty(Math.min(product.maxQty, Math.max(1, Number(e.target.value) || 1)))
          }
        />
      </div>

      <p className="text-lg font-semibold">{formatInr(unitPrice)}</p>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary btn-yarn" onClick={onAdd}>
          <YarnBallIcon className="w-5 h-5" />
          {added ? "Added!" : "Add to cart"}
        </button>
        <button
          type="button"
          className="btn-primary !bg-transparent inline-flex items-center gap-2"
          onClick={() => toggle(product.id)}
          aria-pressed={wished}
        >
          <LoopIcon className={`w-5 h-5 ${wished ? "wish-loop is-on" : "wish-loop"}`} />
          {wished ? "Wishlisted" : "Wishlist"}
        </button>
      </div>
    </div>
  );
}
