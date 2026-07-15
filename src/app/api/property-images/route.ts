import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.agencyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const propertyId = request.nextUrl.searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "propertyId required" }, { status: 400 });
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { agencyId: true },
  });

  if (!property || property.agencyId !== user.agencyId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const images = await prisma.propertyImage.findMany({
    where: { propertyId },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ images });
}
