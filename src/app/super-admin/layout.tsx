import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { redirect } from "next/navigation";
import { SuperAdminSidebar } from "@/shared/components/layout/super-admin-sidebar";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
