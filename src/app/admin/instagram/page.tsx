"use client";

import { FormEvent, useEffect, useState } from "react";
import { parseJson } from "@/lib/utils";

type IgLink = { url: string; caption: string; thumb: string };

export default function AdminInstagramPage() {
  const [links, setLinks] = useState<IgLink[]>([]);
  const [raw, setRaw] = useState("[]");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        const parsed = parseJson<IgLink[]>(d.settings?.instagramLinks, []);
        setLinks(parsed);
        setRaw(JSON.stringify(parsed, null, 2));
      });
  }, []);

  function syncFromRaw() {
    try {
      const parsed = JSON.parse(raw) as IgLink[];
      setLinks(parsed);
      setMsg("");
    } catch {
      setMsg("Invalid JSON");
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    let parsed: IgLink[];
    try {
      parsed = JSON.parse(raw);
    } catch {
      setSaving(false);
      setMsg("Invalid JSON");
      return;
    }
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instagramLinks: parsed }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMsg(data.error || "Save failed");
      return;
    }
    const next = parseJson<IgLink[]>(data.settings.instagramLinks, []);
    setLinks(next);
    setRaw(JSON.stringify(next, null, 2));
    setMsg("Saved");
  }

  function addRow() {
    const next = [...links, { url: "https://instagram.com", caption: "", thumb: "" }];
    setLinks(next);
    setRaw(JSON.stringify(next, null, 2));
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Instagram</h1>
      <p className="mb-6 text-sm opacity-70">Edit gallery links stored in shop settings</p>
      <form onSubmit={save} className="stitched max-w-3xl space-y-4 rounded-2xl bg-white/45 p-6">
        <div className="flex gap-2">
          <button type="button" className="btn-primary !py-2 !px-4 text-sm" onClick={addRow}>
            Add link
          </button>
          <button type="button" className="text-sm underline" onClick={syncFromRaw}>
            Parse JSON
          </button>
        </div>
        <div>
          <label className="label">instagramLinks JSON</label>
          <textarea
            className="input min-h-64 font-mono text-xs"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>
        <ul className="space-y-2 text-sm">
          {links.map((l, i) => (
            <li key={i} className="flex gap-3 items-center">
              {l.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.thumb} alt="" className="h-10 w-10 rounded object-cover" />
              ) : (
                <div className="h-10 w-10 rounded bg-white/60" />
              )}
              <div>
                <div>{l.caption || "(no caption)"}</div>
                <a href={l.url} className="text-xs underline opacity-70" target="_blank" rel="noreferrer">
                  {l.url}
                </a>
              </div>
            </li>
          ))}
        </ul>
        {msg ? <p className="text-sm">{msg}</p> : null}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save Instagram links"}
        </button>
      </form>
    </div>
  );
}
