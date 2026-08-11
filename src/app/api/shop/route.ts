import { NextResponse } from "next/server";
import { getShopSettings, getOpenOrderCount } from "@/lib/pricing";
import { parseJson } from "@/lib/utils";

export async function GET() {
  const settings = await getShopSettings();
  const openOrders = await getOpenOrderCount();
  const capacityFull = openOrders >= settings.maxOpenOrders;

  return NextResponse.json({
    announcement: settings.announcement,
    paused: settings.paused || capacityFull,
    maxOpenOrders: settings.maxOpenOrders,
    openOrders,
    capacityFull,
    upiId: settings.upiId,
    depositNote: settings.depositNote,
    whatsappNumber: settings.whatsappNumber || "918884558657",
    shopName: settings.shopName,
    shopTagline: settings.shopTagline,
    aboutContent: settings.aboutContent,
    instagramLinks: parseJson(settings.instagramLinks, []),
    shippingRules: parseJson(settings.shippingRules, { flatFee: 0 }),
  });
}
