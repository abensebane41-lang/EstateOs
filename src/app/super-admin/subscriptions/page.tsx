export const dynamic = "force-dynamic";

import { prisma } from "@/shared/lib/prisma";
import { SubscriptionsTable } from "./subscriptions-table";

export default async function SuperAdminSubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    include: { agency: { select: { id: true, name: true, slug: true, email: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });

  const serialized = subscriptions.map((s) => ({
    ...s,
    startDate: s.startDate.toISOString(),
    endDate: s.endDate?.toISOString() ?? null,
    activatedAt: s.activatedAt?.toISOString() ?? null,
    trialEndsAt: s.trialEndsAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">الاشتراكات</h1>
        <p className="text-sm text-text-secondary">إدارة اشتراكات جميع الوكالات</p>
      </div>

      <SubscriptionsTable initialSubscriptions={serialized} />
    </div>
  );
}
