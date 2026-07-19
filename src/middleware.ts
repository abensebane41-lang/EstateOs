import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/track": { max: 30, windowMs: 60_000 },
  "/api/upload": { max: 10, windowMs: 60_000 },
  "/api/upload/logo": { max: 10, windowMs: 60_000 },
  "/api/seed": { max: 3, windowMs: 300_000 },
  "/api/property-images": { max: 30, windowMs: 60_000 },
};

const DEFAULT_LIMIT = { max: 60, windowMs: 60_000 };

const hits = new Map<string, { count: number; resetAt: number }>();

function check(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= max;
}

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    if (pathname.startsWith("/api/auth/")) {
      return NextResponse.next();
    }

    const rule = RATE_LIMITS[pathname] || DEFAULT_LIMIT;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
    const key = `${ip}:${pathname}`;

    if (!check(key, rule.max, rule.windowMs)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.next();
  }

  const isSuperAdmin = pathname.startsWith("/super-admin");
  const isDashboard = pathname.startsWith("/dashboard");
  const isPublic = !isSuperAdmin && !isDashboard;

  let validLocale: string;
  if (isSuperAdmin) {
    validLocale = "ar";
  } else if (isPublic) {
    const publicLocale = request.cookies.get("PUBLIC_LOCALE")?.value;
    validLocale = publicLocale && routing.locales.includes(publicLocale as "ar" | "fr")
      ? publicLocale
      : "ar";
  } else {
    const dashboardLocale = request.cookies.get("NEXT_LOCALE")?.value;
    validLocale = dashboardLocale && routing.locales.includes(dashboardLocale as "ar" | "fr")
      ? dashboardLocale
      : "ar";
  }

  const newHeaders = new Headers(request.headers);
  const existingCookies = newHeaders.get("cookie") || "";
  const filtered = existingCookies
    .split(";")
    .map((c) => c.trim())
    .filter((c) => !c.startsWith("NEXT_LOCALE=") && !c.startsWith("PUBLIC_LOCALE="));
  filtered.push(`NEXT_LOCALE=${validLocale}`);
  newHeaders.set("cookie", filtered.join("; "));
  const modifiedRequest = new NextRequest(request.url, { ...request, headers: newHeaders });

  const response = intlMiddleware(modifiedRequest);

  if (isPublic) {
    response.cookies.delete("NEXT_LOCALE");
    response.cookies.set("PUBLIC_LOCALE", validLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  } else {
    response.cookies.set("NEXT_LOCALE", validLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  return response;
}

export const config = {
  matcher: ["/", "/(ar|fr)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
