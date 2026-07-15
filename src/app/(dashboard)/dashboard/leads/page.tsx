import { Users, Search, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/shared/components/shared/page-header";
import { EmptyState } from "@/shared/components/shared/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { getLeads, updateLeadStatus } from "@/modules/lead/actions";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { SearchInput } from "./search-input";
import { StatusFilter } from "./status-filter";
import { QuickStatusUpdate } from "./quick-status-update";

const STATUS_LABELS: Record<string, string> = {
  NEW: "جديد",
  CONTACTED: "تم التواصل",
  INTERESTED: "مهتم",
  NEGOTIATION: "تفاوض",
  CONVERTED: "تم التحويل",
  LOST: "مفقود",
};

const STATUS_CLASSES: Record<string, string> = {
  NEW: "bg-primary/10 text-primary border-transparent",
  CONTACTED: "bg-warning/10 text-warning border-transparent",
  INTERESTED: "bg-success/10 text-success border-transparent",
  NEGOTIATION: "bg-accent/10 text-accent-dark border-transparent",
  CONVERTED: "bg-success text-white border-transparent",
  LOST: "bg-surface-secondary text-text-tertiary border-transparent",
};

const SOURCE_LABELS: Record<string, string> = {
  WEBSITE: "الموقع",
  PHONE: "هاتف",
  EMAIL: "بريد إلكتروني",
  SOCIAL_MEDIA: "وسائل التواصل",
  REFERRAL: "إحالة",
  WALK_IN: "زيارة مباشرة",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user?.agencyId) {
    return (
      <div>
        <PageHeader title="العملاء المحتملون" description="تتبع طلبات العملاء وحالاتهم" />
        <p className="text-center text-text-secondary py-8">لا تملك صلاحية</p>
      </div>
    );
  }

  const params = await searchParams;
  const status = params.status ?? "ALL";
  const search = params.search ?? "";
  const page = Number(params.page) ?? 1;

  const result = await getLeads({
    status,
    search,
    page,
    limit: 10,
  });

  if (!result.success) {
    return (
      <div>
        <PageHeader
          title="العملاء المحتملون"
          description="تتبع طلبات العملاء وحالاتهم"
        />
        <EmptyState
          icon={Users}
          title="حدث خطأ"
          description="لم نتمكن من جلب العملاء المحتملين"
        />
      </div>
    );
  }

  const { leads, total, totalPages } = result.data as {
    leads: Array<{
      id: string;
      name: string;
      email: string;
      phone: string | null;
      status: string;
      source: string;
      createdAt: Date;
      property: { id: string; title: string; city: string } | null;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  return (
    <div>
      <PageHeader
        title="العملاء المحتملون"
        description="تتبع طلبات العملاء وحالاتهم"
      />

      <div className="mb-6">
        <StatusFilter currentStatus={status} />
      </div>

      <div className="mb-6">
        <SearchInput currentSearch={search} />
      </div>

      {leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="لا يوجد عملاء محتملون"
          description="لم يتم العثور على عملاء محتملين يطابقون معايير البحث"
        />
      ) : (
        <>
          <div className="rounded-lg border border-border bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary">
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      الاسم
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      البريد الإلكتروني
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      الهاتف
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      العقار
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      المصدر
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-surface-secondary/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/leads/${lead.id}`}
                          className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
                        >
                          {lead.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {lead.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {lead.phone || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {lead.property ? (
                          <Link
                            href={`/dashboard/properties/${lead.property.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {lead.property.title}
                          </Link>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={STATUS_CLASSES[lead.status]}>
                          {STATUS_LABELS[lead.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {SOURCE_LABELS[lead.source]}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {new Date(lead.createdAt).toLocaleDateString("ar-DZ")}
                      </td>
                      <td className="px-4 py-3">
                        <QuickStatusUpdate leadId={lead.id} currentStatus={lead.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-text-secondary">
                عرض {(page - 1) * 10 + 1} - {Math.min(page * 10, total)} من {total}
              </p>
              <div className="flex items-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/dashboard/leads?status=${status}&search=${search}&page=${page - 1}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                    السابق
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/dashboard/leads?status=${status}&search=${search}&page=${page + 1}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-text-primary hover:bg-surface-secondary transition-colors"
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
