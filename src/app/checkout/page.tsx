"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/utils";

type Quote = {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paused?: boolean;
  capacityFull?: boolean;
  message?: string;
};

type ShopPublic = {
  paused?: boolean;
  announcement?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, ready, subtotal, clear } = useCart();
  const [shop, setShop] = useState<ShopPublic | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    fetch("/api/shop")
      .then((r) => r.json())
      .then((data) => setShop(data))
      .catch(() => setShop({ paused: false }));
  }, []);

  const refreshQuote = useCallback(async () => {
    if (!items.length) {
      setQuote(null);
      return;
    }
    try {
      const res = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            qty: i.qty,
          })),
          couponCode: couponCode.trim() || undefined,
          pincode,
        }),
      });
      const data = (await res.json()) as Quote & { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not calculate shipping");
        return;
      }
      setQuote(data);
      setError("");
    } catch {
      setError("Could not calculate shipping");
    }
  }, [items, couponCode, pincode]);

  useEffect(() => {
    if (!ready || !items.length) return;
    const t = setTimeout(() => {
      void refreshQuote();
    }, 350);
    return () => clearTimeout(t);
  }, [ready, items, refreshQuote]);

  const paused = !!shop?.paused || !!quote?.paused || !!quote?.capacityFull;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (paused || busy || !items.length) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          addressLine,
          city,
          state,
          pincode,
          giftMessage,
          notes,
          couponCode: couponCode.trim() || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            qty: i.qty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order failed");
        setBusy(false);
        return;
      }
      const token =
        data.order?.publicToken || data.publicToken || data.token || "";
      const wa = data.whatsappUrl || "";
      const msg = data.whatsappText || data.order?.whatsappText || "";
      clear();
      const params = new URLSearchParams();
      if (token) params.set("token", token);
      if (wa) params.set("whatsapp", wa);
      if (msg) params.set("message", msg);
      router.push(`/order/confirmed?${params.toString()}`);
    } catch {
      setError("Something went wrong placing your order");
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center opacity-70">
        Loading checkout…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Nothing to checkout</h1>
        <p className="opacity-75 mt-2 mb-6">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">
          Shop
        </Link>
      </div>
    );
  }

  if (paused) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="stitched rounded-2xl p-6 bg-[rgba(255,255,255,0.45)]">
          <h1 className="font-display text-3xl">Shop paused</h1>
          <p className="mt-3 opacity-85">
            {quote?.message ||
              shop?.announcement ||
              "Not accepting new orders right now. Please check back soon, or message on WhatsApp."}
          </p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="opacity-75 mt-2 mb-6">
        Place order → we save it → you confirm on WhatsApp.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="input"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Phone (WhatsApp)
            </label>
            <input
              id="phone"
              className="input"
              required
              inputMode="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            className="input min-h-[4.5rem]"
            required
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label" htmlFor="city">
              City
            </label>
            <input
              id="city"
              className="input"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="state">
              State
            </label>
            <input
              id="state"
              className="input"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="pincode">
              Pincode
            </label>
            <input
              id="pincode"
              className="input"
              required
              inputMode="numeric"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="gift">
            Gift message
          </label>
          <textarea
            id="gift"
            className="input min-h-[3.5rem]"
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
            placeholder="Optional note for the recipient"
          />
        </div>

        <div>
          <label className="label" htmlFor="notes">
            Order notes
          </label>
          <textarea
            id="notes"
            className="input min-h-[3.5rem]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Colour prefs, timing, etc."
          />
        </div>

        <div>
          <label className="label" htmlFor="coupon">
            Coupon
          </label>
          <div className="flex gap-2">
            <input
              id="coupon"
              className="input"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="LOVE10"
            />
            <button
              type="button"
              className="btn-primary !bg-transparent shrink-0"
              onClick={() => void refreshQuote()}
            >
              Apply
            </button>
          </div>
        </div>

        <div className="stitched rounded-2xl p-4 bg-[rgba(255,255,255,0.4)] space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatInr(quote?.subtotal ?? subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatInr(quote?.discount ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatInr(quote?.shippingFee ?? 0)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t border-dashed border-[rgba(68,48,37,0.25)]">
            <span>Total</span>
            <span>
              {formatInr(
                quote?.total ??
                  subtotal + (quote?.shippingFee ?? 0) - (quote?.discount ?? 0)
              )}
            </span>
          </div>
        </div>

        {error ? (
          <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn-primary btn-yarn w-full sm:w-auto" disabled={busy}>
          {busy ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
