export const dynamic = "force-dynamic";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/client";
import { Building2, Users, BarChart3, Globe, Zap, CheckCircle2, X, Star, TrendingUp, DollarSign, Shield, ArrowLeft } from "lucide-react";

export default async function ForAgenciesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("marketing");

  return (
    <div className="overflow-hidden" dir="rtl">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-[#0a1f3a] py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-5 py-2 text-sm text-accent mb-8">
            <Star className="h-4 w-4" />
            {t("heroBadge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-public-heading leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-3 max-w-3xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>
          <p className="text-base text-accent font-medium mb-10">
            {t("heroPrice")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-accent px-10 py-4 text-lg font-bold text-primary-dark hover:bg-accent-light transition-all shadow-lg shadow-accent/20">
              {t("heroCta")}
              <ArrowLeft className="mr-3 h-5 w-5" />
            </Link>
            <Link href="/properties" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/20 px-10 py-4 text-lg font-medium text-white hover:bg-white/10 transition-all">
              {t("heroSecondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{t("problemTitle")}</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">{t("problemSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: DollarSign, key: "problem1" },
              { icon: Globe, key: "problem2" },
              { icon: Users, key: "problem3" },
              { icon: Shield, key: "problem4" },
            ].map(({ icon: Icon, key }) => (
              <div key={key} className="rounded-2xl border border-error/15 bg-white p-7 text-center hover:shadow-md transition-shadow">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-error/8">
                  <Icon className="h-7 w-7 text-error" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">{t(`${key}Title`)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t(`${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{t("solutionTitle")}</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">{t("solutionSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Building2, key: "feature1" },
              { icon: Users, key: "feature2" },
              { icon: BarChart3, key: "feature3" },
              { icon: Globe, key: "feature4" },
              { icon: Zap, key: "feature5" },
              { icon: TrendingUp, key: "feature6" },
            ].map(({ icon: Icon, key }) => (
              <div key={key} className="group rounded-2xl border border-border bg-surface-secondary p-7 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/8 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">{t(`${key}Title`)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t(`${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("stepsTitle")}</h2>
            <p className="text-lg text-white/50 max-w-xl mx-auto">{t("stepsSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { num: "1", key: "step1" },
              { num: "2", key: "step2" },
              { num: "3", key: "step3" },
            ].map(({ num, key }) => (
              <div key={key} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary-dark text-2xl font-bold shadow-lg shadow-accent/20">
                  {num}
                </div>
                <h3 className="text-xl font-bold mb-3">{t(`${key}Title`)}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{t(`${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{t("comparisonTitle")}</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">{t("comparisonSubtitle")}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="ltr">
                <thead>
                  <tr className="bg-surface-secondary">
                    <th className="py-5 px-6 text-left font-semibold text-text-primary w-2/5">{t("comparisonFeature")}</th>
                    <th className="py-5 px-4 text-center font-semibold text-text-secondary w-1/5">Lamacta</th>
                    <th className="py-5 px-4 text-center font-semibold text-text-secondary w-1/5">NextImmo</th>
                    <th className="py-5 px-4 text-center font-bold text-primary bg-primary/5 w-1/5">EstateOS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="py-4 px-6 font-medium text-text-primary">{t("comparisonPrice")}</td>
                    <td className="py-4 px-4 text-center text-text-secondary font-medium">25,000 {t("comparisonPriceUnit")}</td>
                    <td className="py-4 px-4 text-center text-text-secondary font-medium">1,750 {t("comparisonPriceUnit")}</td>
                    <td className="py-4 px-4 text-center font-bold text-primary bg-primary/5">2,500 {t("comparisonPriceUnit")}</td>
                  </tr>
                  {(["site", "dashboard", "analytics", "leads", "seo", "mobile"] as const).map((feature) => (
                    <tr key={feature} className="border-t border-border">
                      <td className="py-4 px-6 text-text-primary">{t(`comparison${feature.charAt(0).toUpperCase() + feature.slice(1)}`)}</td>
                      <td className="py-4 px-4 text-center">
                        <CompareCell has={feature !== "analytics" && feature !== "leads" && feature !== "seo"} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <CompareCell has={feature === "site"} />
                      </td>
                      <td className="py-4 px-4 text-center bg-primary/5">
                        <CompareCell has={true} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { num: "10+", key: "proof1" },
              { num: "200+", key: "proof2" },
              { num: "2,500", key: "proof3" },
            ].map(({ key, num }) => (
              <div key={key} className="text-center rounded-2xl border border-border bg-surface-secondary py-8 px-4">
                <p className="text-4xl font-bold text-primary mb-2 font-public-heading">{num}</p>
                <p className="text-sm text-text-secondary">{t(`${key}Label`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-public-heading leading-tight">{t("ctaTitle")}</h2>
          <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">{t("ctaSubtitle")}</p>
          <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-accent px-12 py-5 text-xl font-bold text-primary-dark hover:bg-accent-light transition-all shadow-xl shadow-accent/20">
            {t("ctaButton")}
            <ArrowLeft className="mr-3 h-6 w-6" />
          </Link>
          <p className="mt-5 text-sm text-white/30">{t("ctaNote")}</p>
        </div>
      </section>
    </div>
  );
}

function CompareCell({ has }: { has: boolean }) {
  if (has) {
    return <CheckCircle2 className="h-5 w-5 text-success mx-auto" />;
  }
  return <X className="h-5 w-5 text-text-tertiary/40 mx-auto" />;
}
