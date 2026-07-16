import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

const AGENCY_DATA = [
  { name: "Kadikou Imobilier", slug: "kadikouimobilier", phone: "+213 555 100 001", email: "contact@kadikouimobilier.com", address: "Rue Didouche Mourad, Alger Centre", description: "Agence immobilière de premier plan à Alger" },
  { name: "Casa Realty", slug: "casarealty", phone: "+213 555 100 002", email: "info@casarealty.com", address: "Boulevard Khemisti, Oran", description: "Spécialiste de l'immobilier résidentiel à Oran" },
  { name: "Atlas Propriétés", slug: "atlasproprietes", phone: "+213 555 100 003", email: "contact@atlasproprietes.com", address: "Rue Ahmed Bey, Constantine", description: "Votre partenaire immobilier à Constantine" },
  { name: "Sahel Habitation", slug: "sahelhabitation", phone: "+213 555 100 004", email: "info@sahelhabitation.com", address: "Boulevard Emir Abdelkader, Annaba", description: "Experts en immobilier côtier" },
  { name: "Tassili Immobilier", slug: "tassiliimmobilier", phone: "+213 555 100 005", email: "contact@tassiliimmobilier.com", address: "Rue du 1er Novembre, Batna", description: "Immobilier dans les Hauts Plateaux" },
  { name: "Mediterranée Home", slug: "mediterraneahome", phone: "+213 555 100 006", email: "info@mediterraneahome.com", address: "Boulevard Front de Mer, Tlemcen", description: "Maisons avec vue méditerranéenne" },
  { name: "Kabyle Properties", slug: "kabyleproperties", phone: "+213 555 100 007", email: "contact@kabyleproperties.com", address: "Rue de la République, Tizi Ouzou", description: "Immobilier en Kabylie" },
  { name: "Djazair Estates", slug: "djazairestates", phone: "+213 555 100 008", email: "info@djazairestates.com", address: "Boulevard Zighoud Youcef, Sétif", description: "Grandes propriétés à Sétif" },
  { name: "Sahara Luxe", slug: "saharaluxe", phone: "+213 555 100 009", email: "contact@saharaluxe.com", address: "Rue du Marché, Ghardaia", description: "Luxe désertique au sud" },
  { name: "Hoggar Immo", slug: "hoggarimmo", phone: "+213 555 100 010", email: "info@hoggarimmo.com", address: "Boulevard Emir Abdelkader, Bechar", description: "Immobilier dans le sud-ouest" },
];

const STATES = ["الجزائر", "وهران", "قسنطينة", "عنابة", "باتنة", "تلمسان", "تيزي وزو", "سطيف", "غرداية", "بشار"];
const CITIES = ["بئر مراد رايس", "السانية", "الخروب", "الحجار", "نقاوس", "نداروم", "أزفون", "العلمة", "المنيعة", "العبادلة"];

const IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7c5a38?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
  "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=800&q=80",
];

const TITLES = [
  "Appartement moderne", "Villa avec piscine", "Maison familiale", "Terrain constructible",
  "Bureau moderne", "Local commercial", "Studio étudiant", "Duplex luxueux",
  "Penthouse vue panoramique", "Maison de ville", "Immeuble résidentiel", "Entrepôt moderne",
  "Appartement F3 rénové", "Villa avec jardin", "Maison plain pied", "Terrain agricole",
  "Boutique centre-ville", "Hangar industriel", "Studio meublé", "Loft spacieux",
];

const DESCS = [
  "Bel appartement lumineux avec vue panoramique. Entièrement rénové.",
  "Magnifique villa avec piscine et jardin paysager.",
  "Maison spacieuse idéale pour famille nombreuse.",
  "Grand terrain viabilisé idéal pour projet résidentiel.",
  "Espace de bureau moderne au centre des affaires.",
  "Local commercial en pleine activité commerciale.",
  "Studio parfait pour étudiant ou jeune professionnel.",
  "Duplex haut de gamme avec finitions soignées.",
  "Penthouse avec terrasse panoramique vue mer.",
  "Maison de ville charmante au centre historique.",
  "Immeuble résidentiel à fort potentiel locatif.",
  "Entrepôt moderne 200m² avec accès poids lourd.",
  "Appartement F3 rénové avec goût. Parquet massif.",
  "Villa avec grand jardin 800m² et piscine chauffée.",
  "Maison plain pied 120m² sur terrain spacious.",
  "Terrain agricole 2000m² avec source d'eau.",
  "Boutique idéalement située en centre-ville.",
  "Hangar industriel 350m² avec grue intégrée.",
  "Studio meublé entièrement équipé.",
  "Loft spacieux 180m² avec mezzanine.",
];

