"use client";

import { FormEvent, useEffect, useState } from "react";
import { slugify } from "@/lib/utils";

type Guide = {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
};

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [editing, setEditing] = useState<Guide | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  async function load() {
    const res = await fetch("/api/admin/guides");
    const data = await res.json();
    setGuides(data.guides || []);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(g: Guide) {
    setEditing(g);
    setTitle(g.title);
    setSlug(g.slug);
    setContent(g.content);
  }

  function startNew() {
    setEditing(null);
    setTitle("");
    setSlug("");
    setContent("");
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/admin/guides/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content }),
      });
    } else {
      await fetch("/api/admin/guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug: slug || slugify(title), content }),
      });
    }
    startNew();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete guide?")) return;
    await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
    load();
  }

  async function toggle(g: Guide) {
    await fetch(`/api/admin/guides/${g.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !g.published }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Guides</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={save} className="stitched space-y-3 rounded-2xl bg-white/45 p-4">
          <h2 className="font-display text-xl">{editing ? "Edit guide" : "New guide"}</h2>
          <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="input" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <textarea className="input min-h-40" placeholder="Content (markdown ok)" value={content} onChange={(e) => setContent(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              {editing ? "Update" : "Create"}
            </button>
            {editing ? (
              <button type="button" className="text-sm underline" onClick={startNew}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
        <ul className="space-y-2">
          {guides.map((g) => (
            <li key={g.id} className="stitched rounded-xl bg-white/45 p-3 text-sm">
              <div className="font-medium">{g.title}</div>
              <div className="opacity-60 text-xs mb-2">/{g.slug}{!g.published ? " · hidden" : ""}</div>
              <div className="flex gap-3">
                <button type="button" className="underline" onClick={() => startEdit(g)}>
                  Edit
                </button>
                <button type="button" className="underline" onClick={() => toggle(g)}>
                  {g.published ? "Unpublish" : "Publish"}
                </button>
                <button type="button" className="underline text-red-800" onClick={() => remove(g.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
