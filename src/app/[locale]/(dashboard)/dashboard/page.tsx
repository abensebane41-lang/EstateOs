import { Building2, Users, Eye, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { StatCard } from "@/shared/components/shared/stat-card";
import { PageHeader } from "@/shared/components/shared/page-header";
import { EmptyState } from "@/shared/components/shared/empty-state";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const tNav = await getTranslations("nav");
  const tPropertyTypes = await getTranslations("propertyTypes");
  const tLeadStatus = await getTranslations("leadStatus");
  const tCommon = await getTranslations("common");
  const tProperty = await getTranslations("property");
  const user = await getCurrentUser();

  if (!user?.agencyId) {
    return (
      <div>
        <PageHeader
          title={tNav("dashboard")}
          description={t("welcome")}
        />
        <EmptyState
          icon={Building2}
          title={t("noAgencyAssigned")}
          description={t("contactSupport")}
        />
      </div>
    );
  }

  const agencyId = user.agencyId;

  const [totalProperties, publishedProperties, totalLeads, convertedLeads, totalViews, recentLeads, featuredProperties] =
    await Promise.all([
      prisma.property.count({ where: { agencyId } }),
      prisma.property.count({ where: { agencyId, status: "PUBLISHED" } }),
      prisma.lead.count({ where: { agencyId } }),
      prisma.lead.count({ where: { agencyId, status: "CONVERTED" } }),
      prisma.property.aggregate({ where: { agencyId }, _sum: { viewCount: true } }),
      prisma.lead.findMany({
        where: { agencyId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { property: { select: { title: true } } },
      }),
      prisma.property.findMany({
        where: { agencyId, status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { images: { where: { isPrimary: true }, take: 1 } },
      }),
    ]);

  const totalViewCount = totalViews._sum.viewCount ?? 0;

  if (totalProperties === 0) {
    return (
      <div>
        <PageHeader
          title={tNav("dashboard")}
          description={t("welcome")}
        />
        <EmptyState
          icon={Building2}
          title={t("startByAdding")}
          description={t("startByAddingDesc")}
          action={
            <a
              href="/dashboard/properties/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-light transition-colors"
            >
              {t("addProperty")}
            </a>
          }
        />
      </div>
    );
  }

  const leadStatusMap: Record<string, string> = {
    NEW: tLeadStatus("NEW"),
    CONTACTED: tLeadStatus("CONTACTED"),
    INTERESTED: tLeadStatus("INTERESTED"),
    NEGOTIATION: tLeadStatus("NEGOTIATION"),
    CONVERTED: tLeadStatus("CONVERTED"),
    LOST: tLeadStatus("LOST"),
  };

  const propertyTypeMap: Record<string, string> = {
    APARTMENT: tPropertyTypes("APARTMENT"),
    VILLA: tPropertyTypes("VILLA"),
    HOUSE: tPropertyTypes("HOUSE"),
    OFFICE: tPropertyTypes("OFFICE"),
    LAND: tPropertyTypes("LAND"),
    COMMERCIAL: tPropertyTypes("COMMERCIAL"),
    WAREHOUSE: tPropertyTypes("WAREHOUSE"),
  };

  return (
    <div>
      <PageHeader
        title={tNav("dashboard")}
        description={t("welcome")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title={t("totalProperties")}
          value={totalProperties}
          icon={Building2}
          change={`${publishedProperties} ${t("publishedProperties")}`}
          changeType="positive"
        />
        <StatCard
          title={t("totalLeads")}
          value={totalLeads}
          icon={Users}
          change={`${convertedLeads} ${t("convertedLeads")}`}
          changeType="positive"
        />
        <StatCard
          title={t("totalViews")}
          value={totalViewCount.toLocaleString("ar-DZ")}
          icon={Eye}
          change={t("totalViewsDesc")}
          changeType="neutral"
        />
        <StatCard
          title={t("convertedLeads")}
          value={convertedLeads}
          icon={TrendingUp}
          change={totalLeads > 0 ? `${Math.round((convertedLeads / totalLeads) * 100)}% ${t("conversionRate")}` : t("noData")}
          changeType={convertedLeads > 0 ? "positive" : "neutral"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">{t("recentLeads")}</h2>
          <div className="rounded-xl border border-border bg-white shadow-sm divide-y divide-border">
            {recentLeads.length === 0 ? (
              <div className="p-6 text-center text-sm text-text-secondary">{t("noLeadsYetDashboard")}</div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{lead.name}</p>
                    <p className="text-xs text-text-secondary truncate">{lead.property?.title ?? t("withoutProperty")}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-surface-secondary text-text-secondary whitespace-nowrap">
                    {leadStatusMap[lead.status] ?? lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">{t("featuredProperties")}</h2>
          <div className="rounded-xl border border-border bg-white shadow-sm divide-y divide-border">
            {featuredProperties.length === 0 ? (
              <div className="p-6 text-center text-sm text-text-secondary">{t("noFeaturedYet")}</div>
            ) : (
              featuredProperties.map((property) => (
                <div key={property.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{property.title}</p>
                    <p className="text-xs text-text-secondary">
                      {propertyTypeMap[property.propertyType] ?? property.propertyType} — {property.city}
                    </p>
                  </div>
                  <div className="text-left ml-4">
                    <p className="text-sm font-semibold text-text-primary">{property.price.toLocaleString("ar-DZ")} {tCommon("sar")}</p>
                    <p className="text-xs text-text-secondary">{property.viewCount} {tProperty("views")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
