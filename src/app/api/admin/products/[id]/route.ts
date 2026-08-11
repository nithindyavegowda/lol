import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { id } = await ctx.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

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

    const fields = [
      "title",
      "subtitle",
      "description",
      "category",
      "care",
      "dimensions",
      "weight",
      "status",
    ] as const;
    for (const f of fields) {
      if (body[f] !== undefined) data[f] = String(body[f]);
    }
    if (body.slug !== undefined) data.slug = String(body.slug) || slugify(String(body.title || ""));
    if (body.tags !== undefined)
      data.tags = typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags);
    if (body.bullets !== undefined)
      data.bullets =
        typeof body.bullets === "string" ? body.bullets : JSON.stringify(body.bullets);
    if (body.materials !== undefined)
      data.materials =
        typeof body.materials === "string" ? body.materials : JSON.stringify(body.materials);
    if (body.price !== undefined) data.price = Number(body.price) || 0;
    if (body.compareAtPrice !== undefined) {
      data.compareAtPrice =
        body.compareAtPrice === null || body.compareAtPrice === ""
          ? null
          : Number(body.compareAtPrice);
    }
    if (body.maxQty !== undefined) data.maxQty = Number(body.maxQty) || 5;
    if (body.leadTimeDays !== undefined) data.leadTimeDays = Number(body.leadTimeDays) || 14;
    if (body.featured !== undefined) data.featured = Boolean(body.featured);

    if (Array.isArray(body.variants)) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      await prisma.productVariant.createMany({
        data: body.variants.map(
          (v: {
            color?: string;
            size?: string;
            sku?: string;
            priceOverride?: number | null;
          }) => ({
            productId: id,
            color: v.color || "",
            size: v.size || "",
            sku: v.sku || "",
            priceOverride: v.priceOverride ?? null,
          })
        ),
      });
    }

    if (Array.isArray(body.newImages)) {
      const count = await prisma.productImage.count({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: body.newImages.map((img: { url: string; alt?: string }, i: number) => ({
          productId: id,
          url: img.url,
          alt: img.alt || "",
          sortOrder: count + i,
        })),
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    });

    return NextResponse.json({ product });
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
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
