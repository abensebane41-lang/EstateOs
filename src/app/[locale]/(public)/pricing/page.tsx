import Link from "next/link";
import { Check, ArrowRight, Building2, Users, BarChart3, Globe, HardDrive, Headphones } from "lucide-react";

const plans = [
  {
    name: "مجاني",
    nameEn: "Free",
    price: "0",
    period: "دائماً",
    description: "للوكلاء الجدد الذين يريدون تجربة المنصة",
    highlighted: false,
    features: [
      { text: "50 عقار", included: true },
      { text: "10 صور لكل عقار", included: true },
      { text: "صفحة عامة احترافية", included: true },
      { text: "إدارة العملاء المحتملين", included: true },
      { text: "إحصائيات/basic", included: true },
      { text: "دعم عبر البريد", included: true },
      { text: "域名 مخصص", included: false },
      { text: "إزالة علامة EstateOS", included: false },
    ],
  },
  {
    name: "أساسي",
    nameEn: "Basic",
    price: "1,500",
    period: "شهرياً",
    priceNote: "د.ج",
    description: "للوكلاء النشطين الذين يحتاجون ميزات أكثر",
    highlighted: false,
    features: [
      { text: "200 عقار", included: true },
      { text: "15 صورة لكل عقار", included: true },
      { text: "صفحة عامة احترافية", included: true },
      { text: "إدارة العملاء المحتملين", included: true },
      { text: "إحصائيات متقدمة", included: true },
      { text: "دعم عبر البريد", included: true },
      { text: "域名 مخصص", included: false },
      { text: "إزالة علامة EstateOS", included: false },
    ],
  },
  {
    name: "احترافي",
    nameEn: "Professional",
    price: "3,500",
    period: "شهرياً",
    priceNote: "د.ج",
    description: "للوكلاء الكبيرة الذين يحتاجون كل شيء",
    highlighted: true,
    features: [
      { text: "1,000 عقار", included: true },
      { text: "25 صورة لكل عقار", included: true },
      { text: "صفحة عامة احترافية", included: true },
      { text: "إدارة العملاء المحتملين", included: true },
      { text: "إحصائيات وتقارير كاملة", included: true },
      { text: "دعم أولوية", included: true },
      { text: "域名 مخصص", included: true },
      { text: "إزالة علامة EstateOS", included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="py-16 bg-surface-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-3 font-public-heading">الأسعار</h1>
          <p className="text-lg text-text-secondary max-w-[32rem] mx-auto">
            اختر الخطة المناسبة لوكالتك. ابدأ مجاناً وطوّر مع نمو أعمالك.
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
                  الأكثر شيوعاً
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
                ابدأ الآن
                <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">لديك أسئلة؟</h2>
          <p className="text-text-secondary mb-6 max-w-[28rem] mx-auto">
            تواصل معنا وسنساعدك في اختيار الخطة المناسبة لاحتياجاتك.
          </p>
          <a href="mailto:support@estateos.dz" className="inline-flex items-center text-primary hover:underline font-medium">
            support@estateos.dz
          </a>
        </div>
      </div>
    </div>
  );
}
