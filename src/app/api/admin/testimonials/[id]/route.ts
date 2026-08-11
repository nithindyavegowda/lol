import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.quote !== undefined) data.quote = String(body.quote);
    if (body.name !== undefined) data.name = String(body.name);
    if (body.photoUrl !== undefined) data.photoUrl = body.photoUrl || null;
    if (body.published !== undefined) data.published = Boolean(body.published);
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;

    const testimonial = await prisma.testimonial.update({ where: { id }, data });
    return NextResponse.json({ testimonial });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
