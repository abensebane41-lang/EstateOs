"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  const otherLocale = routing.locales.find((l) => l !== locale)!;

  function switchLocale() {
    document.cookie = `PUBLIC_LOCALE=${otherLocale};path=/;max-age=31536000`;
    window.location.reload();
  }

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors"
    >
      {locale === "ar" ? "Français" : "العربية"}
    </button>
  );
}
