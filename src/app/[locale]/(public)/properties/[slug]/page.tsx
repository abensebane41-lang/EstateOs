export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { Building2, MapPin, Bed, Maximize, Phone, Mail, MessageSquare, ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Link } from "@/i18n/client";
import { ContactForm } from "./contact-form";
import { FavoriteButton } from "@/shared/components/shared/favorite-button";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { isFavorited } from "@/modules/property/favorite-actions";
import { decodeSlug, formatCurrency } from "@/shared/lib/utils";
import { WILAYAS } from "@/shared/data/algeria";
import { PropertyViewTracker } from "@/shared/components/shared/property-view-tracker";
import { ContactTracker } from "@/shared/components/shared/contact-tracker";
import { ImageGallery } from "@/shared/components/shared/image-gallery";
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

function VideoSection({ url, videoTitle, watchVideo }: { url: string; videoTitle: string; watchVideo: string }) {
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-8 shadow-luxury">
      <h2 className="font-[family-name:var(--font-public-heading)] text-xl font-semibold text-text-primary mb-5 flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-accent" />
        {videoTitle}
      </h2>
      {ytMatch ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            className="absolute inset-0 h-full w-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface-secondary p-4 hover:bg-surface-tertiary transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
            <Play className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-medium text-text-primary text-sm">{watchVideo}</p>
            <p className="text-xs text-text-tertiary truncate max-w-[250px]">{url}</p>
          </div>
        </a>
      )}
    </div>
  );
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const property = await prisma.property.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, description: true, city: true, price: true },
  });
  if (!property) {
    const t = await getTranslations({ locale, namespace: "property" });
    return { title: t("propertyNotFound") };
  }
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

  const user = await getCurrentUser();
  let favorited = false;
  if (user) {
    const favResult = await isFavorited(property.id);
    favorited = favResult.success ? favResult.data.favorited : false;
  }

  const t = await getTranslations("property");
  const tNav = await getTranslations("nav");
  const tPropertyTypes = await getTranslations("propertyTypes");
  const tCommon = await getTranslations("common");

  const wilayaDisplayName = property.state
    ? (locale === "fr" ? WILAYAS.find(w => w.name === property.state)?.nameFr : WILAYAS.find(w => w.name === property.state)?.name) || property.state
    : "";

  const TYPE_LABELS: Record<string, string> = Object.fromEntries(
    Object.entries(TYPE_KEYS).map(([key, tKey]) => [key, tPropertyTypes(tKey)])
  );
  const STATUS_LABELS: Record<string, string> = {
    PUBLISHED: t("published"),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyViewTracker propertyId={property.id} agencyId={property.agencyId} />

      <nav className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-primary transition-colors">{tNav("homePage")}</Link>
        <ChevronLeft className="h-3 w-3" />
        <Link href="/properties" className="hover:text-primary transition-colors">{tNav("properties")}</Link>
        <ChevronLeft className="h-3 w-3" />
        <span className="text-text-primary">{property.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {property.images.length > 0 && (
            <ImageGallery
              images={property.images.map((img) => ({
                url: img.url,
                altText: img.altText,
              }))}
            />
          )}

          {"videoUrl" in property && (property as { videoUrl: string | null }).videoUrl && (
            <VideoSection url={(property as { videoUrl: string }).videoUrl} videoTitle={t("propertyVideo")} watchVideo={t("watchVideo")} />
          )}

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
                  {formatCurrency(property.price, locale)}
                </p>
              </div>
            </div>

            <p className="mb-4 flex items-center gap-2 text-text-secondary">
              <MapPin className="h-4 w-4 shrink-0" />
              {property.address}{t("addressSeparator")} {property.city}{wilayaDisplayName ? `${t("addressSeparator")} ${wilayaDisplayName}` : ""}
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
                <span className="text-sm">{property.area} {tCommon("areaUnit")}</span>
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
                <ContactTracker
                  agencyId={property.agencyId}
                  propertyId={property.id}
                  method="PHONE"
                  href={`tel:${property.agency.phone}`}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-surface-secondary transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-sm text-text-primary" dir="ltr">{property.agency.phone}</span>
                </ContactTracker>
              )}
              {property.agency.email && (
                <a href={`mailto:${property.agency.email}`} className="flex items-center gap-3 rounded-lg p-3 hover:bg-surface-secondary transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-sm text-text-primary">{property.agency.email}</span>
                </a>
              )}
              <ContactTracker
                agencyId={property.agencyId}
                propertyId={property.id}
                method="FORM"
                href={property.agency.phone ? `https://wa.me/${property.agency.phone.replace(/[^0-9]/g, "")}` : undefined}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${property.agency.phone ? "bg-success text-white hover:bg-success-light" : "bg-surface-secondary text-text-tertiary cursor-not-allowed"}`}
              >
                <MessageSquare className="h-4 w-4" />
                {t("contactViaWhatsApp")}
              </ContactTracker>
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
