import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";
import { SettingsForm } from "./settings-form";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

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

  const agency = await prisma.agency.findUnique({
    where: { id: user.agencyId },
    select: {
      id: true,
      name: true,
      slug: true,
      phone: true,
      email: true,
      address: true,
      description: true,
      logoUrl: true,
      primaryColor: true,
      accentColor: true,
      locale: true,
      createdAt: true,
      _count: { select: { properties: true, leads: true } },
      subscriptions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { status: true, trialEndsAt: true, startDate: true, endDate: true },
      },
    },
  });

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
