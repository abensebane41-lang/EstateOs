import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const agency = await prisma.agency.upsert({
    where: { slug: "demo-agency" },
    update: {},
    create: {
      id: "demo-agency-001",
      name: "وكالة الأمل العقارية",
      slug: "demo-agency",
      phone: "+213 555 123 456",
      email: "contact@al-amal.dz",
      address: "شارع الاستقلال، الجزائر العاصمة",
      description: "وكالة عقارية متخصصة في البيع والشراء والتأجير",
    },
  });

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  await prisma.subscription.upsert({
    where: { id: "sub-demo-001" },
    update: {},
    create: {
      id: "sub-demo-001",
      agencyId: agency.id,
      status: "TRIAL",
      startDate: new Date(),
      trialEndsAt,
    },
  });

  const properties = [
    {
      id: "prop-001",
      agencyId: agency.id,
      title: "شقة فاخرة في حي بن عكنون",
      slug: "apartment-ben-aknoun",
      description: "شقة فاخرة بغرفتين نوم وصالة كبيرة مع إطلالة رائعة على الحديقة. تحتوي على مطبخ مجهز بالكامل. موقع مميز قريب من جميع الخدمات.",
      propertyType: "APARTMENT",
      listingType: "SALE",
      status: "PUBLISHED",
      price: 8500000,
      bedrooms: 2,
      bathrooms: 1,
      floor: 3,
      area: 95,
      furnished: true,
      parking: false,
      balcony: true,
      address: "شارع الأمير عبد القادر، حي بن عكنون",
      city: "الجزائر",
      state: "الجزائر",
      isFeatured: true,
      viewCount: 234,
    },
    {
      id: "prop-002",
      agencyId: agency.id,
      title: "فيلا حديثة في زرالدة",
      slug: "villa-haditha-zeralda",
      description: "فيلا حديثة بتصميم عصري مع حديقة خاصة ومسبح. 4 غرف نوم رئيسية، صالة استقبال كبيرة، مطبخ أمريكي. تكييف مركزي وأمن 24/7.",
      propertyType: "VILLA",
      listingType: "SALE",
      status: "PUBLISHED",
      price: 25000000,
      bedrooms: 4,
      bathrooms: 3,
      floor: 0,
      area: 250,
      furnished: false,
      parking: true,
      balcony: true,
      address: "المنطقة السكنية الجديدة، زرالدة",
      city: "زرالدة",
      state: "المدية",
      isFeatured: true,
      viewCount: 567,
    },
    {
      id: "prop-003",
      agencyId: agency.id,
      title: "مكتب تجاري في وسط المدينة",
      slug: "office-centre-ville",
      description: "مكتب تجاري مجهز بالكامل في قلب المدينة. مناسب لوكالات الإعلان أو شركات البرمجيات. إنترنت فائق السرعة و Reception.",
      propertyType: "OFFICE",
      listingType: "RENT",
      status: "PUBLISHED",
      price: 1200000,
      area: 60,
      bathrooms: 1,
      floor: 5,
      furnished: true,
      parking: true,
      balcony: false,
      address: "شارع فرانتس فانون",
      city: "الجزائر",
      state: "الجزائر",
      isFeatured: false,
      viewCount: 89,
    },
    {
      id: "prop-004",
      agencyId: agency.id,
      title: "شقة استوديو في حي المرجان",
      slug: "studio-morjane",
      description: "شقة استوديو صغيرة ومريحة مناسبة لطبيب أو طالب. مطبخ صغير ودش مياه ساخنة.",
      propertyType: "STUDIO",
      listingType: "RENT",
      status: "PUBLISHED",
      price: 3000000,
      bedrooms: 0,
      bathrooms: 1,
      floor: 2,
      area: 45,
      furnished: true,
      parking: false,
      balcony: false,
      address: "المجمع السكني المرجان",
      city: "وهران",
      state: "وهران",
      isFeatured: false,
      viewCount: 45,
    },
    {
      id: "prop-005",
      agencyId: agency.id,
      title: "أرض بناء في باب الزوار",
      slug: "terrain-bab-zouar",
      description: "أرض بناء بمساحة كبيرة في منطقة هادئة. مناسبة لبناء فيلا أو مجمع سكني. جميع الضروريات متوفرة (ماء، كهرباء، غاز).",
      propertyType: "LAND",
      listingType: "SALE",
      status: "PUBLISHED",
      price: 6000000,
      area: 500,
      address: "حي 500 مسكن، باب الزوار",
      city: "الجزائر",
      state: "الجزائر",
      isFeatured: false,
      viewCount: 145,
    },
    {
      id: "prop-006",
      agencyId: agency.id,
      title: "منزل أرضي تقليدي في القالة",
      slug: "maison-traditionnelle-ghala",
      description: "منزل أرضي تقليدي جميل بأجواء أصيلة في مدينة القالة. مناسب لعشاق الطبيعة والهدوء.",
      propertyType: "HOUSE",
      listingType: "SALE",
      status: "PUBLISHED",
      price: 4500000,
      bedrooms: 3,
      bathrooms: 2,
      floor: 0,
      area: 180,
      furnished: false,
      parking: true,
      balcony: false,
      address: "وسط المدينة",
      city: "القالة",
      state: "تمنراست",
      isFeatured: false,
      viewCount: 312,
    },
  ];

  for (const prop of properties) {
    await prisma.property.upsert({
      where: { id: prop.id },
      update: {},
      create: prop,
    });
  }

  const leads = [
    {
      id: "lead-001",
      agencyId: agency.id,
      propertyId: "prop-001",
      name: "أحمد بن محمد",
      email: "ahmed@email.com",
      phone: "+213 661 234 567",
      message: "مرحبا، أنا مهتم بالشقة في بن عكنون. هل يمكنني زيارتها هذا الأسبوع؟",
      status: "INTERESTED",
      source: "WEBSITE",
    },
    {
      id: "lead-002",
      agencyId: agency.id,
      propertyId: "prop-002",
      name: "فاطمة الزهراء",
      email: "fatima@email.com",
      phone: "+213 555 876 543",
      message: "الفيلا في زرالدة تبدو رائعة. هل يمكن ترتيب موعد؟",
      status: "CONTACTED",
      source: "PHONE",
    },
    {
      id: "lead-003",
      agencyId: agency.id,
      propertyId: "prop-005",
      name: "يوسف بن عمر",
      email: "youssef@email.com",
      phone: "+213 770 111 222",
      message: "أريد معرفة المزيد عن الأرض في باب الزوار",
      status: "NEW",
      source: "EMAIL",
    },
    {
      id: "lead-004",
      agencyId: agency.id,
      propertyId: "prop-003",
      name: "سارة بنت علي",
      email: "sara@email.com",
      phone: "+213 550 333 444",
      message: "أبحث عن مكتب لشركتي الناشئة",
      status: "NEGOTIATION",
      source: "SOCIAL_MEDIA",
    },
    {
      id: "lead-005",
      agencyId: agency.id,
      propertyId: "prop-001",
      name: "كريم بن سلوبط",
      email: "karim@email.com",
      phone: "+213 660 555 666",
      message: "السعر قابل للتفاوض؟",
      status: "CONVERTED",
      source: "REFERRAL",
    },
    {
      id: "lead-006",
      agencyId: agency.id,
      propertyId: "prop-006",
      name: "نادية بن يوسف",
      email: "nadia@email.com",
      phone: "+213 555 777 888",
      message: "هل المنزل لا يزال متاحاً؟",
      status: "LOST",
      source: "WALK_IN",
    },
  ];

  for (const lead of leads) {
    await prisma.lead.upsert({
      where: { id: lead.id },
      update: {},
      create: lead,
    });
  }

  console.log("Database seeded successfully!");
  console.log(`Agency: ${agency.name} (${agency.id})`);
  console.log(`Properties: ${properties.length}`);
  console.log(`Leads: ${leads.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
