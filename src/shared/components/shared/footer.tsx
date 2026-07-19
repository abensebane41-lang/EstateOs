import { Link } from "@/i18n/client";
import { Building2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("public");

  return (
    <footer className="border-t border-border bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">E</div>
              <span className="font-bold text-text-primary text-lg">EstateOS</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-[24rem]">
              {t("platformDescription")}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">{t("platform")}</h3>
            <ul className="space-y-2">
              <li><Link href="/properties" className="text-sm text-text-secondary hover:text-primary transition-colors">{t("browseProperties")}</Link></li>
              <li><Link href="/register" className="text-sm text-text-secondary hover:text-primary transition-colors">{t("createAgency")}</Link></li>
              <li><Link href="/login" className="text-sm text-text-secondary hover:text-primary transition-colors">{t("login")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">{t("legal")}</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-text-secondary hover:text-primary transition-colors">{t("privacyPolicy")}</Link></li>
              <li><Link href="/terms" className="text-sm text-text-secondary hover:text-primary transition-colors">{t("termsOfUse")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-text-tertiary">
          <p>&copy; {new Date().getFullYear()} EstateOS. {t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
