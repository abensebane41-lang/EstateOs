export const dynamic = "force-dynamic";

import { prisma } from "@/shared/lib/prisma";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Building2, Users, Home, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, Ban, CreditCard } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function SuperAdminDashboard({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("superAdmin");

  const [totalAgencies, totalProperties, totalLeads, recentAgencies, subscriptions] = await Promise.all([
    prisma.agency.count(),
    prisma.property.count(),
    prisma.lead.count(),
    prisma.agency.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        _count: { select: { properties: true, leads: true } },
        subscriptions: { select: { status: true } },
      },
    }),
    prisma.subscription.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const subscriptionStats = subscriptions.reduce((acc, s) => {
    acc[s.status] = s._count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>
        <p className="text-sm text-text-secondary">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">{t("totalAgencies")}</p>
            <p className="text-xl font-bold text-text-primary">{totalAgencies}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
          <div className="rounded-lg bg-accent/10 p-3">
            <Home className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">{t("totalProperties")}</p>
            <p className="text-xl font-bold text-text-primary">{totalProperties}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
          <div className="rounded-lg bg-success/10 p-3">
            <Users className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">{t("totalLeads")}</p>
            <p className="text-xl font-bold text-text-primary">{totalLeads}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
          <div className="rounded-lg bg-warning/10 p-3">
            <TrendingUp className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">{t("activeSubscriptions")}</p>
            <p className="text-xl font-bold text-text-primary">{subscriptionStats.ACTIVE || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">{t("agencies")}</h2>
          <div className="space-y-3">
            {recentAgencies.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-secondary">{t("agenciesEmpty")}</p>
            ) : (
              recentAgencies.map((agency) => (
                <Link
                  key={agency.id}
                  href={`/super-admin/agencies/${agency.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-surface-secondary"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {agency.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{agency.name}</p>
                      <p className="text-xs text-text-secondary">
                        {agency._count.properties} {t("properties")} · {agency._count.leads} {t("leads")}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-text-tertiary">
                    {new Date(agency.createdAt).toLocaleDateString("ar-DZ")}
                  </span>
                </Link>
              ))
            )}
          </div>
          <Link href="/super-admin/agencies" className="mt-4 block text-center text-sm text-primary hover:underline">
            {t("viewAll")}
          </Link>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">{t("subscriptions")}</h2>
            <div className="space-y-3">
              {subscriptionStats.TRIAL ? (
                <div className="flex items-center justify-between rounded-lg bg-warning/10 p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-text-primary">{t("statusTrial")}</span>
                  </div>
                  <span className="text-lg font-bold text-text-primary">{subscriptionStats.TRIAL}</span>
                </div>
              ) : null}
              {subscriptionStats.ACTIVE ? (
                <div className="flex items-center justify-between rounded-lg bg-success/10 p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-text-primary">{t("statusActive")}</span>
                  </div>
                  <span className="text-lg font-bold text-text-primary">{subscriptionStats.ACTIVE}</span>
                </div>
              ) : null}
              {subscriptionStats.SUSPENDED ? (
                <div className="flex items-center justify-between rounded-lg bg-error/10 p-3">
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-error" />
                    <span className="text-sm font-medium text-text-primary">{t("statusSuspended")}</span>
                  </div>
                  <span className="text-lg font-bold text-text-primary">{subscriptionStats.SUSPENDED}</span>
                </div>
              ) : null}
              {subscriptionStats.EXPIRED ? (
                <div className="flex items-center justify-between rounded-lg bg-text-tertiary/10 p-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-text-tertiary" />
                    <span className="text-sm font-medium text-text-primary">{t("statusExpired")}</span>
                  </div>
                  <span className="text-lg font-bold text-text-primary">{subscriptionStats.EXPIRED}</span>
                </div>
              ) : null}
            </div>
            <Link href="/super-admin/subscriptions" className="mt-4 block text-center text-sm text-primary hover:underline">
              {t("manageSubscriptions")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
