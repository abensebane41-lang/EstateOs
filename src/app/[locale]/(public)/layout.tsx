import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/client";
import { LanguageSwitcher } from "./components/language-switcher";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "public" });
  return {
    title: {
      default: t("siteTitle"),
      template: "%s",
    },
    description: t("siteDescription"),
    keywords: ["عقارات", "إدارة عقارات", "وكلاء عقاريين", "بيع عقارات", "تأجير عقارات", "الجزائر"],
    openGraph: {
      title: t("siteTitle"),
      description: t("siteDescription"),
      type: "website",
      locale: "ar_DZ",
    },
  };
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("public");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary font-public-heading">
            EstateOS
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-white py-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-text-secondary">&copy; {new Date().getFullYear()} EstateOS. {t("copyright")}</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-text-secondary hover:text-text-primary transition-colors">{t("terms")}</Link>
            <a href="mailto:support@estateos.dz" className="text-sm text-text-secondary hover:text-text-primary transition-colors">{t("contactUsLink")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
