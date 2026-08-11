import { prisma } from "@/lib/prisma";
import {
  OPEN_ORDER_STATUSES,
  calcShipping,
  parseJson,
  type ShippingRules,
} from "@/lib/utils";

export type QuoteItemInput = {
  productId: string;
  variantId?: string;
  qty: number;
};

export type ValidatedLine = {
  productId: string;
  productTitle: string;
  variantLabel: string;
  qty: number;
  unitPrice: number;
  imageUrl: string;
  leadTimeDays: number;
};

export function applyCouponDiscount(
  subtotal: number,
  coupon: { type: string; value: number; active: boolean; expiresAt: Date | null } | null
) {
  if (!coupon || !coupon.active) return 0;
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return 0;
  if (coupon.type === "percent") {
    return Math.min(subtotal, Math.round((subtotal * coupon.value) / 100));
  }
  if (coupon.type === "fixed") {
    return Math.min(subtotal, coupon.value);
  }
  return 0;
}

export async function getShopSettings() {
  let settings = await prisma.shopSettings.findUnique({ where: { id: "default" } });
  if (!settings) {
    settings = await prisma.shopSettings.create({
      data: { id: "default", whatsappNumber: "918884558657" },
    });
  }
  return settings;
}

export async function getOpenOrderCount() {
  return prisma.order.count({
    where: { status: { in: [...OPEN_ORDER_STATUSES] } },
  });
}

export async function validateCartItems(items: QuoteItemInput[]) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const lines: ValidatedLine[] = [];

  for (const item of items) {
    const qty = Math.max(1, Math.floor(Number(item.qty) || 0));
    if (!item.productId || qty < 1) throw new Error("Invalid cart item");

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    });

    if (!product || product.status !== "published") {
      throw new Error(`Product unavailable: ${item.productId}`);
    }
    if (qty > product.maxQty) {
      throw new Error(`${product.title} max qty is ${product.maxQty}`);
    }

    let unitPrice = product.price;
    let variantLabel = "";

    if (item.variantId) {
      const variant = product.variants.find((v: { id: string; color: string; size: string; priceOverride: number | null }) => v.id === item.variantId);
      if (!variant) throw new Error(`Variant not found for ${product.title}`);
      if (variant.priceOverride != null) unitPrice = variant.priceOverride;
      variantLabel = [variant.color, variant.size].filter(Boolean).join(" / ");
    }

    lines.push({
      productId: product.id,
      productTitle: product.title,
      variantLabel,
      qty,
      unitPrice,
      imageUrl: product.images[0]?.url || "",
      leadTimeDays: product.leadTimeDays,
    });
  }

  return lines;
}

export async function buildQuote(input: {
  items: QuoteItemInput[];
  couponCode?: string | null;
  pincode?: string;
}) {
  const settings = await getShopSettings();
  const openCount = await getOpenOrderCount();
  const capacityFull = openCount >= settings.maxOpenOrders;
  const paused = settings.paused || capacityFull;

  const lines = await validateCartItems(input.items);
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);

  let coupon = null as Awaited<ReturnType<typeof prisma.coupon.findUnique>> | null;
  if (input.couponCode) {
    coupon = await prisma.coupon.findUnique({
      where: { code: String(input.couponCode).trim().toUpperCase() },
    });
  }

  const discount = applyCouponDiscount(subtotal, coupon);
  const rules = parseJson<ShippingRules>(settings.shippingRules, { flatFee: 0 });
  const shippingFee = calcShipping(input.pincode || "", rules);
  const total = Math.max(0, subtotal - discount + shippingFee);
  const maxLead = Math.max(...lines.map((l) => l.leadTimeDays), 0);

  return {
    settings,
    lines,
    subtotal,
    discount,
    shippingFee,
    total,
    paused,
    capacityFull,
    maxLead,
    couponCode: coupon?.active ? coupon.code : null,
  };
}

export async function nextOrderNumber() {
  const orders = await prisma.order.findMany({ select: { orderNumber: true } });
  let max = 1000;
  for (const o of orders) {
    const n = parseInt(o.orderNumber.replace(/\D/g, ""), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return `ORD-${max + 1}`;
}
