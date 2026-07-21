export const dynamic = "force-dynamic";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/client";
import { Calendar, ArrowLeft, Building2, TrendingUp, Users } from "lucide-react";

const articles = [
  {
    slug: "best-real-estate-platform-algeria",
    icon: Building2,
    date: "2026-07-20",
    readTime: "5 min",
    keys: ["article1"],
  },
  {
    slug: "how-to-create-real-estate-website",
    icon: TrendingUp,
    date: "2026-07-18",
    readTime: "4 min",
    keys: ["article2"],
  },
  {
    slug: "digital-marketing-real-estate-agencies",
    icon: Users,
    date: "2026-07-15",
    readTime: "6 min",
    keys: ["article3"],
  },
];

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16 text-white">
        <div className="mx-auto max-w-[64rem] px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h1>
          <p className="text-lg text-white/60">{t("subtitle")}</p>
        </div>
      </section>

      <section className="bg-surface-secondary py-16">
        <div className="mx-auto max-w-[64rem] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map(({ slug, icon: Icon, date, readTime, keys }) => (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 transition-colors group-hover:bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-2 text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                  {t(`${keys[0]}Title`)}
                </h2>
                <p className="mb-4 text-sm text-text-secondary leading-relaxed">
                  {t(`${keys[0]}Excerpt`)}
                </p>
                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {date}
                  </span>
                  <span>{readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[40rem] px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-text-primary">{t("ctaTitle")}</h2>
          <p className="mb-8 text-text-secondary">{t("ctaSubtitle")}</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-primary-light"
          >
            {t("ctaButton")}
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
