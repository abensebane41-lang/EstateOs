export const dynamic = "force-dynamic";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/client";
import {
  Building2,
  Users,
  BarChart3,
  Shield,
  Globe,
  Zap,
  ArrowRight,
  Check,
  X,
  TrendingUp,
  AlertTriangle,
  Eye,
  Smartphone,
  Star,
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("marketing");

  return (
    <div className="bg-[#0B0F1A] text-white">
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/8 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/30 blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-5 py-2 text-sm font-medium text-accent backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {t("heroBadge")}
          </div>

          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-lg text-white/55 sm:text-xl">
            {t("heroSubtitle")}
          </p>

          <p className="mx-auto mb-10 max-w-xl text-base font-medium text-accent/90">
            {t("heroPrice")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-bold text-[#0B0F1A] shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-light hover:shadow-accent/35"
            >
              {t("heroCta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white/80 backdrop-blur-sm transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
            >
              {t("heroSecondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────── PROBLEMS ─────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
              {t("problemTitle")}
            </h2>
            <p className="text-white/45">{t("problemSubtitle")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(["1", "2", "3", "4"] as const).map((n) => (
              <div
                key={n}
                className="group rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:border-red-500/20 hover:bg-white/[0.05]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition-colors group-hover:bg-red-500/15">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white/90">
                  {t(`problem${n}Title`)}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {t(`problem${n}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── SOLUTION / FEATURES ─────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
              {t("solutionTitle")}
            </h2>
            <p className="text-white/45">{t("solutionSubtitle")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                { icon: Globe, key: "1", color: "text-accent", bg: "bg-accent/10" },
                { icon: Users, key: "2", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                { icon: BarChart3, key: "3", color: "text-blue-400", bg: "bg-blue-400/10" },
                { icon: Smartphone, key: "4", color: "text-purple-400", bg: "bg-purple-400/10" },
                { icon: Zap, key: "5", color: "text-orange-400", bg: "bg-orange-400/10" },
                { icon: TrendingUp, key: "6", color: "text-cyan-400", bg: "bg-cyan-400/10" },
              ] as const
            ).map(({ icon: Icon, key, color, bg }) => (
              <div
                key={key}
                className="group rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06]"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${bg} transition-colors`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white/90">
                  {t(`feature${key}Title`)}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {t(`feature${key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── HOW IT WORKS ─────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
              {t("stepsTitle")}
            </h2>
            <p className="text-white/45">{t("stepsSubtitle")}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {(["1", "2", "3"] as const).map((n, i) => (
              <div key={n} className="relative text-center">
                {i < 2 && (
                  <div className="absolute left-[calc(50%+40px)] top-10 hidden h-px w-[calc(100%-80px)] bg-white/10 sm:block rtl:left-auto rtl:right-[calc(50%+40px)] rtl:-scale-x-100" />
                )}
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-2xl font-bold text-accent">
                  {n}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white/90">
                  {t(`step${n}Title`)}
                </h3>
                <p className="mx-auto max-w-xs text-sm text-white/40">
                  {t(`step${n}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── COMPARISON TABLE ─────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
              {t("comparisonTitle")}
            </h2>
            <p className="text-white/45">{t("comparisonSubtitle")}</p>
          </div>

          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="grid grid-cols-3 border-b border-white/10 bg-white/[0.04]">
              <div className="px-5 py-4 text-sm font-medium text-white/50">
                {t("comparisonFeature")}
              </div>
              <div className="border-x border-white/10 px-5 py-4 text-center text-sm font-bold text-accent">
                EstateOS
              </div>
              <div className="px-5 py-4 text-center text-sm font-medium text-white/40">
                المنافسون
              </div>
            </div>

            {(
              [
                { feature: "comparisonPrice", estate: `2,500 ${t("comparisonPriceUnit")}`, competitor: "15,000+" },
                { feature: "comparisonSite", estate: null, competitor: null },
                { feature: "comparisonDashboard", estate: null, competitor: null },
                { feature: "comparisonAnalytics", estate: null, competitor: null },
                { feature: "comparisonLeads", estate: null, competitor: null },
                { feature: "comparisonSeo", estate: null, competitor: null },
                { feature: "comparisonMobile", estate: null, competitor: null },
              ] as const
            ).map(({ feature, estate, competitor }, i) => (
              <div
                key={feature}
                className={`grid grid-cols-3 ${i < 6 ? "border-b border-white/5" : ""}`}
              >
                <div className="flex items-center px-5 py-3.5 text-sm text-white/60">
                  {t(feature)}
                </div>
                <div className="flex items-center justify-center border-x border-white/5 px-5 py-3.5">
                  {estate ? (
                    <span className="text-sm font-semibold text-accent">{estate}</span>
                  ) : (
                    <Check className="h-5 w-5 text-emerald-400" />
                  )}
                </div>
                <div className="flex items-center justify-center px-5 py-3.5">
                  {competitor ? (
                    <span className="text-sm text-white/30">{competitor}</span>
                  ) : (
                    <X className="h-5 w-5 text-white/20" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── SOCIAL PROOF ─────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
              {t("proofTitle")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {(
              [
                { value: "50+", label: t("proof1Label"), icon: Building2, color: "text-accent" },
                { value: "500+", label: t("proof2Label"), icon: Eye, color: "text-emerald-400" },
                { value: "2,500", label: t("proof3Label"), icon: Star, color: "text-blue-400" },
              ] as const
            ).map(({ value, label, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-8 text-center transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06]"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                  <Icon className={`h-7 w-7 ${color}`} />
                </div>
                <p className="mb-1 text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-white/40">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── FINAL CTA ─────────────── */}
      <section className="relative py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/6 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-white/45">
            {t("ctaSubtitle")}
          </p>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-10 py-4 text-base font-bold text-[#0B0F1A] shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-light hover:shadow-accent/35"
          >
            {t("ctaButton")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>

          <p className="mt-5 text-sm text-white/30">{t("ctaNote")}</p>
        </div>
      </section>
    </div>
  );
}
