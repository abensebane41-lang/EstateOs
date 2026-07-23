"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");

  const otherLocale = routing.locales.find((l) => l !== locale)!;

  function switchLocale() {
    document.cookie = `NEXT_LOCALE=${otherLocale};path=/;max-age=31536000`;
    window.location.reload();
  }

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/60 backdrop-blur-sm hover:border-white/25 hover:bg-white/10 hover:text-white transition-colors"
    >
      {locale === "ar" ? "Français" : "العربية"}
    </button>
  );
}