const TYPES = ["APARTMENT", "VILLA", "HOUSE", "LAND", "COMMERCIAL", "WAREHOUSE"];

export async function GET() {
  try {
    await prisma.propertyFavorite.deleteMany();
    await prisma.propertyImage.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.analyticsEvent.deleteMany();
    await prisma.agencyNotification.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verification.deleteMany();
    await prisma.agency.deleteMany();

    const { auth } = await import("@/modules/auth/auth");

    const allAgencies = await prisma.agency.createMany({ data: AGENCY_DATA });
    const agencies = await prisma.agency.findMany();

    for (const agency of agencies) {
      const i = agencies.indexOf(agency);
      await prisma.subscription.create({
        data: { agencyId: agency.id, status: "ACTIVE", planName: "Professional", startDate: new Date(), endDate: new Date(Date.now() + 365 * 86400000) },
      });

      try {
        const result = await auth.api.signUpEmail({
          body: { name: `${agency.name} Owner`, email: `owner${i + 1}@test.com`, password: "test123456" },
        });
        await prisma.user.update({ where: { id: result.user.id }, data: { agencyId: agency.id, role: "AGENCY_OWNER", emailVerified: true } });
      } catch {}

      const props = Array.from({ length: 20 }, (_, j) => ({
        agencyId: agency.id,
        title: `${TITLES[j]} ${CITIES[i]}`,
        slug: `${TITLES[j].toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${agency.slug}-${j}`,
        description: DESCS[j],
        propertyType: TYPES[j % 6],
        listingType: j % 2 === 0 ? "SALE" : "RENT",
        status: "PUBLISHED",
        price: j % 2 === 0 ? 3000000 + j * 3000000 : 20000 + j * 30000,
        currency: "DZD",
        bedrooms: TYPES[j % 6] === "LAND" || TYPES[j % 6] === "COMMERCIAL" || TYPES[j % 6] === "WAREHOUSE" ? null : 1 + (j % 5),
        bathrooms: TYPES[j % 6] === "LAND" || TYPES[j % 6] === "COMMERCIAL" || TYPES[j % 6] === "WAREHOUSE" ? null : Math.max(1, Math.floor((1 + (j % 5)) / 2)),
        floor: TYPES[j % 6] === "APARTMENT" ? (j % 10) + 1 : null,
        area: TYPES[j % 6] === "LAND" ? 200 + j * 150 : TYPES[j % 6] === "WAREHOUSE" ? 150 + j * 50 : 30 + j * 15,
        furnished: j % 3 === 0,
        parking: j % 2 === 0,
        balcony: j % 2 === 0,
        address: `${10 + j} Rue ${TITLES[j]}, ${CITIES[i]}`,
        city: CITIES[i],
        state: STATES[i],
        isFeatured: j % 5 === 0,
      }));

      await prisma.property.createMany({ data: props });

      const createdProps = await prisma.property.findMany({ where: { agencyId: agency.id }, select: { id: true } });
      const images = createdProps.flatMap((p, idx) => [
        { propertyId: p.id, url: IMAGES[idx % IMAGES.length], altText: TITLES[idx % TITLES.length], sortOrder: 0, isPrimary: true },
        { propertyId: p.id, url: IMAGES[(idx + 1) % IMAGES.length], altText: TITLES[idx % TITLES.length], sortOrder: 1, isPrimary: false },
      ]);
      await prisma.propertyImage.createMany({ data: images });
    }

    const adminExists = await prisma.user.findUnique({ where: { email: "abensebane41@gmail.com" } });
    if (!adminExists) {
      const adminResult = await auth.api.signUpEmail({ body: { name: "مدير النظام", email: "abensebane41@gmail.com", password: "Kader@2026!Secure" } });
      await prisma.user.update({ where: { id: adminResult.user.id }, data: { role: "SUPER_ADMIN", emailVerified: true } });
    }

    return NextResponse.json({ message: "Seed done!", agencies: 10, properties: 200, images: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
