import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  try {
    const { auth } = await import("@/modules/auth/auth");

    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@estateos.dz" },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" });
    }

    const result = await auth.api.signUpEmail({
      body: { name: "مدير النظام", email: "admin@estateos.dz", password: "admin123456" },
    });

    await prisma.user.update({
      where: { id: result.user.id },
      data: { role: "SUPER_ADMIN", emailVerified: true },
    });

    return NextResponse.json({ message: "Super Admin created", email: "admin@estateos.dz" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
