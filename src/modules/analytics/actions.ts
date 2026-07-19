"use server";

import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

export async function trackEvent(params: {
  agencyId: string;
  eventType: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const agency = await prisma.agency.findUnique({
      where: { id: params.agencyId },
      select: { id: true },
    });
    if (!agency) {
      console.error("Track event error: Invalid agencyId");
      return;
    }

    await prisma.analyticsEvent.create({
      data: {
        agencyId: params.agencyId,
        eventType: params.eventType,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    });
  } catch (error) {
    console.error("Track event error:", error);
  }
}

export async function trackPropertyView(propertyId: string, agencyId: string) {
  try {
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      select: { id: true },
    });
    if (!agency) {
      console.error("Track property view error: Invalid agencyId");
      return;
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, agencyId: true },
    });
    if (!property || property.agencyId !== agencyId) {
      console.error("Track property view error: Property not found or does not belong to agency");
      return;
    }

    await prisma.property.update({
      where: { id: propertyId },
      data: { viewCount: { increment: 1 } },
    });

    await trackEvent({
      agencyId,
      eventType: "PROPERTY_VIEW",
      metadata: { propertyId },
    });
  } catch (error) {
    console.error("Track property view error:", error);
  }
}

export async function trackContactClick(propertyId: string | null, agencyId: string, method: "PHONE" | "EMAIL" | "FORM") {
  try {
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      select: { id: true },
    });
    if (!agency) {
      console.error("Track contact click error: Invalid agencyId");
      return;
    }

    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true, agencyId: true },
      });
      if (!property || property.agencyId !== agencyId) {
        console.error("Track contact click error: Property not found or does not belong to agency");
        return;
      }
    }

    await trackEvent({
      agencyId,
      eventType: "CONTACT_CLICK",
      metadata: { propertyId, method },
    });
  } catch (error) {
    console.error("Track contact click error:", error);
  }
}

export async function getPropertyAnalytics(propertyId: string) {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return null;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { viewCount: true, id: true, agencyId: true },
    });

    if (!property || property.agencyId !== user.agencyId) return null;

    const leadCount = await prisma.lead.count({
      where: { propertyId },
    });

    const viewEvents = await prisma.analyticsEvent.count({
      where: {
        eventType: "PROPERTY_VIEW",
        metadata: { contains: propertyId },
        agencyId: user.agencyId,
      },
    });

    const contactClicks = await prisma.analyticsEvent.count({
      where: {
        eventType: "CONTACT_CLICK",
        metadata: { contains: propertyId },
        agencyId: user.agencyId,
      },
    });

    const leads = await prisma.lead.groupBy({
      by: ["status"],
      where: { propertyId, agencyId: user.agencyId },
      _count: true,
    });

    const viewsByDay = await prisma.analyticsEvent.findMany({
      where: {
        eventType: "PROPERTY_VIEW",
        metadata: { contains: propertyId },
        agencyId: user.agencyId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const dailyViews: Record<string, number> = {};
    viewsByDay.forEach((event) => {
      const day = event.createdAt.toISOString().split("T")[0];
      dailyViews[day] = (dailyViews[day] || 0) + 1;
    });

    return {
      viewCount: property.viewCount,
      leadCount,
      viewEvents,
      contactClicks,
      conversionRate: property.viewCount > 0 ? Math.round((leadCount / property.viewCount) * 10000) / 100 : 0,
      leadsByStatus: leads.map((l) => ({ status: l.status, count: l._count })),
      dailyViews: Object.entries(dailyViews).map(([date, count]) => ({ date, count })),
    };
  } catch (error) {
    console.error("Get property analytics error:", error);
    return null;
  }
}

export async function getAgencyAnalyticsSummary() {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return null;
    const agencyId = user.agencyId;

    const [
      totalProperties,
      publishedProperties,
      totalLeads,
      totalViews,
      propertiesByType,
      leadsByStatus,
      recentProperties,
      topProperties,
      contactClicks,
      leadsWithProperty,
    ] = await Promise.all([
      prisma.property.count({ where: { agencyId } }),
      prisma.property.count({ where: { agencyId, status: "PUBLISHED" } }),
      prisma.lead.count({ where: { agencyId } }),
      prisma.property.aggregate({ where: { agencyId }, _sum: { viewCount: true } }),
      prisma.property.groupBy({ by: ["propertyType"], where: { agencyId }, _count: true }),
      prisma.lead.groupBy({ by: ["status"], where: { agencyId }, _count: true }),
      prisma.property.findMany({
        where: { agencyId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, createdAt: true, viewCount: true, status: true },
      }),
      prisma.property.findMany({
        where: { agencyId },
        orderBy: { viewCount: "desc" },
        take: 10,
        select: { id: true, title: true, viewCount: true, city: true, price: true },
      }),
      prisma.analyticsEvent.count({
        where: { agencyId, eventType: "CONTACT_CLICK" },
      }),
      prisma.lead.count({
        where: { agencyId, propertyId: { not: null } },
      }),
    ]);

    const totalViewsCount = totalViews._sum.viewCount ?? 0;

    return {
      totalProperties,
      publishedProperties,
      totalLeads,
      totalViewsCount,
      propertiesByType,
      leadsByStatus,
      recentProperties,
      topProperties,
      contactClicks,
      leadsWithProperty,
      averageViews: totalProperties > 0 ? Math.round(totalViewsCount / totalProperties) : 0,
      overallConversion: totalViewsCount > 0 ? Math.round((totalLeads / totalViewsCount) * 10000) / 100 : 0,
    };
  } catch (error) {
    console.error("Get agency analytics summary error:", error);
    return null;
  }
}
