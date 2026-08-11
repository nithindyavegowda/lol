import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { OPEN_ORDER_STATUSES } from "@/lib/utils";
import { getShopSettings } from "@/lib/pricing";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const settings = await getShopSettings();
  const [
    productCount,
    publishedCount,
    draftCount,
    openOrders,
    totalOrders,
    revenueAgg,
    recentOrders,
    byStatus,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "published" } }),
    prisma.product.count({ where: { status: "draft" } }),
    prisma.order.count({ where: { status: { in: [...OPEN_ORDER_STATUSES] } } }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "cancelled" } },
    }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  return NextResponse.json({
    productCount,
    publishedCount,
    draftCount,
    openOrders,
    totalOrders,
    revenue: revenueAgg._sum.total || 0,
    maxOpenOrders: settings.maxOpenOrders,
    paused: settings.paused,
    capacityFull: openOrders >= settings.maxOpenOrders,
    recentOrders,
    byStatus: Object.fromEntries(
      byStatus.map((s: { status: string; _count: { _all: number } }) => [s.status, s._count._all])
    ),
  });
}
