import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { SuspendedPage } from "@/shared/components/shared/suspended-page";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  if (!user.agencyId) {
    return <>{children}</>;
  }

  let agency;
  try {
    agency = await prisma.agency.findUnique({
      where: { id: user.agencyId },
      select: {
        name: true,
        logoUrl: true,
        slug: true,
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true, endDate: true, trialEndsAt: true },
        },
      },
    });
  } catch {
    redirect("/login");
  }

  if (!agency) {
    redirect("/login");
  }

  const subscription = agency.subscriptions[0];
  const subStatus = subscription?.status || "NONE";

  if (subStatus === "SUSPENDED" || subStatus === "EXPIRED") {
    return (
      <SuspendedPage
        agencyName={agency.name}
        status={subStatus}
        endDate={subscription?.endDate?.toISOString()}
      />
    );
  }

  if (subStatus === "TRIAL" && subscription?.trialEndsAt && new Date(subscription.trialEndsAt) < new Date()) {
    return (
      <SuspendedPage
        agencyName={agency.name}
        status="EXPIRED"
        endDate={subscription.trialEndsAt.toISOString()}
      />
    );
  }

  return (
    <DashboardShell agency={{ name: agency.name, logoUrl: agency.logoUrl, slug: agency.slug }} userRole={user.role}>
      {children}
    </DashboardShell>
  );
}
