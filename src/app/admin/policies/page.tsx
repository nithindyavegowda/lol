"use client";

import { FormEvent, useEffect, useState } from "react";
import { slugify } from "@/lib/utils";

type Policy = {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
};

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  async function load() {
    const res = await fetch("/api/admin/policies");
    const data = await res.json();
    setPolicies(data.policies || []);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p: Policy) {
    setEditing(p);
    setTitle(p.title);
    setSlug(p.slug);
    setContent(p.content);
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
      await fetch(`/api/admin/policies/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content }),
      });
    } else {
      await fetch("/api/admin/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug: slug || slugify(title), content }),
      });
    }
    startNew();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete policy?")) return;
    await fetch(`/api/admin/policies/${id}`, { method: "DELETE" });
    load();
  }

  async function toggle(p: Policy) {
    await fetch(`/api/admin/policies/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Policies</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={save} className="stitched space-y-3 rounded-2xl bg-white/45 p-4">
          <h2 className="font-display text-xl">{editing ? "Edit policy" : "New policy"}</h2>
          <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="input" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <textarea className="input min-h-40" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
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
          {policies.map((p) => (
            <li key={p.id} className="stitched rounded-xl bg-white/45 p-3 text-sm">
              <div className="font-medium">{p.title}</div>
              <div className="opacity-60 text-xs mb-2">/{p.slug}{!p.published ? " · hidden" : ""}</div>
              <div className="flex gap-3">
                <button type="button" className="underline" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button type="button" className="underline" onClick={() => toggle(p)}>
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button type="button" className="underline text-red-800" onClick={() => remove(p.id)}>
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
