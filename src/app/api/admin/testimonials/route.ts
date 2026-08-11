import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const quote = String(body.quote || "").trim();
    const name = String(body.name || "").trim();
    if (!quote || !name) {
      return NextResponse.json({ error: "Quote and name required" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        quote,
        name,
        photoUrl: body.photoUrl || null,
        published: body.published !== false,
        sortOrder: Number(body.sortOrder) || 0,
      },
    });
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
