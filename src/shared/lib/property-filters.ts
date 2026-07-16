import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export interface PropertyFilters {
  agencyId?: string;
  search?: string;
  listingType?: string;
  propertyType?: string;
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  furnished?: boolean;
  parking?: boolean;
  balcony?: boolean;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export function parseFilters(searchParams: Record<string, string | undefined>, agencyId?: string): PropertyFilters {
  return {
    agencyId,
    search: searchParams.search || undefined,
    listingType: searchParams.purpose || undefined,
    propertyType: searchParams.type || undefined,
    state: searchParams.state || undefined,
    city: searchParams.city || undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    minArea: searchParams.minArea ? Number(searchParams.minArea) : undefined,
    maxArea: searchParams.maxArea ? Number(searchParams.maxArea) : undefined,
    bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
    bathrooms: searchParams.bathrooms ? Number(searchParams.bathrooms) : undefined,
    floor: searchParams.floor ? Number(searchParams.floor) : undefined,
    furnished: searchParams.furnished === "1" ? true : undefined,
    parking: searchParams.parking === "1" ? true : undefined,
    balcony: searchParams.balcony === "1" ? true : undefined,
    featured: searchParams.featured === "1" ? true : undefined,
    sort: searchParams.sort || "newest",
    page: searchParams.page ? Number(searchParams.page) : 1,
    limit: searchParams.limit ? Number(searchParams.limit) : 12,
  };
}

function buildWhereClause(filters: PropertyFilters): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {
    status: "PUBLISHED",
  };

  const and: Prisma.PropertyWhereInput[] = [];

  if (filters.agencyId) {
    and.push({ agencyId: filters.agencyId });
  }

  if (filters.search) {
    and.push({
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { city: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
      ],
    });
  }

  if (filters.listingType) {
    and.push({ listingType: filters.listingType });
  }

  if (filters.propertyType) {
    and.push({ propertyType: filters.propertyType });
  }

  if (filters.state) {
    and.push({ state: filters.state });
  }

  if (filters.city) {
    and.push({ city: filters.city });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const priceFilter: Prisma.FloatFilter = {};
    if (filters.minPrice !== undefined) priceFilter.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) priceFilter.lte = filters.maxPrice;
    and.push({ price: priceFilter });
  }

  if (filters.minArea !== undefined || filters.maxArea !== undefined) {
    const areaFilter: Prisma.FloatFilter = {};
    if (filters.minArea !== undefined) areaFilter.gte = filters.minArea;
    if (filters.maxArea !== undefined) areaFilter.lte = filters.maxArea;
    and.push({ area: areaFilter });
  }

  if (filters.bedrooms !== undefined) {
    and.push({ bedrooms: { gte: filters.bedrooms } });
  }

  if (filters.bathrooms !== undefined) {
    and.push({ bathrooms: { gte: filters.bathrooms } });
  }

  if (filters.floor !== undefined) {
    and.push({ floor: filters.floor });
  }

  if (filters.furnished) {
    and.push({ furnished: true });
  }

  if (filters.parking) {
    and.push({ parking: true });
  }

  if (filters.balcony) {
    and.push({ balcony: true });
  }

  if (filters.featured) {
    and.push({ isFeatured: true });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return where;
}

function buildOrderBy(sort?: string): Prisma.PropertyOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "area_desc":
      return { area: "desc" };
    case "views":
      return { viewCount: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export async function filterProperties(filters: PropertyFilters) {
  const where = buildWhereClause(filters);
  const orderBy = buildOrderBy(filters.sort);
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const skip = (page - 1) * limit;

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        agency: { select: { name: true, slug: true, logoUrl: true } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCitiesForState(state: string, agencyId?: string) {
  const where: Prisma.PropertyWhereInput = {
    status: "PUBLISHED",
    state,
  };
  if (agencyId) (where as any).agencyId = agencyId;

  const cities = await prisma.property.findMany({
    where,
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });

  return cities.map((c) => c.city);
}

export function filtersToSearchParams(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  if (filters.listingType) params.set("purpose", filters.listingType);
  if (filters.propertyType) params.set("type", filters.propertyType);
  if (filters.state) params.set("state", filters.state);
  if (filters.city) params.set("city", filters.city);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minArea) params.set("minArea", String(filters.minArea));
  if (filters.maxArea) params.set("maxArea", String(filters.maxArea));
  if (filters.bedrooms) params.set("bedrooms", String(filters.bedrooms));
  if (filters.bathrooms) params.set("bathrooms", String(filters.bathrooms));
  if (filters.floor) params.set("floor", String(filters.floor));
  if (filters.furnished) params.set("furnished", "1");
  if (filters.parking) params.set("parking", "1");
  if (filters.balcony) params.set("balcony", "1");
  if (filters.featured) params.set("featured", "1");
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  return params.toString();
}
