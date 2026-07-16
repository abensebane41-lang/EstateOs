import { NextResponse } from "next/server";
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

const UNSPLASH_IMAGES = [
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

const titles = [
  "Appartement moderne", "Villa avec piscine", "Maison familiale", "Terrain constructible",
  "Bureau moderne", "Local commercial", "Studio étudiant", "Duplex luxueux",
  "Penthouse vue panoramique", "Maison de ville", "Immeuble résidentiel", "Entrepôt moderne",
  "Appartement F3 rénové", "Villa avec jardin", "Maison plain pied", "Terrain agricole",
  "Boutique centre-ville", "Hangar industriel", "Studio meublé", "Loft spacieux",
];

const descriptions = [
  "Bel appartement lumineux avec vue panoramique sur la ville. Entièrement rénové avec des matériaux de qualité.",
  "Magnifique villa avec piscine et jardin paysager. Idéale pour les familles cherchant le confort et le luxe.",
  "Maison spacieuse idéale pour famille nombreuse. Grand jardin arboré et garage double.",
  "Grand terrain viabilisé idéal pour projet résidentiel ou commercial. Superficie 500m².",
  "Espace de bureau moderne et fonctionnel au centre des affaires. Climatisé, parking disponible.",
  "Local commercial en pleine activité. Situé sur une artère principale à forte fréquentation.",
  "Studio parfait pour étudiant ou jeune professionnel. Meublé et entièrement équipé.",
  "Duplex haut de gamme avec finitions soignées. Terrasse privée avec vue exceptionnelle.",
  "Penthouse avec terrasse panoramique. Prestations haut de gamme, vue mer dégagée.",
  "Maison de ville charmante au centre historique. Pierre apparente, charme authentique.",
  "Immeuble résidentiel 8 appartements à fort potentiel locatif. Bon rendement.",
  "Entrepôt moderne 200m² avec accès poids lourd. Idéal logistique.",
  "Appartement F3 rénové avec goût. Parquet massif, moulures, cuisine équipée.",
  "Villa avec grand jardin 800m² et dépendances. piscine chauffée.",
  "Maison plain pied 120m² sur terrain spacious 300m². Triple exposition.",
  "Terrain agricole 2000m² avec source d'eau. Idéal maraîchage.",
  "Boutique idéalement située en centre-ville. Vitrine grande largeur.",
  "Hangar industriel 350m^ avec grue intégrée et bureau attenant.",
  "Studio meublé entièrement équipé. Idéal investissement locatif.",
  "Loft spacieux 180m² avec mezzanine. Lumière naturelle zénithale.",
];

function getImagesForProperty(propIndex: number) {
  const images = [];
  const count = propIndex % 3 === 0 ? 3 : propIndex % 2 === 0 ? 2 : 1;
  for (let j = 0; j < count; j++) {
    const imgIndex = (propIndex * 3 + j) % UNSPLASH_IMAGES.length;
    images.push({
      url: UNSPLASH_IMAGES[imgIndex],
      altText: titles[propIndex % titles.length],
      sortOrder: j,
      isPrimary: j === 0,
    });
  }
  return images;
}

export async function GET() {
  try {
    await prisma.propertyFavorite.deleteMany();
    await prisma.propertyImage.deleteMany();
    await prisma.property.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.analyticsEvent.deleteMany();
    await prisma.agencyNotification.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verification.deleteMany();
    await prisma.agency.deleteMany();

    const { auth } = await import("@/modules/auth/auth");

    const createdAgencies = [];
    let totalProperties = 0;

    for (let i = 0; i < agencies.length; i++) {
      const agencyData = agencies[i];

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
      const result = await auth.api.signUpEmail({
        body: { name: `${agencyData.name} Owner`, email, password: "test123456" },
      });
      await prisma.user.update({
        where: { id: result.user.id },
        data: { agencyId: agency.id, role: "AGENCY_OWNER", emailVerified: true },
      });

      for (let j = 0; j < 20; j++) {
        const typeIndex = j % 6;
        const listingIndex = j % 2;
        const propertyTypes = ["APARTMENT", "VILLA", "HOUSE", "LAND", "COMMERCIAL", "WAREHOUSE"];
        const listingTypes = ["SALE", "RENT"];
        const propType = propertyTypes[typeIndex];
        const listingType = listingTypes[listingIndex];

        const basePrice = listingType === "RENT"
          ? 20000 + j * 30000
          : 3000000 + j * 3000000;
        const bedrooms = (propType === "LAND" || propType === "COMMERCIAL" || propType === "WAREHOUSE")
          ? null
          : 1 + (j % 5);
        const area = propType === "LAND"
          ? 200 + j * 150
          : propType === "WAREHOUSE"
            ? 150 + j * 50
            : 30 + j * 15;
        const slug = `${titles[j % titles.length].toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${agency.slug}-${j}`;

        const property = await prisma.property.create({
          data: {
            agencyId: agency.id,
            title: `${titles[j % titles.length]} ${cities[i]}`,
            slug,
            description: descriptions[j % descriptions.length],
            propertyType: propType,
            listingType,
            status: "PUBLISHED",
            price: basePrice,
            currency: "DZD",
            bedrooms,
            bathrooms: bedrooms ? Math.max(1, Math.floor(bedrooms / 2)) : null,
            floor: propType === "APARTMENT" ? (j % 10) + 1 : null,
            area,
            furnished: j % 3 === 0,
            parking: j % 2 === 0,
            balcony: j % 2 === 0,
            address: `${10 + j} Rue ${titles[j % titles.length]}, ${cities[i]}`,
            city: cities[i],
            state: states[i],
            isFeatured: j % 5 === 0,
          },
        });

        const images = getImagesForProperty(j);
        for (const img of images) {
          await prisma.propertyImage.create({
            data: { ...img, propertyId: property.id },
          });
        }

        totalProperties++;
      }

      createdAgencies.push(agency.slug);
    }

    const adminExists = await prisma.user.findUnique({ where: { email: "abensebane41@gmail.com" } });
    if (!adminExists) {
      const { auth } = await import("@/modules/auth/auth");
      const adminResult = await auth.api.signUpEmail({
        body: { name: "مدير النظام", email: "abensebane41@gmail.com", password: "Kader@2026!Secure" },
      });
      await prisma.user.update({
        where: { id: adminResult.user.id },
        data: { role: "SUPER_ADMIN", emailVerified: true },
      });
    }

    return NextResponse.json({
      message: "Seed completed!",
      agencies: agencies.length,
      properties: totalProperties,
      images: totalProperties * 2,
      superAdmin: { email: "abensebane41@gmail.com", password: "Kader@2026!Secure" },
      testAccounts: agencies.map((a, i) => ({
        agency: a.name,
        email: `owner${i + 1}@test.com`,
        password: "test123456",
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
