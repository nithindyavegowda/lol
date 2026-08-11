import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;
  const source = await prisma.product.findUnique({
    where: { id },
    include: { images: true, variants: true },
  });
  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = `${source.slug}-copy-${Date.now().toString(36)}`;
  const product = await prisma.product.create({
    data: {
      title: `${source.title} (copy)`,
      slug,
      subtitle: source.subtitle,
      description: source.description,
      category: source.category,
      tags: source.tags,
      bullets: source.bullets,
      materials: source.materials,
      care: source.care,
      dimensions: source.dimensions,
      weight: source.weight,
      price: source.price,
      compareAtPrice: source.compareAtPrice,
      maxQty: source.maxQty,
      leadTimeDays: source.leadTimeDays,
      featured: false,
      status: "draft",
      images: {
        create: source.images.map((img: { url: string; alt: string; sortOrder: number }) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder,
        })),
      },
      variants: {
        create: source.variants.map(
          (v: { color: string; size: string; sku: string; priceOverride: number | null }) => ({
            color: v.color,
            size: v.size,
            sku: v.sku ? `${v.sku}-copy` : "",
            priceOverride: v.priceOverride,
          })
        ),
      },
    },
    include: { images: true, variants: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}
