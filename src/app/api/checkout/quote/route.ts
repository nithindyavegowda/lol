import { NextRequest, NextResponse } from "next/server";
import { buildQuote, type QuoteItemInput } from "@/lib/pricing";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(`quote:${clientIp(req)}`, {
    limit: 60,
    windowMs: 60_000,
  });
  if (limited) return limited;

  try {
    const body = await req.json();
    if (String(body.website || body.company || "").trim()) {
      return NextResponse.json({ error: "Rejected" }, { status: 400 });
    }
    const items = (body.items || []) as QuoteItemInput[];
    if (!items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    const quote = await buildQuote({
      items,
      couponCode: body.couponCode,
      pincode: body.pincode,
    });

    return NextResponse.json({
      subtotal: quote.subtotal,
      discount: quote.discount,
      shippingFee: quote.shippingFee,
      total: quote.total,
      paused: quote.paused,
      capacityFull: quote.capacityFull,
      couponCode: quote.couponCode,
      lines: quote.lines,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Quote failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
