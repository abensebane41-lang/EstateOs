import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, ChevronRight, Bed, Maximize, Bath, Car, Square, Eye, MessageCircle } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { formatCurrency, decodeSlug } from "@/shared/lib/utils";
import { PropertyViewTracker } from "@/shared/components/shared/property-view-tracker";
import { ContactTracker } from "@/shared/components/shared/contact-tracker";
import { ImageGallery } from "@/shared/components/shared/image-gallery";
import Image from "next/image";
import { Play } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WILAYAS } from "@/shared/data/algeria";

export const dynamic = "force-dynamic";

const TYPE_KEYS: Record<string, string> = {
  APARTMENT: "APARTMENT",
  VILLA: "VILLA",
  HOUSE: "HOUSE",
  LAND: "LAND",
  OFFICE: "OFFICE",
  COMMERCIAL: "COMMERCIAL",
  WAREHOUSE: "WAREHOUSE",
};

const LISTING_KEYS: Record<string, string> = {
  SALE: "sale",
  RENT: "rent",
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
  params: Promise<{ locale: string; slug: string; propertySlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug: rawSlug, propertySlug: rawPropSlug } = await params;
  const slug = decodeSlug(rawSlug);
  const propertySlug = decodeSlug(rawPropSlug);
  const agency = await prisma.agency.findUnique({ where: { slug }, select: { id: true } });
  if (!agency) return {};
  const property = await prisma.property.findFirst({
    where: { slug: propertySlug, agencyId: agency.id, status: "PUBLISHED" },
    select: { title: true, description: true, city: true },
  });
  if (!property) return {};
  return {
    title: `${property.title} | ${property.city}`,
    description: property.description.slice(0, 160),
  };
}

