import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadLogo, isSupabaseConfigured } from "@/shared/lib/storage";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.agencyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 2MB)" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const result = await uploadLogo(file, user.agencyId);
      if (result) {
        return NextResponse.json({ url: result.url });
      }
    }

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
    }

    const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "logos");
    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const url = `/uploads/logos/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Logo upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
