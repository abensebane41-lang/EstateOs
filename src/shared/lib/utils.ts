import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, locale = "ar"): string {
  if (amount >= 1_000_000_000) {
    const billions = amount / 1_000_000_000;
    const formatted = billions === Math.floor(billions) ? String(billions) : billions.toFixed(1).replace(/\.0$/, "");
    return locale === "fr" ? `${formatted} milliard DA` : `${formatted} مليار سنتيم`;
  }
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const formatted = millions === Math.floor(millions) ? String(millions) : millions.toFixed(1).replace(/\.0$/, "");
    return locale === "fr" ? `${formatted} million DA` : `${formatted} مليون سنتيم`;
  }
  return new Intl.NumberFormat(locale === "fr" ? "fr-DZ" : "ar-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceFilter(amount: number, locale = "ar"): string {
  if (amount >= 1_000_000_000) {
    const val = amount / 1_000_000_000;
    return locale === "fr" ? `${val} milliard` : `${val} مليار`;
  }
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    return locale === "fr" ? `${val} million` : `${val} مليون`;
  }
  return String(amount);
}

export function formatDate(date: Date | string, locale = "ar"): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-DZ" : "ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!slug) {
    return `property-${Date.now()}`;
  }
  return slug;
}

export function decodeSlug(raw: string): string {
  try { return decodeURIComponent(raw); } catch { return raw; }
}
