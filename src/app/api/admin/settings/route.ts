import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { getShopSettings } from "@/lib/pricing";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const settings = await getShopSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.announcement !== undefined) data.announcement = String(body.announcement);
    if (body.paused !== undefined) data.paused = Boolean(body.paused);
    if (body.maxOpenOrders !== undefined) data.maxOpenOrders = Number(body.maxOpenOrders) || 10;
    if (body.upiId !== undefined) data.upiId = String(body.upiId);
    if (body.depositNote !== undefined) data.depositNote = String(body.depositNote);
    if (body.whatsappNumber !== undefined)
      data.whatsappNumber = String(body.whatsappNumber || "918884558657");
    if (body.shippingRules !== undefined) {
      data.shippingRules =
        typeof body.shippingRules === "string"
          ? body.shippingRules
          : JSON.stringify(body.shippingRules);
    }
    if (body.instagramLinks !== undefined) {
      data.instagramLinks =
        typeof body.instagramLinks === "string"
          ? body.instagramLinks
          : JSON.stringify(body.instagramLinks);
    }
    if (body.aboutContent !== undefined) data.aboutContent = String(body.aboutContent);
    if (body.shopName !== undefined) data.shopName = String(body.shopName);
    if (body.shopTagline !== undefined) data.shopTagline = String(body.shopTagline);

    const settings = await prisma.shopSettings.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        whatsappNumber: "918884558657",
        ...data,
      },
    });

    return NextResponse.json({ settings });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
