import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail, Phone, Building2, Calendar, Tag, Globe } from "lucide-react";
import { PageHeader } from "@/shared/components/shared/page-header";
import { Badge } from "@/shared/components/ui/badge";
import { getLeadById } from "@/modules/lead/actions";
import { StatusUpdateForm } from "./status-update-form";
import { NotesEditForm } from "./notes-edit-form";

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

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getLeadById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const lead = result.data as {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string | null;
    status: string;
    source: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    property: {
      id: string;
      title: string;
      address: string;
      city: string;
      price: number;
      currency: string;
      propertyType: string;
      bedrooms: number | null;
      bathrooms: number | null;
      area: number;
    } | null;
  };

  return (
    <div>
      <PageHeader
        title={lead.name}
        description="تفاصيل العميل المحتمل"
        breadcrumbs={[
          { label: "لوحة التحكم", href: "/dashboard" },
          { label: "العملاء المحتملون", href: "/dashboard/leads" },
          { label: lead.name },
        ]}
        action={
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للقائمة
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">معلومات الاتصال</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-surface-secondary p-2">
                  <Mail className="h-4 w-4 text-text-tertiary" />
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">البريد الإلكتروني</p>
                  <p className="text-sm text-text-primary">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-surface-secondary p-2">
                  <Phone className="h-4 w-4 text-text-tertiary" />
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">الهاتف</p>
                  <p className="text-sm text-text-primary">{lead.phone || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-surface-secondary p-2">
                  <Globe className="h-4 w-4 text-text-tertiary" />
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">المصدر</p>
                  <p className="text-sm text-text-primary">{SOURCE_LABELS[lead.source]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-surface-secondary p-2">
                  <Calendar className="h-4 w-4 text-text-tertiary" />
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">تاريخ الإنشاء</p>
                  <p className="text-sm text-text-primary">
                    {new Date(lead.createdAt).toLocaleDateString("ar-DZ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {lead.message && (
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">الرسالة</h2>
              <p className="text-sm text-text-secondary whitespace-pre-wrap">{lead.message}</p>
            </div>
          )}

          {lead.property && (
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">العقار المرتبط</h2>
              <Link
                href={`/dashboard/properties/${lead.property.id}`}
                className="block rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-surface-secondary p-3">
                    <Building2 className="h-5 w-5 text-text-tertiary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-text-primary hover:text-primary transition-colors">
                      {lead.property.title}
                    </h3>
                    <p className="text-xs text-text-tertiary mt-1">
                      {lead.property.address}, {lead.property.city}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                      <span>{lead.property.price.toLocaleString()} {lead.property.currency}</span>
                      <span>|</span>
                      <span>{lead.property.area} م²</span>
                      {lead.property.bedrooms && (
                        <>
                          <span>|</span>
                          <span>{lead.property.bedrooms} غرف</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">الملاحظات</h2>
            <NotesEditForm leadId={lead.id} notes={lead.notes} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">الحالة</h2>
            <StatusUpdateForm leadId={lead.id} currentStatus={lead.status} />
          </div>

          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">معلومات إضافية</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">الحالة</span>
                <Badge className={STATUS_CLASSES[lead.status]}>
                  {STATUS_LABELS[lead.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">المصدر</span>
                <Badge variant="secondary">{SOURCE_LABELS[lead.source]}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">آخر تحديث</span>
                <span className="text-sm text-text-primary">
                  {new Date(lead.updatedAt).toLocaleDateString("ar-DZ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
