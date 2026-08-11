"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatInr } from "@/lib/utils";

type Stats = {
  productCount: number;
  publishedCount: number;
  draftCount: number;
  openOrders: number;
  totalOrders: number;
  revenue: number;
  maxOpenOrders: number;
  paused: boolean;
  capacityFull: boolean;
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  byStatus: Record<string, number>;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load stats");
        return r.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-700">{error}</p>;
  if (!stats) return <p>Loading dashboard…</p>;

  const cards = [
    { label: "Open orders", value: `${stats.openOrders} / ${stats.maxOpenOrders}` },
    { label: "Revenue", value: formatInr(stats.revenue) },
    { label: "Products", value: `${stats.publishedCount} live / ${stats.draftCount} draft` },
    { label: "Total orders", value: String(stats.totalOrders) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Dashboard</h1>
      <p className="mb-6 text-sm opacity-70">
        Shop is {stats.paused || stats.capacityFull ? "paused / at capacity" : "open"}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="stitched rounded-2xl bg-white/45 p-4">
            <div className="text-xs uppercase tracking-wide opacity-60">{c.label}</div>
            <div className="font-display text-2xl mt-1">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="stitched rounded-2xl bg-white/45 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm underline">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-dashed divide-[rgba(68,48,37,0.2)]">
          {stats.recentOrders.map((o) => (
            <li key={o.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <span>
                <strong>{o.orderNumber}</strong> · {o.customerName}
              </span>
              <span>
                {formatInr(o.total)} · {o.status}
              </span>
            </li>
          ))}
          {stats.recentOrders.length === 0 ? <li className="py-3 text-sm">No orders yet</li> : null}
        </ul>
      </div>
    </div>
  );
}
