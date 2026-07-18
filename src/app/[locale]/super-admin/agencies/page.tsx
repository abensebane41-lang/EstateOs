export const dynamic = "force-dynamic";

import { prisma } from "@/shared/lib/prisma";
import { Building2, Users, Home, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

const STATUS_BADGES: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
  TRIAL: { icon: <Clock className="h-3 w-3" />, label: "تجريبي", className: "bg-warning/10 text-warning" },
  ACTIVE: { icon: <CheckCircle className="h-3 w-3" />, label: "نشط", className: "bg-success/10 text-success" },
  EXPIRED: { icon: <XCircle className="h-3 w-3" />, label: "منتهي", className: "bg-error/10 text-error" },
};

export default async function SuperAdminAgenciesPage() {
  let agencies;
  try {
    agencies = await prisma.agency.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { properties: true, leads: true, users: true } },
        subscriptions: { select: { status: true, trialEndsAt: true }, take: 1, orderBy: { createdAt: "desc" } },
      },
    });
  } catch (error) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="rounded-xl border border-error/20 bg-error/5 p-6">
          <h1 className="text-lg font-bold text-error">خطأ في تحميل البيانات</h1>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-text-secondary">{String(error)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">الوكالات</h1>
        <p className="text-sm text-text-secondary">{agencies.length} وكالة مسجلة</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agencies.map((agency) => {
          const subscription = agency.subscriptions[0];
          const status = subscription?.status || "NONE";
          const badge = STATUS_BADGES[status];

          return (
            <Link
              key={agency.id}
              href={`/super-admin/agencies/${agency.id}`}
              className="rounded-xl border border-border bg-white p-5 transition-all hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                {agency.logoUrl ? (
                  <img src={agency.logoUrl} alt={agency.name} className="h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                    {agency.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{agency.name}</h3>
                  <p className="text-xs text-text-secondary">{agency.slug}</p>
                </div>
                {badge && (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-surface-secondary p-2">
                  <Home className="mx-auto mb-1 h-4 w-4 text-text-tertiary" />
                  <p className="text-sm font-bold text-text-primary">{agency._count.properties}</p>
                  <p className="text-xs text-text-secondary">عقار</p>
                </div>
                <div className="rounded-lg bg-surface-secondary p-2">
                  <Users className="mx-auto mb-1 h-4 w-4 text-text-tertiary" />
                  <p className="text-sm font-bold text-text-primary">{agency._count.leads}</p>
                  <p className="text-xs text-text-secondary">عميل</p>
                </div>
                <div className="rounded-lg bg-surface-secondary p-2">
                  <Building2 className="mx-auto mb-1 h-4 w-4 text-text-tertiary" />
                  <p className="text-sm font-bold text-text-primary">{agency._count.users}</p>
                  <p className="text-xs text-text-secondary">مستخدم</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-text-secondary">
                <span>{agency.email || "بدون بريد"}</span>
                <span>{new Date(agency.createdAt).toLocaleDateString("ar-DZ")}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
