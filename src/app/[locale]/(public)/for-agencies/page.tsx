export const dynamic = "force-dynamic";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/client";
import { Building2, Users, BarChart3, Globe, Zap, CheckCircle2, ArrowLeft, Star, Shield, Phone, TrendingUp, DollarSign } from "lucide-react";

export default async function ForAgenciesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("marketing");

  const problems = [
    { icon: DollarSign, key: "problem1" },
    { icon: Globe, key: "problem2" },
    { icon: Users, key: "problem3" },
    { icon: Shield, key: "problem4" },
  ];

  const steps = [
    { num: "1", key: "step1" },
    { num: "2", key: "step2" },
    { num: "3", key: "step3" },
  ];

  const features = [
    { icon: Building2, key: "feature1" },
    { icon: Users, key: "feature2" },
    { icon: BarChart3, key: "feature3" },
    { icon: Globe, key: "feature4" },
    { icon: Zap, key: "feature5" },
    { icon: TrendingUp, key: "feature6" },
  ];

  const competitors = [
    { name: "Lamacta", price: "25,000", features: ["site", "dashboard"] },
    { name: "NextImmo", price: "1,750", features: ["limited"] },
    { name: "EstateOS", price: "2,500", features: ["site", "dashboard", "analytics", "leads", "seo", "mobile"] },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-[#0a1f3a] py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm text-accent mb-6">
            <Star className="h-4 w-4" />
            {t("heroBadge")}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 font-public-heading leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-4 max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
          <p className="text-base text-white/50 mb-8 max-w-xl mx-auto">
            {t("heroPrice")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-accent px-8 py-4 text-base font-bold text-primary-dark hover:bg-accent-light transition-all shadow-lg shadow-accent/20">
              {t("heroCta")}
              <ArrowLeft className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/properties" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-4 text-base font-medium text-white hover:bg-white/10 transition-all">
              {t("heroSecondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">{t("problemTitle")}</h2>
            <p className="text-text-secondary max-w-xl mx-auto">{t("problemSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {problems.map(({ icon: Icon, key }) => (
              <div key={key} className="rounded-xl border border-error/20 bg-white p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-error/10">
                  <Icon className="h-6 w-6 text-error" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{t(`${key}Title`)}</h3>
                <p className="text-sm text-text-secondary">{t(`${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">{t("solutionTitle")}</h2>
            <p className="text-text-secondary max-w-xl mx-auto">{t("solutionSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {features.map(({ icon: Icon, key }) => (
              <div key={key} className="group rounded-xl border border-border bg-surface-secondary p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{t(`${key}Title`)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t(`${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("stepsTitle")}</h2>
            <p className="text-white/60 max-w-xl mx-auto">{t("stepsSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {steps.map(({ num, key }) => (
              <div key={key} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary-dark text-xl font-bold">
                  {num}
                </div>
                <h3 className="font-semibold mb-2">{t(`${key}Title`)}</h3>
                <p className="text-sm text-white/60">{t(`${key}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-surface-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">{t("comparisonTitle")}</h2>
            <p className="text-text-secondary max-w-xl mx-auto">{t("comparisonSubtitle")}</p>
          </div>
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 text-right font-semibold text-text-primary">{t("comparisonFeature")}</th>
                  <th className="py-4 px-4 text-center font-semibold text-text-secondary">Lamacta</th>
                  <th className="py-4 px-4 text-center font-semibold text-text-secondary">NextImmo</th>
                  <th className="py-4 px-4 text-center font-bold text-primary bg-primary/5 rounded-t-xl">EstateOS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-text-primary">{t("comparisonPrice")}</td>
                  <td className="py-3 px-4 text-center text-text-secondary">25,000 {t("comparisonPriceUnit")}</td>
                  <td className="py-3 px-4 text-center text-text-secondary">1,750 {t("comparisonPriceUnit")}</td>
                  <td className="py-3 px-4 text-center font-bold text-primary bg-primary/5">2,500 {t("comparisonPriceUnit")}</td>
                </tr>
                {["site", "dashboard", "analytics", "leads", "seo", "mobile"].map((feature) => (
                  <tr key={feature} className="border-b border-border">
                    <td className="py-3 px-4 text-text-primary">{t(`comparison${feature.charAt(0).toUpperCase() + feature.slice(1)}`)}</td>
                    <td className="py-3 px-4 text-center">
                      <CheckResult has={feature !== "analytics" && feature !== "leads" && feature !== "seo"} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <CheckResult has={feature === "site"} />
                    </td>
                    <td className="py-3 px-4 text-center bg-primary/5">
                      <CheckResult has={true} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">{t("proofTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { key: "proof1", num: "10+" },
              { key: "proof2", num: "200+" },
              { key: "proof3", num: "2,500" },
            ].map(({ key, num }) => (
              <div key={key} className="text-center rounded-xl border border-border bg-surface-secondary p-6">
                <p className="text-3xl font-bold text-primary mb-2">{num}</p>
                <p className="text-sm text-text-secondary">{t(`${key}Label`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 font-public-heading">{t("ctaTitle")}</h2>
          <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">{t("ctaSubtitle")}</p>
          <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-accent px-10 py-4 text-lg font-bold text-primary-dark hover:bg-accent-light transition-all shadow-lg shadow-accent/20">
            {t("ctaButton")}
            <ArrowLeft className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-white/40">{t("ctaNote")}</p>
        </div>
      </section>
    </div>
  );
}

function CheckResult({ has }: { has: boolean }) {
  if (has) {
    return <CheckCircle2 className="h-5 w-5 text-success mx-auto" />;
  }
  return <span className="text-text-tertiary">—</span>;
}
