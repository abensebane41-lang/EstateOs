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

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(ar|fr)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
