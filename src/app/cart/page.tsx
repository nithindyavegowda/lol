"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/utils";
import { YarnBallIcon } from "@/components/icons";

export default function CartPage() {
  const { items, ready, updateQty, removeItem, subtotal, count } = useCart();

  if (!ready) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center opacity-70">Loading cart…</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <YarnBallIcon className="w-10 h-10 mx-auto mb-4 opacity-70" />
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <p className="opacity-75 mt-2 mb-6">Add a handmade piece to get started.</p>
        <Link href="/shop" className="btn-primary btn-yarn">
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Cart</h1>
      <p className="opacity-75 mt-1 mb-6">
        {count} item{count === 1 ? "" : "s"} · made to order
      </p>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.variantId || "default"}`}
            className="stitched rounded-2xl p-3 sm:p-4 bg-[rgba(255,255,255,0.4)] flex gap-3"
          >
            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[rgba(170,127,102,0.15)]">
              <Image
                src={item.image || "/placeholders/bunny.svg"}
                alt={item.title}
                fill
                unoptimized={(item.image || "").endsWith(".svg") || !item.image}
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.slug}`}
                className="font-display text-lg leading-tight hover:underline"
              >
                {item.title}
              </Link>
              {item.variantLabel ? (
                <p className="text-sm opacity-70">{item.variantLabel}</p>
              ) : null}
              <p className="text-sm mt-1 font-semibold">{formatInr(item.price)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <label className="text-sm" htmlFor={`qty-${item.productId}-${item.variantId}`}>
                  Qty
                </label>
                <input
                  id={`qty-${item.productId}-${item.variantId}`}
                  className="input !w-20 !py-1"
                  type="number"
                  min={1}
                  max={item.maxQty}
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(
                      item.productId,
                      item.variantId,
                      Math.min(item.maxQty, Math.max(0, Number(e.target.value) || 0))
                    )
                  }
                />
                <button
                  type="button"
                  className="text-sm underline underline-offset-2 opacity-80"
                  onClick={() => removeItem(item.productId, item.variantId)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right font-semibold shrink-0">
              {formatInr(item.price * item.qty)}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg">
          Subtotal <span className="font-semibold">{formatInr(subtotal)}</span>
        </p>
        <Link href="/checkout" className="btn-primary btn-yarn">
          Checkout
        </Link>
      </div>
      <p className="text-xs opacity-65 mt-3">
        Shipping and coupons are calculated at checkout. Final confirmation happens on WhatsApp.
      </p>
    </div>
  );
}
