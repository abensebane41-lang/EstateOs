import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/client";
import { Check, ArrowRight } from "lucide-react";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pricing");

  const plans = [
    {
      name: t("free"),
      price: "0",
      period: t("forever"),
      description: t("freeDesc"),
      highlighted: false,
      features: [
        { text: t("feature50Properties"), included: true },
        { text: t("feature10Images"), included: true },
        { text: t("featurePublicPage"), included: true },
        { text: t("featureLeadManagement"), included: true },
        { text: t("featureBasicStats"), included: true },
        { text: t("featureEmailSupport"), included: true },
        { text: t("featureCustomDomain"), included: false },
        { text: t("featureRemoveBranding"), included: false },
      ],
    },
    {
      name: t("basic"),
      price: "1,500",
      period: t("perMonth"),
      priceNote: t("currency"),
      description: t("basicDesc"),
      highlighted: false,
      features: [
        { text: t("feature200Properties"), included: true },
        { text: t("feature15Images"), included: true },
        { text: t("featurePublicPage"), included: true },
        { text: t("featureLeadManagement"), included: true },
        { text: t("featureAdvancedStats"), included: true },
        { text: t("featureEmailSupport"), included: true },
        { text: t("featureCustomDomain"), included: false },
        { text: t("featureRemoveBranding"), included: false },
      ],
    },
    {
      name: t("professional"),
      price: "3,500",
      period: t("perMonth"),
      priceNote: t("currency"),
      description: t("professionalDesc"),
      highlighted: true,
      features: [
        { text: t("feature1000Properties"), included: true },
        { text: t("feature25Images"), included: true },
        { text: t("featurePublicPage"), included: true },
        { text: t("featureLeadManagement"), included: true },
        { text: t("featureFullReports"), included: true },
        { text: t("featurePrioritySupport"), included: true },
        { text: t("featureCustomDomain"), included: true },
        { text: t("featureRemoveBranding"), included: true },
      ],
    },
  ];

  return (
    <div className="py-16 bg-surface-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-3 font-public-heading">{t("title")}</h1>
          <p className="text-lg text-text-secondary max-w-[32rem] mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 flex flex-col ${
                plan.highlighted
                  ? "border-accent bg-white shadow-lg shadow-accent/10"
                  : "border-border bg-white"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-primary-dark">
                  {t("mostPopular")}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-text-primary mb-1">{plan.name}</h3>
                <p className="text-sm text-text-secondary">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  {plan.price !== "0" && <span className="text-lg text-text-secondary">{plan.priceNote}</span>}
                  <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                </div>
                <p className="text-sm text-text-secondary mt-1">{plan.period}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    <Check className={`h-4 w-4 shrink-0 ${feature.included ? "text-success" : "text-text-tertiary"}`} />
                    <span className={`text-sm ${feature.included ? "text-text-primary" : "text-text-tertiary line-through"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-accent text-primary-dark hover:bg-accent-light shadow-lg shadow-accent/20"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {t("startNow")}
                <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">{t("questions")}</h2>
          <p className="text-text-secondary mb-6 max-w-[28rem] mx-auto">
            {t("questionsDesc")}
          </p>
          <a href="mailto:support@estateos.dz" className="inline-flex items-center text-primary hover:underline font-medium">
            support@estateos.dz
          </a>
        </div>
      </div>
    </div>
  );
}
