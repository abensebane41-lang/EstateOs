export const dynamic = "force-dynamic";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/client";
import { Building2, Users, BarChart3, Shield, Globe, Zap, ArrowRight } from "lucide-react";

const featureIcons = [Building2, Users, BarChart3, Shield, Globe, Zap];
const featureKeys = [
  "feature1",
  "feature2",
  "feature3",
  "feature4",
  "feature5",
  "feature6",
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <div>
      <section className="relative bg-primary py-24 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 mb-6 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            {t("professionalPlatform")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-public-heading tracking-tight">
            EstateOS
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-3">
            {t("heroSubtitle")}
          </p>
          <p className="text-lg text-white/50 mb-10 max-w-[42rem] mx-auto">
            {t("heroDescription")}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-primary-dark hover:bg-accent-light transition-all duration-200 shadow-lg shadow-accent/20">
              {t("startFree")}
              <ArrowRight className="mr-2 h-4 w-4" />
            </Link>
            <Link href="/properties" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-3.5 text-base font-medium text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
              {t("browseProperties")}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-3">{t("featuresTitle")}</h2>
            <p className="text-text-secondary max-w-[36rem] mx-auto">{t("featuresDescription")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[i];
              return (
                <div key={key} className="group rounded-xl border border-border bg-white p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                  <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{t(`${key}Title`)}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{t(`${key}Desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("forAgencies")}</h2>
          <p className="text-lg text-white/70 mb-8 max-w-[32rem] mx-auto">
            {t("freeTrial")}. {t("noCreditCard")}.
          </p>
          <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-accent px-10 py-4 text-base font-semibold text-primary-dark hover:bg-accent-light transition-all duration-200 shadow-lg shadow-accent/20">
            {t("freeTrial")}
            <ArrowRight className="mr-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
