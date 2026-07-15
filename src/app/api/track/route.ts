import { NextRequest, NextResponse } from "next/server";
import { trackPropertyView, trackContactClick } from "@/modules/analytics/actions";
import { prisma } from "@/shared/lib/prisma";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(key);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(key, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const { type, propertyId, agencyId, method } = body;

    if (!type || !agencyId || typeof agencyId !== "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const agencyExists = await prisma.agency.findUnique({ where: { id: agencyId }, select: { id: true } });
    if (!agencyExists) {
      return NextResponse.json({ error: "Invalid agency" }, { status: 400 });
    }

    if (type === "PROPERTY_VIEW" && propertyId) {
      if (typeof propertyId !== "string") {
        return NextResponse.json({ error: "Invalid propertyId" }, { status: 400 });
      }
      const propertyExists = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true, agencyId: true },
      });
      if (!propertyExists || propertyExists.agencyId !== agencyId) {
        return NextResponse.json({ error: "Invalid property for this agency" }, { status: 400 });
      }
      await trackPropertyView(propertyId, agencyId);
    } else if (type === "CONTACT_CLICK") {
      const validMethods = ["PHONE", "EMAIL", "FORM"];
      if (method && !validMethods.includes(method)) {
        return NextResponse.json({ error: "Invalid method" }, { status: 400 });
      }
      await trackContactClick(propertyId || null, agencyId, method || "FORM");
    } else {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Track API error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
