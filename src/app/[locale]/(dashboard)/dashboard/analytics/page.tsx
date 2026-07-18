import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/shared/page-header";
import { PropertyTypeChart } from "./property-type-chart";
import { LeadStatusChart } from "./lead-status-chart";
import { Building2, Users, Eye, TrendingUp, MousePointerClick, Target } from "lucide-react";
import { StatCard } from "@/shared/components/shared/stat-card";
import { getAgencyAnalyticsSummary } from "@/modules/analytics/actions";
import { formatCurrency } from "@/shared/lib/utils";

export default async function AnalyticsPage() {
  const t = await getTranslations("dashboard");
  const tPropertyTypes = await getTranslations("propertyTypes");
  const tLeadStatus = await getTranslations("leadStatus");
  const tProperty = await getTranslations("property");
  const tCommon = await getTranslations("common");

  const TYPE_LABELS: Record<string, string> = {
    APARTMENT: tPropertyTypes("APARTMENT"), VILLA: tPropertyTypes("VILLA"), HOUSE: tPropertyTypes("HOUSE"), LAND: tPropertyTypes("LAND"), OFFICE: tPropertyTypes("OFFICE"), COMMERCIAL: tPropertyTypes("COMMERCIAL"), WAREHOUSE: tPropertyTypes("WAREHOUSE"),
  };

  const STATUS_LABELS: Record<string, string> = {
    NEW: tLeadStatus("NEW"), CONTACTED: tLeadStatus("CONTACTED"), INTERESTED: tLeadStatus("INTERESTED"), NEGOTIATION: tLeadStatus("NEGOTIATION"), CONVERTED: tLeadStatus("CONVERTED"), LOST: tLeadStatus("LOST"),
  };

  const user = await getCurrentUser();
  if (!user?.agencyId) {
    return (
      <div>
        <PageHeader title={t("analyticsTitle")} description={t("analyticsSubtitle")} />
        <p className="text-center text-text-secondary py-8">{t("noPermission")}</p>
      </div>
    );
  }

  const summary = await getAgencyAnalyticsSummary();
  if (!summary) {
    return (
      <div>
        <PageHeader title={t("analyticsTitle")} description={t("analyticsSubtitle")} />
        <p className="text-center text-text-secondary py-8">{tCommon("error")}</p>
      </div>
    );
  }

  const typeData = summary.propertiesByType.map((item) => ({ name: TYPE_LABELS[item.propertyType] || item.propertyType, value: item._count }));
  const leadData = summary.leadsByStatus.map((item) => ({ name: STATUS_LABELS[item.status] || item.status, value: item._count }));

  return (
    <div>
      <PageHeader title={t("analyticsTitle")} description={t("analyticsSubtitle")} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard title={t("totalProperties")} value={summary.totalProperties} icon={Building2} change={`${summary.publishedProperties} ${t("publishedProperties")}`} changeType="positive" />
        <StatCard title={t("totalViews")} value={summary.totalViewsCount} icon={Eye} change={`${summary.averageViews} ${t("avgViews")}`} changeType="neutral" />
        <StatCard title={t("totalLeads")} value={summary.totalLeads} icon={Users} change={`${summary.overallConversion}% ${t("conversionRate")}`} changeType={summary.overallConversion > 0 ? "positive" : "neutral"} />
        <StatCard title={t("leadsByStatus")} value={summary.contactClicks} icon={MousePointerClick} change={`${tCommon("phone")} + ${tCommon("email")}`} changeType="neutral" />
        <StatCard title={t("leadsByStatus")} value={summary.leadsWithProperty} icon={Target} change={t("leadsByStatus")} changeType="neutral" />
        <StatCard title={t("conversionRate")} value={`${summary.overallConversion}%`} icon={TrendingUp} change="leads / views" changeType={summary.overallConversion > 2 ? "positive" : "neutral"} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <div className="rounded-xl border border-border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">{t("propertiesByType")}</h3>
          {typeData.length > 0 ? <PropertyTypeChart data={typeData} /> : <p className="text-center text-text-secondary py-8">{t("noDataYet")}</p>}
        </div>
        <div className="rounded-xl border border-border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">{t("leadsByStatus")}</h3>
          {leadData.length > 0 ? <LeadStatusChart data={leadData} /> : <p className="text-center text-text-secondary py-8">{t("noDataYet")}</p>}
        </div>
      </div>

      {/* Top Properties Performance */}
      <div className="rounded-xl border border-border bg-white p-6 mb-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">{t("propertiesPerformance")}</h3>
        {summary.topProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary">#</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary">{t("tableProperty")}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary">{tProperty("city")}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary">{t("tablePrice")}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary">{t("tableViews")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {summary.topProperties.map((p, i) => (
                  <tr key={p.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-4 py-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`/dashboard/properties/${p.id}`} className="text-sm font-medium text-text-primary hover:text-accent transition-colors">{p.title}</a>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{p.city}</td>
                    <td className="px-4 py-3 text-sm font-bold text-accent">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-surface-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-l from-accent to-accent-dark"
                            style={{ width: `${summary.totalViewsCount > 0 ? Math.min((p.viewCount / Math.max(...summary.topProperties.map(tp => tp.viewCount), 1)) * 100, 100) : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-text-primary">{p.viewCount}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-center text-text-secondary py-8">{t("noDataYet")}</p>}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">{t("recentProperties")}</h3>
        {summary.recentProperties.length > 0 ? (
          <div className="space-y-3">
            {summary.recentProperties.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <a href={`/dashboard/properties/${p.id}`} className="text-sm font-medium text-text-primary hover:text-accent transition-colors">{p.title}</a>
                  <p className="text-xs text-text-tertiary">{new Date(p.createdAt).toLocaleDateString("ar-DZ")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-text-secondary">
                    <Eye className="h-3 w-3" />
                    {p.viewCount}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${p.status === "PUBLISHED" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {p.status === "PUBLISHED" ? t("publishedLabel") : t("draft")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-center text-text-secondary py-8">{t("noPropertiesYet")}</p>}
      </div>
    </div>
  );
}
