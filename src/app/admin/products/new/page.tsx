"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";

export default function NewProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("0");
  const [category, setCategory] = useState("Other");
  const [status, setStatus] = useState("draft");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: slug || slugify(title),
        price: Number(price),
        category,
        status,
        description,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    router.push(`/admin/products/${data.product.id}`);
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">New product</h1>
      <form onSubmit={onSubmit} className="stitched max-w-xl space-y-4 rounded-2xl bg-white/45 p-6">
        <div>
          <label className="label">Title</label>
          <input
            className="input"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) setSlug(slugify(e.target.value));
            }}
            required
          />
        </div>
        <div>
          <label className="label">Slug</label>
          <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Price (₹)</label>
            <input className="input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-28" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Creating…" : "Create"}
        </button>
      </form>
    </div>
  );
}
