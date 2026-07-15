import { Building2, Users, Eye, TrendingUp } from "lucide-react";
import { StatCard } from "@/shared/components/shared/stat-card";
import { PageHeader } from "@/shared/components/shared/page-header";
import { EmptyState } from "@/shared/components/shared/empty-state";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.agencyId) {
    return (
      <div>
        <PageHeader
          title="لوحة التحكم"
          description="مرحباً بك في إدارة وكالتك"
        />
        <EmptyState
          icon={Building2}
          title="لم يتم تعيين وكالة بعد"
          description="يرجى الاتصال بالدعم الفني"
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
          title="لوحة التحكم"
          description="مرحباً بك في إدارة وكالتك"
        />
        <EmptyState
          icon={Building2}
          title="ابدأ بإضافة عقارك الأول"
          description="أضف عقاراتك لتظهر على موقعك وتجذب العملاء المحتملين"
          action={
            <a
              href="/dashboard/properties/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-light transition-colors"
            >
              إضافة عقار
            </a>
          }
        />
      </div>
    );
  }

  const leadStatusMap: Record<string, string> = {
    NEW: "جديد",
    CONTACTED: "تم الاتصال",
    INTERESTED: "مهتم",
    NEGOTIATION: "تفاوض",
    CONVERTED: "تم التحويل",
    LOST: "ضائع",
  };

  const propertyTypeMap: Record<string, string> = {
    APARTMENT: "شقة",
    VILLA: "فيلا",
    HOUSE: "منزل أرضي",
    OFFICE: "مكتب",
    LAND: "أرض",
    COMMERCIAL: "محل تجاري",
    WAREHOUSE: "مستودع",
  };

  const listingTypeMap: Record<string, string> = {
    SALE: "للبيع",
    RENT: "للإيجار",
  };

  return (
    <div>
      <PageHeader
        title="لوحة التحكم"
        description="مرحباً بك في إدارة وكالتك"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="إجمالي العقارات"
          value={totalProperties}
          icon={Building2}
          change={`${publishedProperties} منشور`}
          changeType="positive"
        />
        <StatCard
          title="العملاء المحتملون"
          value={totalLeads}
          icon={Users}
          change={`${convertedLeads} تم تحويلهم`}
          changeType="positive"
        />
        <StatCard
          title="مشاهدات الصفحة"
          value={totalViewCount.toLocaleString("ar-DZ")}
          icon={Eye}
          change="إجمالي المشاهدات"
          changeType="neutral"
        />
        <StatCard
          title="العملاء المحولون"
          value={convertedLeads}
          icon={TrendingUp}
          change={totalLeads > 0 ? `${Math.round((convertedLeads / totalLeads) * 100)}% معدل التحويل` : "لا بيانات"}
          changeType={convertedLeads > 0 ? "positive" : "neutral"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">العملاء المحتملون الأخيرون</h2>
          <div className="rounded-xl border border-border bg-white shadow-sm divide-y divide-border">
            {recentLeads.length === 0 ? (
              <div className="p-6 text-center text-sm text-text-secondary">لا يوجد عملاء محتملون بعد</div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{lead.name}</p>
                    <p className="text-xs text-text-secondary truncate">{lead.property?.title ?? "بدون عقار"}</p>
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
          <h2 className="text-lg font-semibold text-text-primary mb-4">العقارات المميزة</h2>
          <div className="rounded-xl border border-border bg-white shadow-sm divide-y divide-border">
            {featuredProperties.length === 0 ? (
              <div className="p-6 text-center text-sm text-text-secondary">لا توجد عقارات منشورة بعد</div>
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
                    <p className="text-sm font-semibold text-text-primary">{property.price.toLocaleString("ar-DZ")} د.ج</p>
                    <p className="text-xs text-text-secondary">{property.viewCount} مشاهدة</p>
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
