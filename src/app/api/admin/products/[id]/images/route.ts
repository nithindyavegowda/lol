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
    const order = Array.isArray(body) ? body : body.items || body.images;
    if (!Array.isArray(order)) {
      return NextResponse.json({ error: "Expected array of {id, sortOrder}" }, { status: 400 });
    }

    await Promise.all(
      order.map((item: { id: string; sortOrder: number }) =>
        prisma.productImage.update({
          where: { id: item.id },
          data: { sortOrder: Number(item.sortOrder) },
        })
      )
    );

    const images = await prisma.productImage.findMany({
      where: { productId: id },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ images });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Reorder failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
