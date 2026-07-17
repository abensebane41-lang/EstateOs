import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Building2, Bed, Maximize, Eye } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/shared/lib/utils";
import { parseFilters, filterProperties } from "@/shared/lib/property-filters";
import { FilterBar } from "@/shared/components/shared/filter-bar";
import { Pagination } from "@/shared/components/shared/pagination";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: "شقة",
  VILLA: "فيلا",
  HOUSE: "منزل أرضي",
  LAND: "أرض",
  OFFICE: "مكتب",
  COMMERCIAL: "محل تجاري",
  WAREHOUSE: "مستودع",
  STUDIO: "ستوديو",
};

const LISTING_LABELS: Record<string, string> = {
  SALE: "للبيع",
  RENT: "للإيجار",
};

const DEFAULT_HERO = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const agency = await prisma.agency.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!agency) return {};
  return {
    title: agency.name,
    description: agency.description || `عقارات ${agency.name} المتاحة للبيع والإيجار`,
  };
}

export default async function AgencyLandingPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const agency = await prisma.agency.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      phone: true,
      email: true,
      address: true,
      logoUrl: true,
    },
  });

  if (!agency) notFound();

  const filters = parseFilters(sp, agency.id);
  const { properties, pagination } = await filterProperties(filters);

  const [stats, featuredProperty] = await Promise.all([
    prisma.property.aggregate({
      where: { agencyId: agency.id, status: "PUBLISHED" },
      _count: true,
    }),
    prisma.property.findFirst({
      where: { agencyId: agency.id, status: "PUBLISHED" },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      orderBy: { isFeatured: "desc" },
    }),
  ]);

  const heroImage = featuredProperty?.images[0]?.url || DEFAULT_HERO;

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <Image
          src={heroImage}
          alt={agency.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="hero-overlay absolute inset-0" />

        {/* Agency Logo & Name */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            {agency.logoUrl ? (
              agency.logoUrl.startsWith("data:") ? (
                <img
                  src={agency.logoUrl}
                  alt={agency.name}
                  className="mx-auto h-24 w-24 rounded-2xl object-cover border-2 border-white/20 shadow-xl mb-6"
                />
              ) : (
                <Image
                  src={agency.logoUrl}
                  alt={agency.name}
                  width={96}
                  height={96}
                  priority
                  className="mx-auto h-24 w-24 rounded-2xl object-cover border-2 border-white/20 shadow-xl mb-6"
                />
              )
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-4xl font-bold text-white shadow-xl mb-6">
                {agency.name.charAt(0)}
              </div>
            )}
            <h1 className="font-[family-name:var(--font-public-heading)] text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide mb-4 no-break">
              {agency.name}
            </h1>
            {agency.description && (
              <p dir="ltr" className="text-lg md:text-xl text-white/80 leading-relaxed" style={{ maxWidth: "42rem", marginInline: "auto", textAlign: "center" }}>
                {agency.description}
              </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="gold-line w-12" />
              <Building2 className="h-5 w-5 text-accent" />
              <div className="gold-line w-12" />
            </div>
            <p className="mt-4 text-white/60 text-sm">
              {stats._count} عقار متاح
            </p>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
              {agency.phone && (
                <a href={`tel:${agency.phone}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Phone className="h-4 w-4" />
                  {agency.phone}
                </a>
              )}
              {agency.email && (
                <a href={`mailto:${agency.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Mail className="h-4 w-4" />
                  {agency.email}
                </a>
              )}
              {agency.address && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {agency.address}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-[family-name:var(--font-public-heading)] text-2xl md:text-3xl font-semibold text-text-primary mb-3">
            العقارات المتاحة
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gold-line w-16" />
            <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            <div className="gold-line w-16" />
          </div>
          <p className="text-text-secondary">
            اختر من بين مجموعة متنوعة من العقارات الفاخرة
          </p>
        </div>

        <FilterBar totalResults={pagination.total} />

        {properties.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-secondary">
              <Building2 className="h-10 w-10 text-text-tertiary" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">لم نعثر على عقارات بهذه المواصفات</h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">جرّب توسيع نطاق البحث أو تغيير معايير الفلترة</p>
            <Link href={`/agency/${slug}`}>
              <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent/5">
                إعادة ضبط الفلاتر
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => {
                const primaryImage = property.images[0];
                return (
                  <Link
                    key={property.id}
                    href={`/agency/${slug}/properties/${property.slug}`}
                    className="group luxury-card overflow-hidden rounded-2xl border border-border/50 bg-white shadow-luxury"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {primaryImage ? (
                        primaryImage.url.startsWith("data:") ? (
                          <img
                            src={primaryImage.url}
                            alt={primaryImage.altText || property.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <Image
                            src={primaryImage.url}
                            alt={primaryImage.altText || property.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-surface-secondary text-text-tertiary">
                          <MapPin className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute right-4 top-4 flex gap-2">
                        <Badge variant={property.listingType === "RENT" ? "accent" : "success"}>
                          {LISTING_LABELS[property.listingType] || property.listingType}
                        </Badge>
                        {property.isFeatured && (
                          <Badge variant="warning">مميز</Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-text-primary line-clamp-1 group-hover:text-primary transition-colors mb-2 no-break">
                        {property.title}
                      </h3>
                      <p className="text-sm text-text-secondary flex items-center gap-1.5 mb-3">
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                        {property.city}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5" />
                          {TYPE_LABELS[property.propertyType]}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Maximize className="h-3.5 w-3.5" />
                          {property.area} م²
                        </span>
                        {property.bedrooms !== null && property.bedrooms !== undefined && (
                          <span className="flex items-center gap-1.5">
                            <Bed className="h-3.5 w-3.5" />
                            {property.bedrooms}
                          </span>
                        )}
                      </div>
                      <div className="border-t border-border/50 pt-4 flex items-center justify-between">
                        <p className="text-xl font-bold text-accent">{formatCurrency(property.price)}</p>
                        <span className="flex items-center gap-1 text-xs text-text-tertiary">
                          <Eye className="h-3.5 w-3.5" />
                          {property.viewCount}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  baseUrl={`/agency/${slug}`}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
