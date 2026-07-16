import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found", email });
    }

    return NextResponse.json({ 
      message: "User found", 
      email: user.email, 
      role: user.role,
      hasPassword: user.password.length > 0,
      passwordLength: user.password.length,
      passwordPrefix: user.password.substring(0, 10) + "..."
    });
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
