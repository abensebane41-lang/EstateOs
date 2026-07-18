import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.agency.count();
    const agencies = await prisma.agency.findMany({ take: 3, select: { id: true, name: true, slug: true } });
    const userCount = await prisma.user.count();
    const propCount = await prisma.property.count();
    const subCount = await prisma.subscription.count();
    return NextResponse.json({ count, agencies, userCount, propCount, subCount });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}
