"use client";

import { useEffect, useState } from "react";
import { formatInr } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  total: number;
  status: string;
  createdAt: string;
  items: { productTitle: string; qty: number }[];
};

const STATUSES = ["new", "confirmed", "making", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    setMsg("");
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Update failed");
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: data.order.status } : o)));
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Orders</h1>
      <p className="mb-6 text-sm opacity-70">Update fulfilment status</p>
      {msg ? <p className="mb-3 text-sm text-red-700">{msg}</p> : null}
      <div className="stitched overflow-x-auto rounded-2xl bg-white/45">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-dashed border-[rgba(68,48,37,0.25)]">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-dashed border-[rgba(68,48,37,0.12)]">
                <td className="p-3">
                  <div className="font-medium">{o.orderNumber}</div>
                  <div className="text-xs opacity-60">
                    {new Date(o.createdAt).toLocaleString("en-IN")}
                  </div>
                </td>
                <td className="p-3">
                  {o.customerName}
                  <div className="text-xs opacity-60">
                    {o.customerPhone} · {o.city}
                  </div>
                </td>
                <td className="p-3">
                  {o.items.map((i) => `${i.productTitle}×${i.qty}`).join(", ")}
                </td>
                <td className="p-3">{formatInr(o.total)}</td>
                <td className="p-3">
                  <select
                    className="input !w-auto"
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
