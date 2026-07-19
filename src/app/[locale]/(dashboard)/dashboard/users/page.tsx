import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";
import { UsersTable } from "./users-table";
import { UserPlus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function UsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const tCommon = await getTranslations("common");

  const user = await getCurrentUser();
  if (!user?.agencyId) {
    return (
      <div>
        <PageHeader title={t("usersTitle")} description={t("usersSubtitle")} />
        <p className="text-center text-text-secondary py-8">{t("noPermission")}</p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    where: { agencyId: user.agencyId },
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title={t("usersTitle")}
        description={t("usersSubtitle")}
      />
      <UsersTable initialUsers={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
