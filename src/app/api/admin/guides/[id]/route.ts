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
    if (body.title !== undefined) data.title = String(body.title);
    if (body.slug !== undefined) data.slug = String(body.slug);
    if (body.content !== undefined) data.content = String(body.content);
    if (body.published !== undefined) data.published = Boolean(body.published);

    const guide = await prisma.guidePage.update({ where: { id }, data });
    return NextResponse.json({ guide });
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
  await prisma.guidePage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
