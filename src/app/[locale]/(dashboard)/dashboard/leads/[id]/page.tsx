import { notFound } from "next/navigation";
import { ArrowRight, Mail, Phone, Building2, Calendar, Tag, Globe } from "lucide-react";
import { PageHeader } from "@/shared/components/shared/page-header";
import { Badge } from "@/shared/components/ui/badge";
import { getLeadById } from "@/modules/lead/actions";
import { StatusUpdateForm } from "./status-update-form";
import { NotesEditForm } from "./notes-edit-form";
import { getTranslations, setRequestLocale } from "next-intl/server";

const STATUS_CLASSES: Record<string, string> = {
  NEW: "bg-primary/10 text-primary border-transparent",
  CONTACTED: "bg-warning/10 text-warning border-transparent",
  INTERESTED: "bg-success/10 text-success border-transparent",
  NEGOTIATION: "bg-accent/10 text-accent-dark border-transparent",
  CONVERTED: "bg-success text-white border-transparent",
  LOST: "bg-surface-secondary text-text-tertiary border-transparent",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");
  const tNav = await getTranslations("nav");
  const tLeadStatus = await getTranslations("leadStatus");
  const tLeadSource = await getTranslations("leadSource");
  const tCommon = await getTranslations("common");

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
        description={t("leadDetailDesc")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/dashboard" },
          { label: tNav("leads"), href: "/dashboard/leads" },
          { label: lead.name },
        ]}
        action={
          <a
            href="/dashboard/leads"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            {t("leadBackToList")}
          </a>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">{t("leadContactInfo")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-surface-secondary p-2">
                  <Mail className="h-4 w-4 text-text-tertiary" />
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t("leadEmail")}</p>
                  <p className="text-sm text-text-primary">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-surface-secondary p-2">
                  <Phone className="h-4 w-4 text-text-tertiary" />
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t("leadPhone")}</p>
                  <p className="text-sm text-text-primary">{lead.phone || t("leadNotSpecified")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-surface-secondary p-2">
                  <Globe className="h-4 w-4 text-text-tertiary" />
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t("leadSource")}</p>
                  <p className="text-sm text-text-primary">{tLeadSource(lead.source)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-surface-secondary p-2">
                  <Calendar className="h-4 w-4 text-text-tertiary" />
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t("leadCreatedAt")}</p>
                  <p className="text-sm text-text-primary">
                    {new Date(lead.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "ar-DZ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {lead.message && (
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">{t("leadMessage")}</h2>
              <p className="text-sm text-text-secondary whitespace-pre-wrap">{lead.message}</p>
            </div>
          )}

          {lead.property && (
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">{t("leadRelatedProperty")}</h2>
              <a
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
                      <span>{lead.property.area} {t("leadAreaUnit")}</span>
                      {lead.property.bedrooms && (
                        <>
                          <span>|</span>
                          <span>{lead.property.bedrooms} {t("leadBedrooms")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          )}

          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">{t("leadNotes")}</h2>
            <NotesEditForm leadId={lead.id} notes={lead.notes} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">{t("leadStatus")}</h2>
            <StatusUpdateForm leadId={lead.id} currentStatus={lead.status} />
          </div>

          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">{t("leadAdditionalInfo")}</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">{t("leadStatus")}</span>
                <Badge className={STATUS_CLASSES[lead.status]}>
                  {tLeadStatus(lead.status)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">{t("leadSource")}</span>
                <Badge variant="secondary">{tLeadSource(lead.source)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-tertiary">{t("leadLastUpdate")}</span>
                <span className="text-sm text-text-primary">
                  {new Date(lead.updatedAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "ar-DZ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
