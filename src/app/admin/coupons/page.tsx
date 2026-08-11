"use client";

import { FormEvent, useEffect, useState } from "react";

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  active: boolean;
  expiresAt: string | null;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("10");
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data.coupons || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, type, value: Number(value), active: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Failed");
      return;
    }
    setCode("");
    setMsg("Created");
    load();
  }

  async function toggle(c: Coupon) {
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Coupons</h1>
      <form onSubmit={create} className="stitched mb-6 grid gap-3 rounded-2xl bg-white/45 p-4 md:grid-cols-4">
        <input className="input" placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value)} required />
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="percent">percent</option>
          <option value="fixed">fixed</option>
        </select>
        <input className="input" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>
      {msg ? <p className="mb-3 text-sm">{msg}</p> : null}
      <ul className="space-y-2">
        {coupons.map((c) => (
          <li key={c.id} className="stitched flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/45 p-3 text-sm">
            <span>
              <strong>{c.code}</strong> · {c.type} {c.value}
              {!c.active ? " · inactive" : ""}
            </span>
            <span className="flex gap-3">
              <button type="button" className="underline" onClick={() => toggle(c)}>
                {c.active ? "Deactivate" : "Activate"}
              </button>
              <button type="button" className="underline text-red-800" onClick={() => remove(c.id)}>
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
