import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

const agencies = [
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

const states = ["Alger", "Oran", "Constantine", "Annaba", "Batna", "Tlemcen", "Tizi Ouzou", "Sétif", "Ghardaia", "Bechar"];
const cities = ["Alger Centre", "Oran Centre", "Constantine Centre", "Annaba Centre", "Batna Centre", "Tlemcen Centre", "Tizi Ouzou Centre", "Sétif Centre", "Ghardaia Centre", "Bechar Centre"];

function generateProperties(agencyIndex: number) {
  const propertyTypes = ["APARTMENT", "VILLA", "HOUSE", "LAND", "COMMERCIAL", "WAREHOUSE"];
  const listingTypes = ["SALE", "RENT"];
  const titles = [
    "Appartement moderne", "Villa avec piscine", "Maison familiale", "Terrain constructible",
    "Bureau moderne", "Local commercial", "Studio étudiant", "Duplex luxueux",
    "Penthouse vue mer", "Maison de ville", "Immeuble résidentiel", "Entrepôt moderne",
    "Appartement F3", "Villa jardin", "Maison plain pied", "Terrain agricole",
    "Boutique centre-ville", "Hangar industriel", "Studio meublé", "Loft moderne",
  ];
  const descriptions = [
    "Bel appartement lumineux avec vue panoramique sur la ville",
    "Magnifique villa avec piscine et jardin paysager",
    "Maison spacieuse idéale pour famille nombreuse",
    "Grand terrain idéal pour projet résidentiel ou commercial",
    "Espace de bureau moderne et fonctionnel",
    "Local commercial en pleine activité commerciale",
    "Studio parfait pour étudiant ou jeune professionnel",
    "Duplex haut de gamme avec finitions soignées",
    "Penthouse avec terrasse panoramique mer",
    "Maison de ville charmante au centre historique",
    "Immeuble résidentiel à fort potentiel locatif",
    "Entrepôt moderne avec accès poids lourd",
    "Appartement F3 rénové avec goût",
    "Villa avec grand jardin et dépendances",
    "Maison plain pied sur terrain spacious",
    "Terrain viabilisé avec vue montagne",
    "Boutique idéalement située en centre-ville",
    "Hangar industriel avec grue",
    "Studio meublé et entièrement équipé",
    "Loft spacieux avec mezzanine",
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const typeIndex = i % propertyTypes.length;
    const listingIndex = i % listingTypes.length;
    const propType = propertyTypes[typeIndex];
    const listingType = listingTypes[listingIndex];
    const stateIndex = agencyIndex;
    const basePrice = listingType === "RENT" ? 200000 + (i * 50000) : 3000000 + (i * 2000000);
    const bedrooms = propType === "LAND" ? null : (propType === "COMMERCIAL" || propType === "WAREHOUSE" ? null : 1 + (i % 5));
    const area = propType === "LAND" ? 200 + (i * 100) : propType === "WAREHOUSE" ? 150 + (i * 50) : 30 + (i * 10);
    const slug = `${titles[i].toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${agencyIndex}-${i}`;

    return {
      agencyId: "", // will be set
      title: `${titles[i]} ${cities[stateIndex]}`,
      slug,
      description: descriptions[i],
      propertyType: propType,
      listingType,
      status: "ACTIVE",
      price: basePrice,
      currency: "DZD",
      bedrooms,
      bathrooms: bedrooms ? Math.max(1, Math.floor(bedrooms / 2)) : null,
      floor: propType === "APARTMENT" ? (i % 10) + 1 : null,
      area,
      furnished: i % 3 === 0,
      parking: i % 2 === 0,
      balcony: i % 2 === 0,
      address: `${10 + i} Rue ${titles[i]}, ${cities[stateIndex]}`,
      city: cities[stateIndex],
      state: states[stateIndex],
      isFeatured: i % 5 === 0,
    };
  });
}

export async function GET() {
  try {
    const { auth } = await import("@/modules/auth/auth");

    const createdAgencies = [];
    let totalProperties = 0;

    for (let i = 0; i < agencies.length; i++) {
      const agencyData = agencies[i];

      const existingAgency = await prisma.agency.findUnique({ where: { slug: agencyData.slug } });
      if (existingAgency) {
        createdAgencies.push(existingAgency.slug);
        continue;
      }

      const agency = await prisma.agency.create({ data: agencyData });

      await prisma.subscription.create({
        data: {
          agencyId: agency.id,
          status: "ACTIVE",
          planName: "Professional",
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });

      const email = `owner${i + 1}@test.com`;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (!existingUser) {
        const result = await auth.api.signUpEmail({
          body: { name: `${agencyData.name} Owner`, email, password: "test123456" },
        });
        await prisma.user.update({
          where: { id: result.user.id },
          data: { agencyId: agency.id, role: "AGENCY_OWNER", emailVerified: true },
        });
      }

      const properties = generateProperties(i);
      for (const prop of properties) {
        await prisma.property.create({
          data: { ...prop, agencyId: agency.id },
        });
        totalProperties++;
      }

      createdAgencies.push(agency.slug);
    }

    return NextResponse.json({
      message: "Seed completed!",
      agencies: agencies.length,
      properties: totalProperties,
      login: {
        email: "abensebane41@gmail.com",
        password: "Kader@2026!Secure",
        note: "This is the Super Admin account",
      },
      testAccounts: agencies.map((a, i) => ({
        agency: a.name,
        email: `owner${i + 1}@test.com`,
        password: "test123456",
        url: `https://estate-os-beryl.vercel.app/agency/${a.slug}`,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
