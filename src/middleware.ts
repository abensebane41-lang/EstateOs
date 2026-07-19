import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["ar", "fr"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "ar";

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

function isValidLocale(v: string | undefined): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

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

  let cleanPathname = pathname;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && (LOCALES as readonly string[]).includes(segments[0])) {
    cleanPathname = "/" + segments.slice(1).join("/");
  }

  let locale: Locale = DEFAULT_LOCALE;
  if (isSuperAdmin) {
    locale = DEFAULT_LOCALE;
  } else if (isDashboard) {
    const dashboardLocale = request.cookies.get("NEXT_LOCALE")?.value;
    locale = isValidLocale(dashboardLocale) ? dashboardLocale : DEFAULT_LOCALE;
  } else {
    const publicLocale = request.cookies.get("PUBLIC_LOCALE")?.value;
    locale = isValidLocale(publicLocale) ? publicLocale : DEFAULT_LOCALE;
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/${locale}${cleanPathname}`;

  const response = NextResponse.rewrite(rewriteUrl);

  if (!isDashboard && !isSuperAdmin) {
    response.cookies.set("PUBLIC_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  if (isDashboard) {
    response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }

  return response;
}

export const config = {
  matcher: ["/", "/(ar|fr)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
