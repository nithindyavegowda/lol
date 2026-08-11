"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function ShopFilters({
  categories,
  colors,
}: {
  categories: string[];
  colors: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [color, setColor] = useState(searchParams.get("color") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (color) params.set("color", color);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  };

  const clear = () => {
    setQ("");
    setCategory("");
    setColor("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/shop");
  };

  return (
    <form
      onSubmit={submit}
      className="stitched rounded-2xl p-4 bg-[rgba(255,255,255,0.4)] grid gap-3 sm:grid-cols-2 lg:grid-cols-6"
    >
      <div className="lg:col-span-2">
        <label className="label" htmlFor="shop-q">
          Search
        </label>
        <input
          id="shop-q"
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Bunny, bag, scarf…"
        />
      </div>
      <div>
        <label className="label" htmlFor="shop-category">
          Category
        </label>
        <select
          id="shop-category"
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="shop-color">
          Colour
        </label>
        <select
          id="shop-color"
          className="input"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          <option value="">All</option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="shop-min">
          Min ₹
        </label>
        <input
          id="shop-min"
          className="input"
          type="number"
          min={0}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="shop-max">
          Max ₹
        </label>
        <input
          id="shop-max"
          className="input"
          type="number"
          min={0}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <div className="sm:col-span-2 lg:col-span-6 flex flex-wrap gap-2">
        <button type="submit" className="btn-primary btn-yarn">
          Apply filters
        </button>
        <button type="button" className="btn-primary !bg-transparent" onClick={clear}>
          Clear
        </button>
      </div>
    </form>
  );
}
