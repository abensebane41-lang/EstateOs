import { MetadataRoute } from "next";
import { prisma } from "@/shared/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://estate-os-beryl.vercel.app";

  const properties = await prisma.property.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });

  const agencies = await prisma.agency.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/properties`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  const propertyPages = properties.map((p) => ({
    url: `${base}/properties/${encodeURIComponent(p.slug)}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const agencyPages = agencies.map((a) => ({
    url: `${base}/agency/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...agencyPages, ...propertyPages];
}
