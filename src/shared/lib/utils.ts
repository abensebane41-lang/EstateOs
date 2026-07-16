import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "DZD"): string {
  if (amount >= 1_000_000_000) {
    const billions = amount / 1_000_000_000;
    const formatted = billions === Math.floor(billions) ? String(billions) : billions.toFixed(1).replace(/\.0$/, "");
    return `${formatted} مليار د.ج`;
  }
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const formatted = millions === Math.floor(millions) ? String(millions) : millions.toFixed(1).replace(/\.0$/, "");
    return `${formatted} مليون د.ج`;
  }
  return new Intl.NumberFormat("ar-DZ", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceFilter(amount: number): string {
  if (amount >= 1_000_000_000) {
    const val = amount / 1_000_000_000;
    return val === Math.floor(val) ? `${val} مليار` : `${val} مليار`;
  }
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    return val === Math.floor(val) ? `${val} مليون` : `${val} مليون`;
  }
  return String(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
