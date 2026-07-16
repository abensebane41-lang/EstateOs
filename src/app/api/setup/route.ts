import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  try {
    const { auth } = await import("@/modules/auth/auth");

    const existingAdmin = await prisma.user.findUnique({
      where: { email: "abensebane41@gmail.com" },
    });

    if (existingAdmin) {
      await prisma.session.deleteMany({ where: { userId: existingAdmin.id } });
      await prisma.account.deleteMany({ where: { userId: existingAdmin.id } });
      await prisma.user.delete({ where: { id: existingAdmin.id } });
    }

    const result = await auth.api.signUpEmail({
      body: { name: "مدير النظام", email: "abensebane41@gmail.com", password: "admin123456" },
    });

    await prisma.user.update({
      where: { id: result.user.id },
      data: { role: "SUPER_ADMIN", emailVerified: true },
    });

    return NextResponse.json({ message: "Super Admin created", email: "abensebane41@gmail.com", password: "admin123456" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
