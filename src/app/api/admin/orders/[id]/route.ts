import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { OPEN_ORDER_STATUSES } from "@/lib/utils";
import { getShopSettings } from "@/lib/pricing";

const ALLOWED = [
  "new",
  "confirmed",
  "making",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const status = String(body.status || "");
    if (!ALLOWED.includes(status as (typeof ALLOWED)[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    const settings = await getShopSettings();
    const openCount = await prisma.order.count({
      where: { status: { in: [...OPEN_ORDER_STATUSES] } },
    });
    if (openCount < settings.maxOpenOrders && settings.paused) {
      // leave paused as-is unless explicitly managed; only auto-pause on capacity
    }

    return NextResponse.json({ order, openCount });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