export default async function AgencyPropertyDetailPage({ params }: Props) {
  const { locale, slug: rawSlug, propertySlug: rawPropSlug } = await params;
  setRequestLocale(locale);
  const slug = decodeSlug(rawSlug);
  const propertySlug = decodeSlug(rawPropSlug);

  const agency = await prisma.agency.findUnique({
    where: { slug },
    select: { id: true, name: true, phone: true, email: true, logoUrl: true },
  });

  if (!agency) notFound();

  if (!propertySlug) notFound();

  const property = await prisma.property.findFirst({
    where: { slug: propertySlug, agencyId: agency.id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!property || property.status !== "PUBLISHED") notFound();

  const t = await getTranslations("property");
  const tPropertyTypes = await getTranslations("propertyTypes");
  const tCommon = await getTranslations("common");

  const wilayaDisplayName = property.state
    ? (locale === "fr" ? WILAYAS.find(w => w.name === property.state)?.nameFr : WILAYAS.find(w => w.name === property.state)?.name) || property.state
    : "";

  const TYPE_LABELS: Record<string, string> = Object.fromEntries(
    Object.entries(TYPE_KEYS).map(([key, tKey]) => [key, tPropertyTypes(tKey)])
  );
  const LISTING_LABELS: Record<string, string> = Object.fromEntries(
    Object.entries(LISTING_KEYS).map(([key, tKey]) => [key, t(tKey)])
  );

  const contactPhone = property.agentPhone || agency.phone;
  const whatsappUrl = contactPhone ? `https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}` : null;

  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];

  return (
    <div className="min-h-screen bg-surface">
      <PropertyViewTracker propertyId={property.id} agencyId={agency.id} />

      {/* Hero Image */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
        {primaryImage ? (
          <>
            {primaryImage.url.startsWith("data:") ? (
              <img src={primaryImage.url} alt={primaryImage.altText || property.title} className="h-full w-full object-cover" />
            ) : (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || property.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}
            <div className="hero-overlay absolute inset-0" />
          </>
        ) : (
          <div className="absolute inset-0 bg-primary" />
        )}

        {/* Floating Title */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={property.listingType === "RENT" ? "accent" : "success"} className="text-sm px-4 py-1.5">
                {LISTING_LABELS[property.listingType]}
              </Badge>
              {property.isFeatured && (
                <Badge variant="warning" className="text-sm px-4 py-1.5">{t("featured")}</Badge>
              )}
              {property.images.length > 1 && (
                <Badge variant="default" className="text-sm px-4 py-1.5 bg-black/40 backdrop-blur-sm text-white border-white/20">
                  📷 {property.images.length} {t("images")}
                </Badge>
              )}
            </div>
            <h1 className="font-[family-name:var(--font-public-heading)] text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 no-break">
              {property.title}
            </h1>
            <p className="text-white/80 flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-accent" />
              {property.address}{t("addressSeparator")} {property.city}{wilayaDisplayName ? `${t("addressSeparator")} ${wilayaDisplayName}` : ""}
            </p>
          </div>
        </div>

        {/* Back Link */}
        <a
          href={`/agency/${slug}`}
          className="absolute top-6 right-6 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
          {t("back")}
        </a>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price Banner */}
            <div className="rounded-2xl bg-gradient-to-l from-primary to-primary-light p-6 text-white">
              <p className="text-sm text-white/70 mb-1">{t("price")}</p>
              <p className="text-3xl font-bold">{formatCurrency(property.price, locale)}</p>
            </div>

            {/* Gallery */}
            {property.images.length > 0 && (
              <ImageGallery
                images={property.images.map((img) => ({
                  url: img.url,
                  altText: img.altText,
                }))}
              />
            )}

            {/* Video */}
            {"videoUrl" in property && (property as { videoUrl: string | null }).videoUrl && (
              <VideoSection url={(property as { videoUrl: string }).videoUrl} videoTitle={t("propertyVideo")} watchVideo={t("watchVideo")} />
            )}

            {/* Description */}
            <div className="rounded-2xl border border-border/50 bg-white p-8 shadow-luxury">
              <h2 className="font-[family-name:var(--font-public-heading)] text-xl font-semibold text-text-primary mb-5 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-accent" />
                {t("description")}
              </h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line text-base" style={{ overflowWrap: "break-word", wordBreak: "break-word" }}>{property.description}</p>
            </div>

            {/* Details Grid */}
            <div className="rounded-2xl border border-border/50 bg-white p-8 shadow-luxury">
              <h2 className="font-[family-name:var(--font-public-heading)] text-xl font-semibold text-text-primary mb-5 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-accent" />
                {t("details")}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-surface-secondary p-4 text-center border border-border/30">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Square className="h-5 w-5 text-accent" />
                  </div>
                  <p className="text-xs text-text-tertiary mb-1">{t("type")}</p>
                  <p className="font-medium text-text-primary">{TYPE_LABELS[property.propertyType]}</p>
                </div>
                <div className="rounded-xl bg-surface-secondary p-4 text-center border border-border/30">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Maximize className="h-5 w-5 text-accent" />
                  </div>
                  <p className="text-xs text-text-tertiary mb-1">{t("area")}</p>
                  <p className="font-medium text-text-primary">{property.area} {tCommon("areaUnit")}</p>
                </div>
                {property.bedrooms !== null && property.bedrooms !== undefined && property.bedrooms > 0 && (
                  <div className="rounded-xl bg-surface-secondary p-4 text-center border border-border/30">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Bed className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-xs text-text-tertiary mb-1">{t("bedrooms")}</p>
                    <p className="font-medium text-text-primary">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms !== null && property.bathrooms !== undefined && property.bathrooms > 0 && (
                  <div className="rounded-xl bg-surface-secondary p-4 text-center border border-border/30">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Bath className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-xs text-text-tertiary mb-1">{t("bathrooms")}</p>
                    <p className="font-medium text-text-primary">{property.bathrooms}</p>
                  </div>
                )}
                <div className="rounded-xl bg-surface-secondary p-4 text-center border border-border/30">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <p className="text-xs text-text-tertiary mb-1">{t("location")}</p>
                  <p className="font-medium text-text-primary">{property.city}</p>
                </div>
                {property.parking && (
                  <div className="rounded-xl bg-surface-secondary p-4 text-center border border-border/30">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Car className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-xs text-text-tertiary mb-1">{t("parkingAvailable")}</p>
                    <p className="font-medium text-text-primary">{t("parkingAvailableValue")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/50 bg-white p-8 shadow-luxury sticky top-6">
              <h2 className="font-[family-name:var(--font-public-heading)] text-lg font-semibold text-text-primary mb-5 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-accent" />
                {t("agentInfo")}
              </h2>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                {agency.logoUrl ? (
                  agency.logoUrl.startsWith("data:") ? (
                    <img src={agency.logoUrl} alt={agency.name} className="h-14 w-14 rounded-xl object-cover border border-border/30" />
                  ) : (
                    <Image src={agency.logoUrl} alt={agency.name} width={56} height={56} className="h-14 w-14 rounded-xl object-cover border border-border/30" />
                  )
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    {agency.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-text-primary text-lg">{agency.name}</p>
                  <p className="text-sm text-text-secondary">{t("realEstateAgent")}</p>
                </div>
              </div>

              {contactPhone && (
                <ContactTracker
                  agencyId={agency.id}
                  propertyId={property.id}
                  method="PHONE"
                  href={`tel:${contactPhone}`}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-l from-primary to-primary-light py-3.5 text-sm font-medium text-white hover:from-primary-light hover:to-primary transition-all duration-300 mb-3 shadow-md"
                >
                  <Phone className="h-4 w-4" />
                  {t("callNow")}
                </ContactTracker>
              )}

              {whatsappUrl && (
                <ContactTracker
                  agencyId={agency.id}
                  propertyId={property.id}
                  method="FORM"
                  href={whatsappUrl}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-[#25D366]/30 py-3.5 text-sm font-medium text-[#25D366] hover:bg-[#25D366]/5 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("whatsapp")}
                </ContactTracker>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-secondary">
                <Eye className="h-4 w-4" />
                <span>{property.viewCount} {t("views")}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
