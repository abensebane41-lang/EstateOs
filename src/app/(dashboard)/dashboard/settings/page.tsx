import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user?.agencyId) {
    return (
      <div>
        <PageHeader title="الإعدادات" description="إعدادات وكالتك وحسابك" />
        <p className="text-center text-text-secondary py-8">لا تملك صلاحية</p>
      </div>
    );
  }

  const agency = await prisma.agency.findUnique({
    where: { id: user.agencyId },
    include: {
      _count: { select: { properties: true, leads: true } },
      subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div>
      <PageHeader
        title="الإعدادات"
        description="إعدادات وكالتك وحسابك"
      />
      <SettingsForm agency={JSON.parse(JSON.stringify(agency))} />
    </div>
  );
}
