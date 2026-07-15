import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const authHeader = req.headers.get("x-seed-key");
  if (authHeader !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { auth } = await import("@/modules/auth/auth");
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "email and password required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({ where: { email }, data: { role: "SUPER_ADMIN" } });
    return NextResponse.json({ message: "User updated to SUPER_ADMIN" });
  }

  const result = await auth.api.signUpEmail({
    body: { name: name || "مدير النظام", email, password },
  });

  await prisma.user.update({
    where: { id: result.user.id },
    data: { role: "SUPER_ADMIN", emailVerified: true },
  });

  return NextResponse.json({ message: "Super Admin created" });
}
