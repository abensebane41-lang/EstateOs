import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/shared/components/shared/page-header";
import { Bell, Check, CheckCheck } from "lucide-react";
import { NotificationsList } from "./notifications-list";

export default async function NotificationsPage() {
  const t = await getTranslations("dashboard");
  const user = await getCurrentUser();
  if (!user?.agencyId) {
    return (
      <div>
        <PageHeader title={t("notificationsTitle")} description={t("noUnreadNotifications")} />
        <p className="text-center text-text-secondary py-8">{t("noPermission")}</p>
      </div>
    );
  }

  const notifications = await prisma.agencyNotification.findMany({
    where: { agencyId: user.agencyId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <PageHeader
        title={t("notificationsTitle")}
        description={`${unreadCount} ${t("unreadNotifications")}`}
      />
      <NotificationsList initialNotifications={JSON.parse(JSON.stringify(notifications))} />
    </div>
  );
}
