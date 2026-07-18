import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/shared/components/ui/button";
import { FileQuestion } from "lucide-react";

export default async function DashboardNotFound() {
  const t = await getTranslations("errors");
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-surface-secondary p-4 mb-4">
        <FileQuestion className="h-12 w-12 text-text-tertiary" />
      </div>
      <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
      <h2 className="text-xl font-semibold text-text-primary mb-2">{t("notFound")}</h2>
      <p className="text-sm text-text-secondary mb-6 max-w-[28rem]">
        {t("notFoundDashboardDesc")}
      </p>
      <Link href="/dashboard">
        <Button>{t("backToDashboard")}</Button>
      </Link>
    </div>
  );
}
