import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SuperAdminSidebar } from "@/shared/components/layout/super-admin-sidebar";

export default async function SuperAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

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
