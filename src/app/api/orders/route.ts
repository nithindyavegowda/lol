import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { buildQuote, nextOrderNumber, type QuoteItemInput } from "@/lib/pricing";
import { estimateShipDate, OPEN_ORDER_STATUSES } from "@/lib/utils";
import { buildWhatsAppOrderText, whatsappUrl } from "@/lib/whatsapp";
import { sendOrderEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = (body.items || []) as QuoteItemInput[];

    const customerName = String(body.customerName || "").trim();
    const customerPhone = String(body.customerPhone || "").trim();
    const addressLine = String(body.addressLine || "").trim();
    const city = String(body.city || "").trim();
    const state = String(body.state || "").trim();
    const pincode = String(body.pincode || "").trim();
    const giftMessage = String(body.giftMessage || "").trim();
    const notes = String(body.notes || "").trim();

    if (!customerName || !customerPhone || !addressLine || !city || !state || !pincode) {
      return NextResponse.json({ error: "Missing customer fields" }, { status: 400 });
    }

    const quote = await buildQuote({
      items,
      couponCode: body.couponCode,
      pincode,
    });

    if (quote.capacityFull) {
      await prisma.shopSettings.update({
        where: { id: "default" },
        data: { paused: true },
      });
    }

    if (quote.settings.paused || quote.capacityFull) {
      return NextResponse.json(
        {
          error: "Orders are currently paused or at capacity",
          paused: true,
          capacityFull: quote.capacityFull,
        },
        { status: 403 }
      );
    }

    const orderNumber = await nextOrderNumber();
    const publicToken = randomUUID();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:1234").replace(
      /\/$/,
      ""
    );
    const statusUrl = `${siteUrl}/order/${publicToken}`;
    const leadTimeNote = `Ships around ${estimateShipDate(quote.maxLead)} (${quote.maxLead} days)`;

    const whatsappText = buildWhatsAppOrderText({
      orderNumber,
      customerName,
      customerPhone,
      addressLine,
      city,
      state,
      pincode,
      giftMessage,
      notes,
      couponCode: quote.couponCode,
      discount: quote.discount,
      shippingFee: quote.shippingFee,
      subtotal: quote.subtotal,
      total: quote.total,
      leadTimeNote,
      upiId: quote.settings.upiId,
      depositNote: quote.settings.depositNote,
      statusUrl,
      items: quote.lines.map((l) => ({
        title: l.productTitle,
        variantLabel: l.variantLabel,
        qty: l.qty,
        unitPrice: l.unitPrice,
      })),
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        publicToken,
        customerName,
        customerPhone,
        addressLine,
        city,
        state,
        pincode,
        giftMessage,
        notes,
        couponCode: quote.couponCode,
        discount: quote.discount,
        shippingFee: quote.shippingFee,
        subtotal: quote.subtotal,
        total: quote.total,
        status: "new",
        whatsappText,
        items: {
          create: quote.lines.map((l) => ({
            productId: l.productId,
            productTitle: l.productTitle,
            variantLabel: l.variantLabel,
            qty: l.qty,
            unitPrice: l.unitPrice,
            imageUrl: l.imageUrl,
          })),
        },
      },
      include: { items: true },
    });

    const openAfter = await prisma.order.count({
      where: { status: { in: [...OPEN_ORDER_STATUSES] } },
    });
    if (openAfter >= quote.settings.maxOpenOrders) {
      await prisma.shopSettings.update({
        where: { id: "default" },
        data: { paused: true },
      });
    }

    const notifyTo =
      process.env.ORDER_NOTIFY_EMAIL || "g.amie0311@gmail.com";
    await sendOrderEmail({
      to: notifyTo,
      subject: `New LOL order ${orderNumber}`,
      text: whatsappText,
    });

    const phone = quote.settings.whatsappNumber || "918884558657";
    const wa = whatsappUrl(phone, whatsappText);

    return NextResponse.json({
      order,
      whatsappUrl: wa,
      whatsappText,
      statusUrl,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Order failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
