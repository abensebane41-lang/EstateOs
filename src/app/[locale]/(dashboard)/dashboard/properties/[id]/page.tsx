import { notFound, redirect } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { PropertyForm } from "./property-form";
import { PropertyImagesSection } from "./property-images-section";
import { PageHeader } from "@/shared/components/shared/page-header";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;

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
          { label: "لوحة التحكم", href: "/dashboard" },
          { label: "العقارات", href: "/dashboard/properties" },
          { label: property.title },
        ]}
      />

      <div className="space-y-8">
        <section className="rounded-xl border border-border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">صور العقار</h3>
          <PropertyImagesSection propertyId={property.id} initialImages={JSON.parse(JSON.stringify(property.images))} />
        </section>

        <section className="rounded-xl border border-border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">تعديل البيانات</h3>
          <PropertyForm property={JSON.parse(JSON.stringify(property))} mode="edit" />
        </section>
      </div>
    </div>
  );
}
