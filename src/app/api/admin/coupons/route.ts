import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const code = String(body.code || "")
      .trim()
      .toUpperCase();
    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    const coupon = await prisma.coupon.create({
      data: {
        code,
        type: String(body.type || "percent"),
        value: Number(body.value) || 0,
        active: body.active !== false,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
