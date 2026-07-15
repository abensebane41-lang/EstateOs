import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadPropertyImage, isSupabaseConfigured } from "@/shared/lib/storage";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.agencyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const propertyId = formData.get("propertyId") as string;
    const altText = formData.get("altText") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    if (isSupabaseConfigured() && propertyId) {
      const result = await uploadPropertyImage(file, propertyId);
      if (result) {
        return NextResponse.json({ url: result.url, path: result.path, altText: altText || file.name });
      }
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
    }

    const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "properties");
    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const url = `/uploads/properties/${filename}`;
    return NextResponse.json({ url, filename, altText: altText || file.name });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
