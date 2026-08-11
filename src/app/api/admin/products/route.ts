import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const products = await prisma.product.findMany({
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    let slug = String(body.slug || slugify(title)).trim() || slugify(title);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        subtitle: String(body.subtitle || ""),
        description: String(body.description || ""),
        category: String(body.category || "Other"),
        tags: typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || []),
        bullets:
          typeof body.bullets === "string" ? body.bullets : JSON.stringify(body.bullets || []),
        materials:
          typeof body.materials === "string"
            ? body.materials
            : JSON.stringify(body.materials || {}),
        care: String(body.care || ""),
        dimensions: String(body.dimensions || ""),
        weight: String(body.weight || ""),
        price: Number(body.price) || 0,
        compareAtPrice:
          body.compareAtPrice === null || body.compareAtPrice === ""
            ? null
            : Number(body.compareAtPrice),
        maxQty: Number(body.maxQty) || 5,
        leadTimeDays: Number(body.leadTimeDays) || 14,
        featured: Boolean(body.featured),
        status: String(body.status || "draft"),
        images: body.images?.length
          ? {
              create: body.images.map(
                (img: { url: string; alt?: string; sortOrder?: number }, i: number) => ({
                  url: img.url,
                  alt: img.alt || title,
                  sortOrder: img.sortOrder ?? i,
                })
              ),
            }
          : undefined,
        variants: body.variants?.length
          ? {
              create: body.variants.map(
                (v: {
                  color?: string;
                  size?: string;
                  sku?: string;
                  priceOverride?: number | null;
                }) => ({
                  color: v.color || "",
                  size: v.size || "",
                  sku: v.sku || "",
                  priceOverride: v.priceOverride ?? null,
                })
              ),
            }
          : undefined,
      },
      include: { images: true, variants: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
