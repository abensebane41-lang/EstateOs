import { Building2, Plus, Bed, MapPin, Eye } from "lucide-react";
import { PageHeader } from "@/shared/components/shared/page-header";
import { EmptyState } from "@/shared/components/shared/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { getProperties } from "@/modules/property/actions";
import { formatCurrency } from "@/shared/lib/utils";

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: "شقة",
  VILLA: "فيلا",
  HOUSE: "منزل أرضي",
  LAND: "أرض",
  OFFICE: "مكتب",
  COMMERCIAL: "محل تجاري",
  WAREHOUSE: "مستودع",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "مسودة",
  PUBLISHED: "منشور",
};

const STATUS_VARIANT: Record<string, "outline" | "success" | "accent" | "secondary"> = {
  DRAFT: "outline",
  PUBLISHED: "success",
};

const TABS = [
  { label: "الكل", value: "ALL" },
  { label: "منشور", value: "PUBLISHED" },
  { label: "مسودة", value: "DRAFT" },
];

const LISTING_TYPE_LABELS: Record<string, string> = {
  SALE: "للبيع",
  RENT: "للإيجار",
};

interface PropertiesPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const status = params?.status || "ALL";
  const search = params?.search || "";
  const page = Number(params?.page) || 1;

  const result = await getProperties({
    status: status !== "ALL" ? status : undefined,
    search: search || undefined,
    page,
    limit: 10,
  });

  interface PropertyRow {
    id: string;
    title: string;
    slug: string;
    propertyType: string;
    listingType: string;
    status: string;
    price: number;
    currency: string;
    bedrooms: number | null;
    area: number;
    address: string;
    city: string;
    state: string | null;
    viewCount: number;
    images: { url: string }[];
  }
  const data = result.success ? (result.data as { properties: PropertyRow[]; total: number; totalPages: number }) : null;
  const properties: PropertyRow[] = data?.properties ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  return (
    <div>
      <PageHeader
        title="العقارات"
        description={`إدارة عقاراتك المنشورة والمسودات${total > 0 ? ` — ${total} عقار` : ""}`}
        action={
          <a href="/dashboard/properties/new">
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة عقار
            </Button>
          </a>
        }
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const isActive = status === tab.value || (tab.value === "ALL" && status === "ALL");
            const href =
              tab.value === "ALL"
                ? "/dashboard/properties"
                : `/dashboard/properties?status=${tab.value}`;
            return (
              <a
                key={tab.value}
                href={href}
                className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-white text-text-secondary border border-border hover:bg-surface-secondary"
                }`}
              >
                {tab.label}
              </a>
            );
          })}
        </div>

        <form action="/dashboard/properties" method="get" className="flex gap-2">
          {status !== "ALL" && <input type="hidden" name="status" value={status} />}
          <input
            type="text"
            name="search"
            placeholder="بحث في العقارات..."
            defaultValue={search}
            className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 sm:w-64"
          />
          <Button type="submit" variant="outline" size="sm">
            بحث
          </Button>
        </form>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl border border-border bg-white">
          <EmptyState
            icon={Building2}
            title="لا توجد عقارات"
            description={search ? "لم يتم العثور على نتائج مطابقة لبحثك" : "ابدأ بإضافة عقاراتك لتظهر هنا"}
            action={
              !search ? (
                <a href="/dashboard/properties/new">
                  <Button>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة أول عقار
                  </Button>
                </a>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary">
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
                      العقار
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
                      السعر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
                      الموقع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
                      التفاصيل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
                      المشاهدات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-surface-secondary transition-colors">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-secondary">
                            <Building2 className="h-5 w-5 text-text-tertiary" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{property.title}</p>
                            <p className="text-xs text-text-tertiary">
                              {PROPERTY_TYPE_LABELS[property.propertyType] || property.propertyType}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge variant={STATUS_VARIANT[property.status] || "outline"}>
                          {STATUS_LABELS[property.status] || property.status}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-semibold text-accent">
                          {formatCurrency(property.price, property.currency)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-text-secondary">
                          <MapPin className="h-3 w-3" />
                          {property.city}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                          {property.bedrooms !== null && property.bedrooms !== undefined && (
                            <span className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />
                              {property.bedrooms}
                            </span>
                          )}
                          <span>{property.area} م²</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                          <Eye className="h-3.5 w-3.5" />
                          {property.viewCount}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <a
                          href={`/dashboard/properties/${property.id}`}
                          className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-light transition-colors"
                        >
                          تعديل
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {page > 1 && (
                <a
                  href={`/dashboard/properties?page=${page - 1}${status !== "ALL" ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                  className="inline-flex items-center rounded-lg border border-border bg-white px-4 py-2 text-sm text-text-secondary hover:bg-surface-secondary transition-colors"
                >
                  السابق
                </a>
              )}
              <span className="px-4 py-2 text-sm text-text-secondary">
                صفحة {page} من {totalPages}
              </span>
              {page < totalPages && (
                <a
                  href={`/dashboard/properties?page=${page + 1}${status !== "ALL" ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                  className="inline-flex items-center rounded-lg border border-border bg-white px-4 py-2 text-sm text-text-secondary hover:bg-surface-secondary transition-colors"
                >
                  التالي
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
