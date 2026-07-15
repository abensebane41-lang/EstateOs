import { Sidebar } from "@/shared/components/layout/sidebar";
import { Topbar } from "@/shared/components/layout/topbar";
import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const agency = user.agencyId
    ? await prisma.agency.findUnique({
        where: { id: user.agencyId },
        select: { name: true, logoUrl: true, slug: true },
      })
    : null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar agency={agency} userRole={user.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar agency={agency} />
        <main className="flex-1 overflow-y-auto bg-surface-secondary p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
