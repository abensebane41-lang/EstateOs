export const dynamic = "force-dynamic";

import { prisma } from "@/shared/lib/prisma";
import { notFound } from "next/navigation";
import { Building2, Users, Home, Mail, Phone, MapPin, Calendar, CheckCircle, Clock, XCircle, Ban } from "lucide-react";
import Link from "next/link";
import { SubscriptionManager } from "./subscription-manager";
import { DeleteAgencyButton } from "./delete-agency-button";

const STATUS_LABELS: Record<string, string> = {
  TRIAL: "فترة تجريبية",
  ACTIVE: "نشط",
  EXPIRED: "منتهي",
  SUSPENDED: "معلق",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  TRIAL: <Clock className="h-4 w-4" />,
  ACTIVE: <CheckCircle className="h-4 w-4" />,
  EXPIRED: <XCircle className="h-4 w-4" />,
  SUSPENDED: <Ban className="h-4 w-4" />,
};

const STATUS_COLORS: Record<string, string> = {
  TRIAL: "bg-warning/10 text-warning",
  ACTIVE: "bg-success/10 text-success",
  EXPIRED: "bg-text-tertiary/10 text-text-tertiary",
  SUSPENDED: "bg-error/10 text-error",
};

export default async function SuperAdminAgencyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let agency;
  try {
    agency = await prisma.agency.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, email: true, role: true } },
        properties: { select: { id: true, title: true, price: true, status: true, listingType: true }, orderBy: { createdAt: "desc" }, take: 10 },
        _count: { select: { properties: true, leads: true } },
        subscriptions: { orderBy: { createdAt: "desc" } },
      },
    });
  } catch {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="rounded-xl border border-error/20 bg-error/5 p-6">
          <h1 className="text-lg font-bold text-error">خطأ في تحميل البيانات</h1>
        </div>
      </div>
    );
  }

  if (!agency) notFound();

  const currentSubscription = agency.subscriptions[0];
  const subscription = currentSubscription ? {
    ...currentSubscription,
    startDate: currentSubscription.startDate.toISOString(),
    endDate: currentSubscription.endDate?.toISOString() ?? null,
    activatedAt: currentSubscription.activatedAt?.toISOString() ?? null,
    trialEndsAt: currentSubscription.trialEndsAt?.toISOString() ?? null,
    createdAt: currentSubscription.createdAt.toISOString(),
  } : null;

  const subscriptionHistory = agency.subscriptions.map((s) => ({
    ...s,
    startDate: s.startDate.toISOString(),
    endDate: s.endDate?.toISOString() ?? null,
    activatedAt: s.activatedAt?.toISOString() ?? null,
    trialEndsAt: s.trialEndsAt?.toISOString() ?? null,
    createdAt: s.createdAt.toISOString(),
  }));

  const status = currentSubscription?.status || "NONE";
  const trialEndsAt = currentSubscription?.trialEndsAt ? new Date(currentSubscription.trialEndsAt) : null;
  const isTrialExpired = trialEndsAt ? trialEndsAt < new Date() : false;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {agency.logoUrl ? (
            <img src={agency.logoUrl} alt={agency.name} className="h-16 w-16 rounded-xl object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
              {agency.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{agency.name}</h1>
            <p className="text-sm text-text-secondary">{agency.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DeleteAgencyButton agencyId={agency.id} agencyName={agency.name} />
          <Link href="/super-admin/agencies" className="text-sm text-primary hover:underline">
            رجوع للقائمة
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-text-secondary">العقارات</p>
            <p className="text-lg font-bold text-text-primary">{agency._count.properties}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
          <div className="rounded-lg bg-accent/10 p-2">
            <Users className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text-secondary">العملاء</p>
            <p className="text-lg font-bold text-text-primary">{agency._count.leads}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
          <div className="rounded-lg bg-success/10 p-2">
            <Building2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-xs text-text-secondary">المستخدمين</p>
            <p className="text-lg font-bold text-text-primary">{agency.users.length}</p>
          </div>
        </div>
        <div className={`flex items-center gap-3 rounded-xl border border-border bg-white p-4`}>
          <div className={`rounded-lg p-2 ${STATUS_COLORS[status] || "bg-text-tertiary/10"}`}>
            {STATUS_ICONS[status] || <Clock className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-xs text-text-secondary">الاشتراك</p>
            <p className="text-sm font-bold text-text-primary">{STATUS_LABELS[status] || "بدون اشتراك"}</p>
          </div>
        </div>
      </div>

      <SubscriptionManager
        agencyId={agency.id}
        currentSubscription={subscription}
        agencyName={agency.name}
        agencyEmail={agency.email}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">معلومات الوكالة</h2>
          <div className="space-y-3">
            {agency.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-text-tertiary" />
                <span className="text-sm text-text-primary" dir="ltr">{agency.phone}</span>
              </div>
            )}
            {agency.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-text-tertiary" />
                <span className="text-sm text-text-primary">{agency.email}</span>
              </div>
            )}
            {agency.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-text-tertiary" />
                <span className="text-sm text-text-primary">{agency.address}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-text-tertiary" />
              <span className="text-sm text-text-primary">
                انضم {new Date(agency.createdAt).toLocaleDateString("ar-DZ")}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">المستخدمين</h2>
          <div className="space-y-2">
            {agency.users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{user.name}</p>
                  <p className="text-xs text-text-secondary">{user.email}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {user.role === "AGENCY_OWNER" ? "مالك" : user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {subscriptionHistory.length > 0 && (
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">سجل الاشتراكات</h2>
          <div className="space-y-2">
            {subscriptionHistory.map((sub) => {
              const cfg = STATUS_LABELS[sub.status] || sub.status;
              return (
                <div key={sub.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-1 ${STATUS_COLORS[sub.status] || ""}`}>
                      {STATUS_ICONS[sub.status]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{cfg}</p>
                      <p className="text-xs text-text-secondary">
                        {sub.planName || "بدون خطة"} — بدأ {new Date(sub.startDate).toLocaleDateString("ar-DZ")}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-text-tertiary">
                    {new Date(sub.createdAt).toLocaleDateString("ar-DZ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">آخر العقارات</h2>
        {agency.properties.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-secondary">لا توجد عقارات بعد</p>
        ) : (
          <div className="space-y-2">
            {agency.properties.map((property) => (
              <div key={property.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{property.title}</p>
                  <p className="text-xs text-text-secondary">
                    {property.listingType === "RENT" ? "للإيجار" : "للبيع"} · {property.status === "PUBLISHED" ? "منشور" : "مسودة"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
