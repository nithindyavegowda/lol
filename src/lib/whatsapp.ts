import type { ShippingRules } from "./utils";
import { formatInr } from "./utils";

export type OrderMessageInput = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  giftMessage?: string;
  notes?: string;
  couponCode?: string | null;
  discount: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  leadTimeNote: string;
  upiId?: string;
  depositNote?: string;
  statusUrl: string;
  items: { title: string; variantLabel?: string; qty: number; unitPrice: number }[];
};

export function buildWhatsAppOrderText(input: OrderMessageInput) {
  const lines = [
    `New LOL — Loops of Love order #${input.orderNumber}`,
    `Name: ${input.customerName}`,
    `Phone: ${input.customerPhone}`,
    `Address: ${input.addressLine}, ${input.city}, ${input.state} ${input.pincode}`,
    "",
    "Items:",
    ...input.items.map(
      (i) =>
        `- ${i.title}${i.variantLabel ? ` (${i.variantLabel})` : ""} x${i.qty} — ${formatInr(i.unitPrice * i.qty)}`
    ),
    "",
    `Subtotal: ${formatInr(input.subtotal)}`,
  ];
  if (input.couponCode) {
    lines.push(`Coupon ${input.couponCode}: -${formatInr(input.discount)}`);
  }
  lines.push(`Shipping: ${formatInr(input.shippingFee)}`);
  lines.push(`Total: ${formatInr(input.total)}`);
  lines.push(`Lead time: ${input.leadTimeNote}`);
  if (input.giftMessage) lines.push(`Gift message: ${input.giftMessage}`);
  if (input.notes) lines.push(`Notes: ${input.notes}`);
  if (input.upiId) lines.push(`UPI: ${input.upiId}`);
  if (input.depositNote) lines.push(`Payment: ${input.depositNote}`);
  lines.push(`Track order: ${input.statusUrl}`);
  return lines.join("\n");
}

export function whatsappUrl(phone: string, text: string) {
  const n = phone.replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export function customRequestWhatsAppText(data: {
  name: string;
  phone: string;
  description: string;
}) {
  return [
    "Custom LOL request",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    "",
    data.description,
  ].join("\n");
}

export type { ShippingRules };
