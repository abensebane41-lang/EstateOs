import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "public" });
  return {
    title: t("termsTitle"),
  };
}

const sections = [
  "acceptance",
  "serviceDescription",
  "accounts",
  "acceptableUse",
  "content",
  "payment",
  "disclaimer",
  "changes",
  "contactUs",
] as const;

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("public");

  return (
    <div className="py-16 bg-surface-secondary">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary mb-8 font-public-heading">{t("termsHeading")}</h1>

        <div className="rounded-2xl border border-border bg-white p-8 space-y-6 text-text-secondary leading-relaxed">
          {sections.map((section) => (
            <section key={section}>
              <h2 className="text-xl font-semibold text-text-primary mb-3">{t(section)}</h2>
              <p>{t(`${section}Content`)}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
