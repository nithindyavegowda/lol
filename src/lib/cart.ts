"use client";

import { useCallback, useEffect, useState } from "react";

export type CartItem = {
  productId: string;
  variantId?: string;
  title: string;
  variantLabel?: string;
  price: number;
  qty: number;
  image?: string;
  maxQty: number;
  leadTimeDays: number;
  slug: string;
};

const CART_KEY = "lol-cart";
const WISH_KEY = "lol-wishlist";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("lol-storage"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setItems(read<CartItem[]>(CART_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("lol-storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("lol-storage", onStorage);
    };
  }, [refresh]);

  const persist = (next: CartItem[]) => {
    setItems(next);
    write(CART_KEY, next);
  };

  const addItem = (item: CartItem) => {
    const existing = items.find(
      (i) => i.productId === item.productId && i.variantId === item.variantId
    );
    if (existing) {
      const qty = Math.min(existing.maxQty, existing.qty + item.qty);
      persist(
        items.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, qty }
            : i
        )
      );
      return qty;
    }
    persist([...items, { ...item, qty: Math.min(item.maxQty, item.qty) }]);
    return item.qty;
  };

  const updateQty = (productId: string, variantId: string | undefined, qty: number) => {
    persist(
      items
        .map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, qty: Math.min(i.maxQty, Math.max(0, qty)) }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (productId: string, variantId?: string) => {
    persist(items.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  };

  const clear = () => persist([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return { items, ready, addItem, updateQty, removeItem, clear, count, subtotal };
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setIds(read<string[]>(WISH_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("lol-storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("lol-storage", onStorage);
    };
  }, [refresh]);

  const toggle = (productId: string) => {
    const next = ids.includes(productId)
      ? ids.filter((id) => id !== productId)
      : [...ids, productId];
    setIds(next);
    write(WISH_KEY, next);
  };

  const has = (productId: string) => ids.includes(productId);

  return { ids, ready, toggle, has };
}
