"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatInr } from "@/lib/utils";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  status: string;
  featured: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [importMsg, setImportMsg] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onImport(file: File | null) {
    if (!file) return;
    setImportMsg("Importing…");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/products/import", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      setImportMsg(data.error || "Import failed");
      return;
    }
    setImportMsg(`Imported ${data.created} products${data.errors?.length ? ` (${data.errors.length} errors)` : ""}`);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="text-sm opacity-70">Manage catalogue, drafts, and CSV import</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="btn-primary cursor-pointer !py-2 !px-4 text-sm">
            Import CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => onImport(e.target.files?.[0] || null)}
            />
          </label>
          <Link href="/admin/products/new" className="btn-primary !py-2 !px-4 text-sm">
            New product
          </Link>
        </div>
      </div>
      {importMsg ? <p className="mb-4 text-sm">{importMsg}</p> : null}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="stitched overflow-x-auto rounded-2xl bg-white/45">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-dashed border-[rgba(68,48,37,0.25)]">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-dashed border-[rgba(68,48,37,0.12)]">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{formatInr(p.price)}</td>
                  <td className="p-3">{p.status}</td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs opacity-60">
        CSV columns: title, slug, price, category, status, description, leadTimeDays, maxQty,
        compareAtPrice
      </p>
    </div>
  );
}
