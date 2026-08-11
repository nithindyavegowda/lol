"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { parseJson } from "@/lib/utils";

type Image = { id: string; url: string; alt: string; sortOrder: number };
type Variant = { id?: string; color: string; size: string; sku: string; priceOverride: number | null };

type Product = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  category: string;
  tags: string;
  bullets: string;
  materials: string;
  care: string;
  dimensions: string;
  weight: string;
  price: number;
  compareAtPrice: number | null;
  maxQty: number;
  leadTimeDays: number;
  featured: boolean;
  status: string;
  images: Image[];
  variants: Variant[];
};

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [variantsJson, setVariantsJson] = useState("[]");
  const [materialsJson, setMaterialsJson] = useState("{}");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/products/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Not found");
      return;
    }
    setProduct(data.product);
    setVariantsJson(JSON.stringify(data.product.variants || [], null, 2));
    setMaterialsJson(
      JSON.stringify(parseJson(data.product.materials, {}), null, 2)
    );
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!product) return;
    setSaving(true);
    setMsg("");
    let variants: Variant[] = [];
    let materials: unknown = {};
    try {
      variants = JSON.parse(variantsJson);
      materials = JSON.parse(materialsJson);
    } catch {
      setSaving(false);
      setMsg("Invalid JSON in variants or materials");
      return;
    }

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: product.title,
        slug: product.slug,
        subtitle: product.subtitle,
        description: product.description,
        category: product.category,
        tags: product.tags,
        bullets: product.bullets,
        materials,
        care: product.care,
        dimensions: product.dimensions,
        weight: product.weight,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        maxQty: product.maxQty,
        leadTimeDays: product.leadTimeDays,
        featured: product.featured,
        status: product.status,
        variants,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMsg(data.error || "Save failed");
      return;
    }
    setProduct(data.product);
    setVariantsJson(JSON.stringify(data.product.variants || [], null, 2));
    setMsg("Saved");
  }

  async function uploadImage(file: File | null) {
    if (!file || !product) return;
    const fd = new FormData();
    fd.append("file", file);
    const up = await fetch("/api/upload", { method: "POST", body: fd });
    const upData = await up.json();
    if (!up.ok) {
      setMsg(upData.error || "Upload failed");
      return;
    }
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newImages: [{ url: upData.url, alt: product.title }] }),
    });
    const data = await res.json();
    if (res.ok) setProduct(data.product);
    else setMsg(data.error || "Failed to attach image");
  }

  async function moveImage(index: number, dir: -1 | 1) {
    if (!product) return;
    const images = [...product.images];
    const j = index + dir;
    if (j < 0 || j >= images.length) return;
    [images[index], images[j]] = [images[j], images[index]];
    const payload = images.map((img, i) => ({ id: img.id, sortOrder: i }));
    const res = await fetch(`/api/admin/products/${id}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setProduct({ ...product, images: data.images });
    }
  }

  async function duplicate() {
    const res = await fetch(`/api/admin/products/${id}/duplicate`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Duplicate failed");
      return;
    }
    router.push(`/admin/products/${data.product.id}`);
  }

  async function remove() {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.push("/admin/products");
  }

  if (!product) return <p>{msg || "Loading…"}</p>;

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((p) => (p ? { ...p, [key]: value } : p));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Edit product</h1>
        <div className="flex gap-2">
          <button type="button" className="btn-primary !py-2 !px-4 text-sm" onClick={duplicate}>
            Duplicate
          </button>
          <button
            type="button"
            className="rounded-full border border-dashed border-red-700 px-4 py-2 text-sm text-red-800"
            onClick={remove}
          >
            Delete
          </button>
        </div>
      </div>

      <form onSubmit={save} className="space-y-6">
        <div className="stitched grid gap-4 rounded-2xl bg-white/45 p-6 md:grid-cols-2">
          <div>
            <label className="label">Title</label>
            <input className="input" value={product.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className="label">Slug</label>
            <input className="input" value={product.slug} onChange={(e) => set("slug", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Subtitle</label>
            <input className="input" value={product.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="input min-h-28"
              value={product.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={product.category} onChange={(e) => set("category", e.target.value)} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={product.status} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </div>
          <div>
            <label className="label">Price (₹)</label>
            <input
              className="input"
              type="number"
              value={product.price}
              onChange={(e) => set("price", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Compare at</label>
            <input
              className="input"
              type="number"
              value={product.compareAtPrice ?? ""}
              onChange={(e) =>
                set("compareAtPrice", e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </div>
          <div>
            <label className="label">Max qty</label>
            <input
              className="input"
              type="number"
              value={product.maxQty}
              onChange={(e) => set("maxQty", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Lead time (days)</label>
            <input
              className="input"
              type="number"
              value={product.leadTimeDays}
              onChange={(e) => set("leadTimeDays", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Dimensions</label>
            <input className="input" value={product.dimensions} onChange={(e) => set("dimensions", e.target.value)} />
          </div>
          <div>
            <label className="label">Weight</label>
            <input className="input" value={product.weight} onChange={(e) => set("weight", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Care</label>
            <input className="input" value={product.care} onChange={(e) => set("care", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Tags (JSON array string)</label>
            <input className="input" value={product.tags} onChange={(e) => set("tags", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Bullets (JSON array string)</label>
            <input className="input" value={product.bullets} onChange={(e) => set("bullets", e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input
              type="checkbox"
              checked={product.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Featured
          </label>
        </div>

        <div className="stitched rounded-2xl bg-white/45 p-6">
          <h2 className="font-display text-xl mb-3">Images</h2>
          <div className="mb-4 flex flex-wrap gap-3">
            {product.images.map((img, i) => (
              <div key={img.id} className="w-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt} className="h-24 w-28 rounded-lg object-cover" />
                <div className="mt-1 flex gap-1">
                  <button type="button" className="text-xs underline" onClick={() => moveImage(i, -1)}>
                    Up
                  </button>
                  <button type="button" className="text-xs underline" onClick={() => moveImage(i, 1)}>
                    Down
                  </button>
                </div>
              </div>
            ))}
          </div>
          <label className="btn-primary !py-2 !px-4 text-sm cursor-pointer inline-flex">
            Upload image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadImage(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="stitched grid gap-4 rounded-2xl bg-white/45 p-6 md:grid-cols-2">
          <div>
            <label className="label">Variants (JSON)</label>
            <textarea
              className="input min-h-40 font-mono text-xs"
              value={variantsJson}
              onChange={(e) => setVariantsJson(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Materials (JSON)</label>
            <textarea
              className="input min-h-40 font-mono text-xs"
              value={materialsJson}
              onChange={(e) => setMaterialsJson(e.target.value)}
            />
          </div>
        </div>

        {msg ? <p className="text-sm">{msg}</p> : null}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
