export const revalidate = 3600; // ISR: revalidate every hour

import { prisma } from "@/shared/lib/prisma";
import { Building2, MapPin, Bed, Search } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import { FavoriteButton } from "@/shared/components/shared/favorite-button";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: "شقة",
  VILLA: "فيلا",
  HOUSE: "منزل أرضي",
  LAND: "أرض",
  OFFICE: "مكتب",
  COMMERCIAL: "محل تجاري",
  WAREHOUSE: "مستودع",
};

interface Props {
  searchParams: Promise<{ city?: string; type?: string; minPrice?: string; maxPrice?: string }>;
}

export const metadata = {
  title: "العقارات المتاحة | EstateOS",
  description: "تصفح أفضل العقارات المتاحة حالياً. شقق، فلل، مكاتب تجارية وأراضي.",
};

export default async function PublicPropertiesPage({ searchParams }: Props) {
  const params = await searchParams;

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (params.city) where.city = params.city;
  if (params.type) where.propertyType = params.type;

  const [properties, cities] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { images: { where: { isPrimary: true }, take: 1 }, agency: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.findMany({
      where: { status: "PUBLISHED" },
      select: { city: true },
      distinct: ["city"],
    }),
  ]);

  const user = await getCurrentUser();

  let favoritedIds = new Set<string>();
  if (user) {
    const favChecks = await Promise.all(
      properties.map((p) =>
        prisma.propertyFavorite.findUnique({
          where: { userId_propertyId: { userId: user.id, propertyId: p.id } },
          select: { propertyId: true },
        })
      )
    );
    favChecks.forEach((f) => { if (f) favoritedIds.add(f.propertyId); });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">العقارات المتاحة</h1>
        <p className="text-text-secondary">تصفح أفضل العقارات المتاحة حالياً</p>
      </div>

      <form className="mb-8 flex flex-wrap gap-4 rounded-xl border border-border bg-white p-4">
        <div className="flex-1 min-w-[200px]">
          <select name="type" defaultValue={params.type || ""} className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">كل الأنواع</option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <select name="city" defaultValue={params.city || ""} className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">كل المدن</option>
            {cities.map((c) => (
              <option key={c.city} value={c.city}>{c.city}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-light transition-colors">
          <Search className="ml-2 h-4 w-4" />
          بحث
        </button>
      </form>

      {properties.length === 0 ? (
        <div className="py-20 text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-text-tertiary" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">لا توجد عقارات حالياً</h3>
          <p className="text-text-secondary">سيظهر هنا العقارات المنشورة قريباً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.slug}`}
              className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-[4/3] bg-surface-secondary overflow-hidden">
                {property.images[0] ? (
                  <img
                    src={property.images[0].url}
                    alt={property.images[0].altText || property.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-text-tertiary">
                    <Building2 className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute right-3 top-3">
                  <Badge variant="accent">{TYPE_LABELS[property.propertyType] || property.propertyType}</Badge>
                </div>
                {user && (
                  <div className="absolute left-3 top-3">
                    <FavoriteButton
                      propertyId={property.id}
                      userId={user.id}
                      initialFavorited={favoritedIds.has(property.id)}
                    />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="mb-1 font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                  {property.title}
                </h3>
                <p className="mb-3 flex items-center gap-1 text-sm text-text-secondary">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {property.city}، {property.address}
                </p>
                <div className="mb-3 flex items-center gap-4 text-xs text-text-secondary">
                  {property.bedrooms ? (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {property.bedrooms} غرف
                    </span>
                  ) : null}
                  <span>{property.area} م²</span>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-lg font-bold text-accent">
                    {new Intl.NumberFormat("ar-DZ", { style: "currency", currency: "DZD", minimumFractionDigits: 0 }).format(property.price)}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">{property.agency.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
