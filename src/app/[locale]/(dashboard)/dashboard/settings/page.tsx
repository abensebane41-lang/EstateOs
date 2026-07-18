import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";
import { SettingsForm } from "./settings-form";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");
  const tNav = await getTranslations("nav");

  let user;
  try {
    user = await getCurrentUser();
  } catch {
    redirect("/login");
  }

  if (!user?.agencyId) {
    return (
      <div>
        <PageHeader title={tNav("settings")} description={t("settingsSubtitle")} />
        <p className="text-center text-text-secondary py-8">{t("noPermission")}</p>
      </div>
    );
  }

  let agency;
  try {
    agency = await prisma.agency.findUnique({
      where: { id: user.agencyId },
      include: {
        _count: { select: { properties: true, leads: true } },
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  } catch (error) {
    console.error("Settings page error:", error);
    return (
      <div>
        <PageHeader title={tNav("settings")} description={t("settingsSubtitle")} />
        <div className="rounded-xl border border-error/20 bg-error/5 p-8 text-center">
          <p className="text-error font-medium">{t("loadError")}</p>
          <p className="text-sm text-text-secondary mt-2">{t("loadErrorDesc")}</p>
        </div>
      </div>
    );
  }

  if (!agency) {
    redirect("/login");
  }

  return (
    <div>
      <PageHeader title={tNav("settings")} description={t("settingsSubtitle")} />
      <SettingsForm agency={JSON.parse(JSON.stringify(agency))} />
    </div>
  );
}
