"use client";

import { FormEvent, useEffect, useState } from "react";

type Settings = {
  announcement: string;
  paused: boolean;
  maxOpenOrders: number;
  upiId: string;
  depositNote: string;
  whatsappNumber: string;
  shippingRules: string;
  aboutContent: string;
  instagramLinks: string;
  shopName: string;
  shopTagline: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings));
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMsg("");
    try {
      JSON.parse(settings.shippingRules);
      JSON.parse(settings.instagramLinks);
    } catch {
      setSaving(false);
      setMsg("shippingRules and instagramLinks must be valid JSON");
      return;
    }
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMsg(data.error || "Save failed");
      return;
    }
    setSettings(data.settings);
    setMsg("Saved");
  }

  if (!settings) return <p>Loading…</p>;

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Settings</h1>
      <form onSubmit={save} className="stitched max-w-3xl space-y-4 rounded-2xl bg-white/45 p-6">
        <div>
          <label className="label">Announcement</label>
          <input className="input" value={settings.announcement} onChange={(e) => set("announcement", e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={settings.paused} onChange={(e) => set("paused", e.target.checked)} />
          Orders paused
        </label>
        <div>
          <label className="label">Max open orders</label>
          <input
            className="input"
            type="number"
            value={settings.maxOpenOrders}
            onChange={(e) => set("maxOpenOrders", Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">UPI ID</label>
          <input className="input" value={settings.upiId} onChange={(e) => set("upiId", e.target.value)} />
        </div>
        <div>
          <label className="label">Deposit note</label>
          <textarea className="input min-h-20" value={settings.depositNote} onChange={(e) => set("depositNote", e.target.value)} />
        </div>
        <div>
          <label className="label">WhatsApp number</label>
          <input
            className="input"
            value={settings.whatsappNumber}
            onChange={(e) => set("whatsappNumber", e.target.value)}
            placeholder="918884558657"
          />
        </div>
        <div>
          <label className="label">Shipping rules (JSON)</label>
          <textarea
            className="input min-h-28 font-mono text-xs"
            value={settings.shippingRules}
            onChange={(e) => set("shippingRules", e.target.value)}
          />
        </div>
        <div>
          <label className="label">About content</label>
          <textarea
            className="input min-h-32"
            value={settings.aboutContent}
            onChange={(e) => set("aboutContent", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Instagram links (JSON)</label>
          <textarea
            className="input min-h-28 font-mono text-xs"
            value={settings.instagramLinks}
            onChange={(e) => set("instagramLinks", e.target.value)}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Shop name</label>
            <input className="input" value={settings.shopName} onChange={(e) => set("shopName", e.target.value)} />
          </div>
          <div>
            <label className="label">Tagline</label>
            <input className="input" value={settings.shopTagline} onChange={(e) => set("shopTagline", e.target.value)} />
          </div>
        </div>
        {msg ? <p className="text-sm">{msg}</p> : null}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
