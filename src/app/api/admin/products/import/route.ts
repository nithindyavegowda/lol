import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { slugify } from "@/lib/utils";

type Row = {
  title?: string;
  slug?: string;
  price?: string;
  category?: string;
  status?: string;
  description?: string;
  leadTimeDays?: string;
  maxQty?: string;
  compareAtPrice?: string;
};

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const contentType = req.headers.get("content-type") || "";
    let csvText = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      csvText = String(body?.csv || "");
    } else {
      const form = await req.formData();
      const file = form.get("file");
      if (file instanceof File) {
        csvText = await file.text();
      } else {
        csvText = String(form.get("csv") || "");
      }
    }

    if (!csvText.trim()) {
      return NextResponse.json({ error: "No CSV provided" }, { status: 400 });
    }

    const parsed = Papa.parse<Row>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const created: string[] = [];
    const errors: string[] = [];

    for (const [i, row] of parsed.data.entries()) {
      try {
        const title = String(row.title || "").trim();
        if (!title) {
          errors.push(`Row ${i + 2}: missing title`);
          continue;
        }
        let slug = String(row.slug || slugify(title)).trim() || slugify(title);
        const exists = await prisma.product.findUnique({ where: { slug } });
        if (exists) slug = `${slug}-${Date.now().toString(36)}`;

        const product = await prisma.product.create({
          data: {
            title,
            slug,
            description: String(row.description || ""),
            category: String(row.category || "Other"),
            status: String(row.status || "draft"),
            price: Number(row.price) || 0,
            leadTimeDays: Number(row.leadTimeDays) || 14,
            maxQty: Number(row.maxQty) || 5,
            compareAtPrice:
              row.compareAtPrice === undefined || row.compareAtPrice === ""
                ? null
                : Number(row.compareAtPrice),
          },
        });
        created.push(product.id);
      } catch (e) {
        errors.push(`Row ${i + 2}: ${e instanceof Error ? e.message : "failed"}`);
      }
    }

    return NextResponse.json({ created: created.length, ids: created, errors });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
