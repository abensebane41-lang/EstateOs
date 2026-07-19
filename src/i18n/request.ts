import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "ar" | "fr")) {
    const cookieStore = await cookies();
    const publicLocale = cookieStore.get("PUBLIC_LOCALE")?.value;
    const nextLocale = cookieStore.get("NEXT_LOCALE")?.value;
    locale = (publicLocale || nextLocale || routing.defaultLocale) as "ar" | "fr";
  }
  if (!routing.locales.includes(locale as "ar" | "fr")) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
