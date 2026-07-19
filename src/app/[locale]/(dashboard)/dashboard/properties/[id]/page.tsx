import { notFound, redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { PropertyForm } from "./property-form";
import { PropertyImagesSection } from "./property-images-section";
import { PageHeader } from "@/shared/components/shared/page-header";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");
  const tNav = await getTranslations("nav");

  const user = await getCurrentUser();
  if (!user?.agencyId) redirect("/login");

  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!property || property.agencyId !== user.agencyId) notFound();

  return (
    <div>
      <PageHeader
        title={property.title}
        description={`${property.city} — ${property.address}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/dashboard" },
          { label: tNav("properties"), href: "/dashboard/properties" },
          { label: property.title },
        ]}
      />

      <div className="space-y-8">
        <section className="rounded-xl border border-border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">{t("images")}</h3>
          <PropertyImagesSection propertyId={property.id} initialImages={JSON.parse(JSON.stringify(property.images))} />
        </section>

        <section className="rounded-xl border border-border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">{t("editProperty")}</h3>
          <PropertyForm property={JSON.parse(JSON.stringify(property))} mode="edit" />
        </section>
      </div>
    </div>
  );
}
