import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-seed-secret");
  if (authHeader !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { auth } = await import("@/modules/auth/auth");

    const existingAdmin = await prisma.user.findUnique({
      where: { email: "abensebane41@gmail.com" },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists", email: "abensebane41@gmail.com" });
    }

    const adminResult = await auth.api.signUpEmail({
      body: { name: "مدير النظام", email: "abensebane41@gmail.com", password: "Kader@2026!Secure" },
    });

    await prisma.user.update({
      where: { id: adminResult.user.id },
      data: { role: "SUPER_ADMIN", emailVerified: true },
    });

    const demoAgency = await prisma.agency.create({
      data: {
        name: "Kadikou Imobilier",
        slug: "kadikouimobilier",
        phone: "+213 555 123 456",
        email: "contact@kadikouimobilier.com",
        address: "Alger, Algeria",
        description: "Agence immobilière de premier plan à Alger",
      },
    });

    await prisma.subscription.create({
      data: {
        agencyId: demoAgency.id,
        status: "ACTIVE",
        planName: "Professional",
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });

    const ownerResult = await auth.api.signUpEmail({
      body: { name: "Propriétaire", email: "owner@demo.com", password: "demo123456" },
    });

    await prisma.user.update({
      where: { id: ownerResult.user.id },
      data: { agencyId: demoAgency.id, role: "AGENCY_OWNER", emailVerified: true },
    });

    const properties = [
      { title: "Appartement moderne Alger Centre", slug: "appartement-moderne-alger-centre", description: "Bel appartement au centre d'Alger", propertyType: "APARTMENT", listingType: "SALE", status: "ACTIVE", price: 15000000, bedrooms: 3, area: 120, address: "Rue Didouche Mourad, Alger", city: "Alger", state: "Alger" },
      { title: "Villa luxueuse Hydra", slug: "villa-luxueuse-hydra", description: "Magnifique villa avec piscine à Hydra", propertyType: "VILLA", listingType: "SALE", status: "ACTIVE", price: 45000000, bedrooms: 5, area: 350, address: "Hydra, Alger", city: "Alger", state: "Alger", isFeatured: true },
      { title: "Bureau moderne Bab Ezzouar", slug: "bureau-moderne-bab-ezzouar", description: "Espace de bureau idéal pour entreprises", propertyType: "COMMERCIAL", listingType: "RENT", status: "ACTIVE", price: 800000, area: 200, address: "Bab Ezzouar, Alger", city: "Bab Ezzouar", state: "Alger" },
      { title: "Appartement familial Oran", slug: "appartement-familial-oran", description: "Appartement spacieux pour famille", propertyType: "APARTMENT", listingType: "SALE", status: "ACTIVE", price: 8000000, bedrooms: 4, area: 150, address: "Rue Ahmed Bey, Oran", city: "Oran", state: "Oran" },
      { title: "Studio étudiant Constantine", slug: "studio-etudiant-constantine", description: "Studio pratique près de l'université", propertyType: "APARTMENT", listingType: "RENT", status: "ACTIVE", price: 200000, bedrooms: 1, area: 45, address: "Université, Constantine", city: "Constantine", state: "Constantine" },
      { title: "Terrain constructible Tizi Ouzou", slug: "terrain-constructible-tizi-ouzou", description: "Grand terrain avec vue sur la montagne", propertyType: "LAND", listingType: "SALE", status: "ACTIVE", price: 5000000, area: 800, address: "Tizi Ouzou Centre", city: "Tizi Ouzou", state: "Tizi Ouzou" },
    ];

    for (const prop of properties) {
      await prisma.property.create({
        data: { ...prop, agencyId: demoAgency.id, currency: "DZD" },
      });
    }

    return NextResponse.json({ message: "Seed completed", admin: "admin@estateos.dz", agency: "kadikouimobilier", properties: properties.length });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
  }
}
