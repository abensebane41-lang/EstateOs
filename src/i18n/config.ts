export const locales = ["ar", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const localeNames: Record<Locale, string> = {
  ar: "العربية",
  fr: "Français",
};

export const dirMap: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  fr: "ltr",
};
