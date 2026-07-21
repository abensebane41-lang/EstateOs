export const dynamic = "force-dynamic";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/client";
import { Building2, Users, BarChart3, Globe, Zap, CheckCircle2, X, Star, TrendingUp, Shield, ArrowLeft, Eye, CircleDollarSign } from "lucide-react";

export default async function ForAgenciesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("marketing");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-[#071428] py-20 text-white md:py-32">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('/grid.svg')", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[48rem] text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2 text-sm font-medium text-accent backdrop-blur-sm">
              <Star className="h-4 w-4 fill-accent" />
              {t("heroBadge")}
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-[3.5rem]">
              {t("heroTitle")}
            </h1>
            <p className="mb-4 text-lg text-white/70 leading-relaxed md:text-xl">
              {t("heroSubtitle")}
            </p>
            <p className="mb-10 text-base font-semibold text-accent">
              {t("heroPrice")}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-primary-dark shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-xl hover:shadow-accent/30 sm:w-auto"
              >
                {t("heroCta")}
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Link
                href="/properties"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-base font-medium text-white transition-all hover:bg-white/10 sm:w-auto"
              >
                {t("heroSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="bg-surface-secondary py-20">
        <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-[40rem] text-center">
            <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">{t("problemTitle")}</h2>
            <p className="text-lg text-text-secondary">{t("problemSubtitle")}</p>
          </div>
          <div className="mx-auto grid max-w-[72rem] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CircleDollarSign, key: "problem1" },
              { icon: Globe, key: "problem2" },
              { icon: Users, key: "problem3" },
              { icon: Shield, key: "problem4" },
            ].map(({ icon: Icon, key }) => (
              <div key={key} className="rounded-2xl border border-error/10 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-error/5">
                  <Icon className="h-7 w-7 text-error/80" />
                </div>
                <h3 className="mb-2 text-base font-bold text-text-primary">{t(`${key}Title`)}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{t(`${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-[40rem] text-center">
            <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">{t("solutionTitle")}</h2>
            <p className="text-lg text-text-secondary">{t("solutionSubtitle")}</p>
          </div>
          <div className="mx-auto grid max-w-[72rem] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Building2, key: "feature1" },
              { icon: Users, key: "feature2" },
              { icon: BarChart3, key: "feature3" },
              { icon: Globe, key: "feature4" },
              { icon: Zap, key: "feature5" },
              { icon: TrendingUp, key: "feature6" },
            ].map(({ icon: Icon, key }) => (
              <div key={key} className="group rounded-2xl border border-border bg-surface-secondary p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 transition-colors group-hover:bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-base font-bold text-text-primary">{t(`${key}Title`)}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{t(`${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-primary py-20 text-white">
        <div className="mx-auto max-w-[64rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-[36rem] text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("stepsTitle")}</h2>
            <p className="text-lg text-white/50">{t("stepsSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              { num: "1", key: "step1" },
              { num: "2", key: "step2" },
              { num: "3", key: "step3" },
            ].map(({ num, key }) => (
              <div key={key} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-xl font-bold text-primary-dark shadow-lg shadow-accent/20">
                  {num}
                </div>
                <h3 className="mb-3 text-xl font-bold">{t(`${key}Title`)}</h3>
                <p className="text-sm leading-relaxed text-white/50">{t(`${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-surface-secondary py-20">
        <div className="mx-auto max-w-[56rem] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-[40rem] text-center">
            <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">{t("comparisonTitle")}</h2>
            <p className="text-lg text-text-secondary">{t("comparisonSubtitle")}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="ltr">
                <thead>
                  <tr className="bg-surface-secondary">
                    <th className="w-2/5 py-5 px-6 text-left font-semibold text-text-primary">{t("comparisonFeature")}</th>
                    <th className="w-1/5 py-5 px-4 text-center font-semibold text-text-secondary">Lamacta</th>
                    <th className="w-1/5 py-5 px-4 text-center font-semibold text-text-secondary">NextImmo</th>
                    <th className="w-1/5 rounded-t-xl bg-primary/5 py-5 px-4 text-center font-bold text-primary">EstateOS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="py-4 px-6 font-medium text-text-primary">{t("comparisonPrice")}</td>
                    <td className="py-4 px-4 text-center font-medium text-text-secondary">25,000 {t("comparisonPriceUnit")}</td>
                    <td className="py-4 px-4 text-center font-medium text-text-secondary">1,750 {t("comparisonPriceUnit")}</td>
                    <td className="bg-primary/5 py-4 px-4 text-center font-bold text-primary">2,500 {t("comparisonPriceUnit")}</td>
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
                      <td className="bg-primary/5 py-4 px-4 text-center">
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
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[56rem] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { num: "10+", key: "proof1", icon: Building2 },
              { num: "200+", key: "proof2", icon: Eye },
              { num: "2,500", key: "proof3", icon: BarChart3 },
            ].map(({ key, num, icon: Icon }) => (
              <div key={key} className="rounded-2xl border border-border bg-surface-secondary py-8 px-4 text-center">
                <Icon className="mx-auto mb-3 h-6 w-6 text-primary/60" />
                <p className="mb-2 text-4xl font-bold text-primary">{num}</p>
                <p className="text-sm text-text-secondary">{t(`${key}Label`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark py-24 text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-[48rem] px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">{t("ctaTitle")}</h2>
          <p className="mb-10 text-lg text-white/50">{t("ctaSubtitle")}</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-3 rounded-xl bg-accent px-12 py-5 text-xl font-bold text-primary-dark shadow-xl shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-2xl hover:shadow-accent/30"
          >
            {t("ctaButton")}
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <p className="mt-5 text-sm text-white/30">{t("ctaNote")}</p>
        </div>
      </section>
    </div>
  );
}

function CompareCell({ has }: { has: boolean }) {
  if (has) return <CheckCircle2 className="mx-auto h-5 w-5 text-success" />;
  return <X className="mx-auto h-5 w-5 text-text-tertiary/40" />;
}
