import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildWhatsAppShortText, whatsappUrl } from "@/lib/whatsapp";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ token: string }> }
) {
  const { token } = await ctx.params;
  const order = await prisma.order.findUnique({
    where: { publicToken: token },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const settings = await prisma.shopSettings.findUnique({ where: { id: "default" } });
  const phone =
    settings?.whatsappNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "918884558657";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:1234").replace(
    /\/$/,
    ""
  );
  const statusUrl = `${siteUrl}/order/${order.publicToken}`;
  const shortWhatsappUrl = whatsappUrl(
    phone,
    buildWhatsAppShortText({
      orderNumber: order.orderNumber,
      statusUrl,
      total: order.total,
    })
  );

  return NextResponse.json({
    order,
    orderNumber: order.orderNumber,
    whatsappText: order.whatsappText,
    shortWhatsappUrl,
    statusUrl,
  });
}
