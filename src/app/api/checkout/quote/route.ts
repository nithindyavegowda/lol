import { NextRequest, NextResponse } from "next/server";
import { buildQuote, type QuoteItemInput } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = (body.items || []) as QuoteItemInput[];
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
