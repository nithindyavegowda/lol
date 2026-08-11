export const brand = {
  name: "LOL",
  fullName: "Loops of Love",
  tagline: "Made by me, made for you",
};

export function formatInr(paiseOrRupees: number) {
  // prices stored in whole rupees
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paiseOrRupees);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function estimateShipDate(leadTimeDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + leadTimeDays);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export type ShippingRules = {
  flatFee: number;
  bands?: { prefix: string; fee: number }[];
};

export function calcShipping(pincode: string, rules: ShippingRules) {
  const pin = (pincode || "").trim();
  if (rules.bands?.length) {
    for (const band of rules.bands) {
      if (pin.startsWith(band.prefix)) return band.fee;
    }
  }
  return rules.flatFee ?? 0;
}

export const OPEN_ORDER_STATUSES = ["new", "confirmed", "making"] as const;
