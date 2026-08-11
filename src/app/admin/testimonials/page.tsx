"use client";

import { FormEvent, useEffect, useState } from "react";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  photoUrl: string | null;
  published: boolean;
  sortOrder: number;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");

  async function load() {
    const res = await fetch("/api/admin/testimonials");
    const data = await res.json();
    setItems(data.testimonials || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote, name }),
    });
    setQuote("");
    setName("");
    load();
  }

  async function toggle(t: Testimonial) {
    await fetch(`/api/admin/testimonials/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !t.published }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Testimonials</h1>
      <form onSubmit={create} className="stitched mb-6 space-y-3 rounded-2xl bg-white/45 p-4">
        <textarea className="input min-h-20" placeholder="Quote" value={quote} onChange={(e) => setQuote(e.target.value)} required />
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>
      <ul className="space-y-3">
        {items.map((t) => (
          <li key={t.id} className="stitched rounded-xl bg-white/45 p-4">
            <p className="mb-2">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>— {t.name}{!t.published ? " (hidden)" : ""}</span>
              <span className="flex gap-3">
                <button type="button" className="underline" onClick={() => toggle(t)}>
                  {t.published ? "Unpublish" : "Publish"}
                </button>
                <button type="button" className="underline text-red-800" onClick={() => remove(t.id)}>
                  Delete
                </button>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
