import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const ids = searchParams.get("ids");
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();

  const where: Record<string, unknown> = { status: "published" };

  if (ids) {
    const idList = ids
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    where.id = { in: idList };
  }

  if (category) {
    where.category = category;
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { subtitle: { contains: q } },
      { description: { contains: q } },
      { category: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ products });
}
