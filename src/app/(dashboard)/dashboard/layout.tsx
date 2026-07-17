import { Sidebar } from "@/shared/components/layout/sidebar";
import { Topbar } from "@/shared/components/layout/topbar";
import { SuspendedPage } from "@/shared/components/shared/suspended-page";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.agencyId) {
    return <>{children}</>;
  }

  const agency = await prisma.agency.findUnique({
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar agency={{ name: agency.name, logoUrl: agency.logoUrl, slug: agency.slug }} userRole={user.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar agency={{ name: agency.name, logoUrl: agency.logoUrl }} />
        <main className="flex-1 overflow-y-auto bg-surface-secondary p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
