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
    keywords: t("keywords"),
    openGraph: {
      title: t("siteTitle"),
      description: t("siteDescription"),
      type: "website",
      locale: locale === "ar" ? "ar_DZ" : "fr_FR",
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
    <div className="min-h-screen flex flex-col bg-[#0B0F1A]">
      <header className="border-b border-white/8 bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-white font-public-heading tracking-wide">
            Estate<span className="text-accent">OS</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/8 bg-[#0B0F1A] py-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-white/30">&copy; {new Date().getFullYear()} EstateOS. {t("copyright")}</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-white/30 hover:text-white/60 transition-colors">{t("terms")}</Link>
            <a href="mailto:support@estateos.dz" className="text-sm text-white/30 hover:text-white/60 transition-colors">{t("contactUsLink")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
