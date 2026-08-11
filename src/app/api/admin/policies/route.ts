import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const policies = await prisma.policyPage.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json({ policies });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const policy = await prisma.policyPage.create({
      data: {
        title,
        slug: String(body.slug || slugify(title)),
        content: String(body.content || ""),
        published: body.published !== false,
      },
    });
    return NextResponse.json({ policy }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
