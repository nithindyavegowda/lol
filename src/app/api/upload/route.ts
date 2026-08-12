import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAuth } from "@/lib/require-auth";

async function uploadToCloudinary(bytes: Buffer, filename: string) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return null;

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(bytes)]), filename);
  form.append("folder", "lol/uploads");

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
    body: form,
  });
  const data = (await res.json()) as { secure_url?: string; error?: { message?: string } };
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }
  return data.secure_url;
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".bin";
    const safeBase = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 40);
    const filename = `${Date.now()}-${safeBase}${ext}`;

    const cloudUrl = await uploadToCloudinary(bytes, filename);
    if (cloudUrl) {
      return NextResponse.json({ url: cloudUrl });
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        },
        { status: 503 }
      );
    }

    // Local/dev only — Vercel filesystem is ephemeral
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), bytes);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
