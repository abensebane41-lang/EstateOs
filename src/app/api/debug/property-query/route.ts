import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: NextRequest) {
  const agencySlug = req.nextUrl.searchParams.get("agency");
  const rawSlug = req.nextUrl.searchParams.get("slug");

  if (req.nextUrl.searchParams.has("test")) {
    const testSlug = "نسيو-بيها-برك";
    const agency = await prisma.agency.findUnique({
      where: { slug: "musimmobolier" },
      select: { id: true, name: true, slug: true, phone: true, email: true, logoUrl: true },
    });
    if (!agency) return NextResponse.json({ error: "agency not found" });

    const property = await prisma.property.findFirst({
      where: { slug: testSlug, agencyId: agency.id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json({
      testSlug,
      testSlugBytes: Array.from(Buffer.from(testSlug, "utf-8")),
      found: !!property,
      propertyId: property?.id,
      propertySlug: property?.slug,
      slugBytes: property ? Array.from(Buffer.from(property.slug, "utf-8")) : null,
      match: property ? property.slug === testSlug : null,
      imagesCount: property?.images?.length,
      status: property?.status,
    });
  }

  if (!agencySlug || !rawSlug) {
    return NextResponse.json({ error: "Missing ?agency= and ?slug=" }, { status: 400 });
  }

  let decodedSlug = rawSlug;
  try { decodedSlug = decodeURIComponent(rawSlug); } catch {}

  const agency = await prisma.agency.findUnique({
    where: { slug: agencySlug },
    select: { id: true, name: true, slug: true },
  });
  if (!agency) return NextResponse.json({ error: "Agency not found", agencySlug });

  const allBySlug = await prisma.property.findMany({
    where: { slug: decodedSlug },
    select: { id: true, slug: true, agencyId: true, status: true, title: true },
  });

  const byCompound = await prisma.property.findUnique({
    where: { agencyId_slug: { agencyId: agency.id, slug: decodedSlug } },
    select: { id: true, slug: true, agencyId: true, status: true, title: true },
  });

  const byFindFirst = await prisma.property.findFirst({
    where: { slug: decodedSlug, agencyId: agency.id },
    select: { id: true, slug: true, agencyId: true, status: true, title: true },
  });

  const allAgencyProps = await prisma.property.findMany({
    where: { agencyId: agency.id },
    select: { id: true, slug: true, status: true, title: true },
    take: 10,
  });

  return NextResponse.json({
    rawSlug,
    decodedSlug,
    rawSlugBytes: Array.from(Buffer.from(rawSlug, "utf-8")),
    decodedSlugBytes: Array.from(Buffer.from(decodedSlug, "utf-8")),
    agency,
    allBySlug,
    byCompound,
    byFindFirst,
    allAgencyProps,
  });
}
