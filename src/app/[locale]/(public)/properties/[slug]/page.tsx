export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { Building2, MapPin, Bed, Maximize, Phone, Mail, MessageSquare, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Link } from "@/i18n/client";
import { ContactForm } from "./contact-form";
import { FavoriteButton } from "@/shared/components/shared/favorite-button";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { isFavorited } from "@/modules/property/favorite-actions";
import { decodeSlug } from "@/shared/lib/utils";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

const TYPE_KEYS: Record<string, string> = {
  APARTMENT: "APARTMENT",
  VILLA: "VILLA",
  HOUSE: "HOUSE",
  LAND: "LAND",
  OFFICE: "OFFICE",
  COMMERCIAL: "COMMERCIAL",
  WAREHOUSE: "WAREHOUSE",
};

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const property = await prisma.property.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, description: true, city: true, price: true },
  });
  if (!property) return { title: "عقار غير موجود" };
  return {
    title: `${property.title} | EstateOS`,
    description: property.description.slice(0, 160),
    openGraph: { title: property.title, description: property.description.slice(0, 160) },
  };
}

export default async function PublicPropertyDetailPage({ params }: Props) {
  const { locale, slug: rawSlug } = await params;
  setRequestLocale(locale);
  const slug = decodeSlug(rawSlug);

  const property = await prisma.property.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      agency: true,
    },
  });

  if (!property) notFound();

  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

  const user = await getCurrentUser();
  let favorited = false;
  if (user) {
    const favResult = await isFavorited(property.id);
    favorited = favResult.success ? favResult.data.favorited : false;
  }

  const t = await getTranslations("property");
  const tNav = await getTranslations("nav");
  const tPropertyTypes = await getTranslations("propertyTypes");

  const TYPE_LABELS: Record<string, string> = Object.fromEntries(
    Object.entries(TYPE_KEYS).map(([key, tKey]) => [key, tPropertyTypes(tKey)])
  );
  const STATUS_LABELS: Record<string, string> = {
    PUBLISHED: t("published"),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-primary transition-colors">{tNav("homePage")}</Link>
        <ChevronLeft className="h-3 w-3" />
        <Link href="/properties" className="hover:text-primary transition-colors">{tNav("properties")}</Link>
        <ChevronLeft className="h-3 w-3" />
        <span className="text-text-primary">{property.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            {primaryImage ? (
              <div className="relative aspect-[16/10]">
                <img src={primaryImage.url} alt={primaryImage.altText || property.title} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-surface-secondary">
                <Building2 className="h-20 w-20 text-text-tertiary" />
              </div>
            )}
            {property.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {property.images.map((img) => (
                  <div key={img.id} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
                    <img src={img.url} alt={img.altText || ""} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="accent">{TYPE_LABELS[property.propertyType]}</Badge>
                  <Badge variant="success">{STATUS_LABELS[property.status]}</Badge>
                </div>
                <h1 className="text-2xl font-bold text-text-primary">{property.title}</h1>
              </div>
              <div className="flex items-center gap-3">
                {user && (
                  <FavoriteButton
                    propertyId={property.id}
                    initialFavorited={favorited}
                  />
                )}
                <p className="text-2xl font-bold text-accent">
                  {new Intl.NumberFormat("ar-DZ", { style: "currency", currency: "DZD", minimumFractionDigits: 0 }).format(property.price)}
                </p>
              </div>
            </div>

            <p className="mb-4 flex items-center gap-2 text-text-secondary">
              <MapPin className="h-4 w-4 shrink-0" />
              {property.address}، {property.city}{property.state ? `، ${property.state}` : ""}
            </p>

            <div className="mb-6 flex flex-wrap gap-6 border-b border-border pb-6">
              {property.bedrooms ? (
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-text-tertiary" />
                  <span className="text-sm">{property.bedrooms} {t("bedroomsCount")}</span>
                </div>
              ) : null}
              <div className="flex items-center gap-2">
                <Maximize className="h-5 w-5 text-text-tertiary" />
                <span className="text-sm">{property.area} م²</span>
              </div>
              {property.listingType && (
                <Badge variant="outline">{property.listingType === "SALE" ? t("sale") : t("rent")}</Badge>
              )}
            </div>

            <h2 className="mb-3 text-lg font-semibold text-text-primary">{t("description")}</h2>
            <p className="leading-relaxed text-text-secondary whitespace-pre-line" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>{property.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 sticky top-24">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">{t("contactInfo")}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{property.agency.name}</p>
                  <p className="text-xs text-text-secondary">{t("realEstateAgency")}</p>
                </div>
              </div>
              {property.agency.phone && (
                <a href={`tel:${property.agency.phone}`} className="flex items-center gap-3 rounded-lg p-3 hover:bg-surface-secondary transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-sm text-text-primary" dir="ltr">{property.agency.phone}</span>
                </a>
              )}
              {property.agency.email && (
                <a href={`mailto:${property.agency.email}`} className="flex items-center gap-3 rounded-lg p-3 hover:bg-surface-secondary transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-sm text-text-primary">{property.agency.email}</span>
                </a>
              )}
              <a
                href={`https://wa.me/${property.agency.phone?.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-success px-4 py-3 text-sm font-medium text-white hover:bg-success-light transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                {t("contactViaWhatsApp")}
              </a>
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="mb-4 text-sm font-semibold text-text-primary">{t("sendDirectMessage")}</h4>
              <ContactForm
                agencyId={property.agencyId}
                propertyId={property.id}
                propertyName={property.title}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/properties" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          {t("backToProperties")}
        </Link>
      </div>
    </div>
  );
}
