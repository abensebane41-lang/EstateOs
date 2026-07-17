"use server";

import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";
import { success, failure } from "@/server/actions/response";
import type { ActionResponse } from "@/shared/lib/errors";
import { slugify } from "@/shared/lib/utils";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { revalidatePath } from "next/cache";

const createPropertySchema = z.object({
  title: z.string().min(2, "العنوان مطلوب"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  propertyType: z.string().default("APARTMENT"),
  listingType: z.string().default("SALE"),
  status: z.string().default("DRAFT"),
  price: z.coerce.number().min(0, "السعر يجب أن يكون أكبر من أو يساوي 0"),
  currency: z.string().default("DZD"),
  bedrooms: z.coerce.number().int().min(0).optional(),
  area: z.coerce.number().min(0, "المساحة يجب أن تكون أكبر من أو تساوي 0").default(0),
  address: z.string().min(2, "العنوان مطلوب"),
  city: z.string().min(2, "المدينة مطلوبة"),
  state: z.string().optional(),
  agentPhone: z.string().optional(),
  videoUrl: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

const updatePropertySchema = createPropertySchema.partial();

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export async function createProperty(
  data: CreatePropertyInput
): Promise<ActionResponse> {
  const parsed = createPropertySchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    });
    return failure("Validation failed", errors);
  }

  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");
    const agencyId = user.agencyId;
    let slug = slugify(parsed.data.title);
    const existing = await prisma.property.findUnique({
      where: { agencyId_slug: { agencyId, slug } },
    });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const property = await prisma.property.create({
      data: {
        agencyId,
        title: parsed.data.title,
        slug,
        description: parsed.data.description,
        propertyType: parsed.data.propertyType,
        listingType: parsed.data.listingType,
        status: parsed.data.status,
        price: parsed.data.price,
        currency: parsed.data.currency,
        bedrooms: parsed.data.bedrooms ?? null,
        area: parsed.data.area,
        address: parsed.data.address,
        city: parsed.data.city,
        state: parsed.data.state ?? null,
        agentPhone: parsed.data.agentPhone ?? null,
        videoUrl: parsed.data.videoUrl ?? null,
        latitude: parsed.data.latitude ?? null,
        longitude: parsed.data.longitude ?? null,
        isFeatured: parsed.data.isFeatured,
      },
    });

    const agency = await prisma.agency.findUnique({ where: { id: agencyId }, select: { slug: true } });
    if (agency) {
      revalidatePath(`/agency/${agency.slug}`);
      revalidatePath(`/agency/${agency.slug}/properties/${slug}`);
    }

    return success(property);
  } catch (error) {
    console.error("Create property error:", error);
    return failure("حدث خطأ أثناء إنشاء العقار");
  }
}

export async function updateProperty(
  id: string,
  data: UpdatePropertyInput
): Promise<ActionResponse> {
  const parsed = updatePropertySchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    });
    return failure("Validation failed", errors);
  }

  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) return failure("العقار غير موجود");
    if (existing.agencyId !== user.agencyId) return failure("غير مصرح");

    let slug = existing.slug;
    if (parsed.data.title && parsed.data.title !== existing.title) {
      slug = slugify(parsed.data.title);
      const slugExists = await prisma.property.findFirst({
        where: {
          agencyId: user.agencyId,
          slug,
          id: { not: id },
        },
      });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.propertyType !== undefined) updateData.propertyType = parsed.data.propertyType;
    if (parsed.data.listingType !== undefined) updateData.listingType = parsed.data.listingType;
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
    if (parsed.data.price !== undefined) updateData.price = parsed.data.price;
    if (parsed.data.currency !== undefined) updateData.currency = parsed.data.currency;
    if (parsed.data.bedrooms !== undefined) updateData.bedrooms = parsed.data.bedrooms ?? null;
    if (parsed.data.area !== undefined) updateData.area = parsed.data.area;
    if (parsed.data.address !== undefined) updateData.address = parsed.data.address;
    if (parsed.data.city !== undefined) updateData.city = parsed.data.city;
    if (parsed.data.state !== undefined) updateData.state = parsed.data.state ?? null;
    if (parsed.data.agentPhone !== undefined) updateData.agentPhone = parsed.data.agentPhone ?? null;
    if (parsed.data.videoUrl !== undefined) updateData.videoUrl = parsed.data.videoUrl ?? null;
    if (parsed.data.latitude !== undefined) updateData.latitude = parsed.data.latitude ?? null;
    if (parsed.data.longitude !== undefined) updateData.longitude = parsed.data.longitude ?? null;
    if (parsed.data.isFeatured !== undefined) updateData.isFeatured = parsed.data.isFeatured;
    updateData.slug = slug;

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
    });

    const agency = await prisma.agency.findUnique({ where: { id: user.agencyId! }, select: { slug: true } });
    if (agency) {
      revalidatePath(`/agency/${agency.slug}`);
      revalidatePath(`/agency/${agency.slug}/properties/${existing.slug}`);
      if (slug !== existing.slug) {
        revalidatePath(`/agency/${agency.slug}/properties/${slug}`);
      }
    }

    return success(property);
  } catch (error) {
    console.error("Update property error:", error);
    return failure("حدث خطأ أثناء تحديث العقار");
  }
}

export async function deleteProperty(id: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) return failure("العقار غير موجود");
    if (existing.agencyId !== user.agencyId) return failure("غير مصرح");

    await prisma.property.delete({ where: { id } });

    const agency = await prisma.agency.findUnique({ where: { id: user.agencyId! }, select: { slug: true } });
    if (agency) {
      revalidatePath(`/agency/${agency.slug}`);
      revalidatePath(`/agency/${agency.slug}/properties/${existing.slug}`);
    }

    return success({ message: "تم حذف العقار بنجاح" });
  } catch (error) {
    console.error("Delete property error:", error);
    return failure("حدث خطأ أثناء حذف العقار");
  }
}

export async function getProperties(
  filters?: {
    status?: string;
    propertyType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");
    const agencyId = user.agencyId;

    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { agencyId };

    if (filters?.status && filters.status !== "ALL") {
      where.status = filters.status;
    }
    if (filters?.propertyType && filters.propertyType !== "ALL") {
      where.propertyType = filters.propertyType;
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { city: { contains: filters.search, mode: "insensitive" } },
        { address: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true, title: true, slug: true, propertyType: true, listingType: true,
          status: true, price: true, currency: true, bedrooms: true, area: true,
          address: true, city: true, state: true, viewCount: true, createdAt: true,
          images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return success({
      properties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get properties error:", error);
    return failure("حدث خطأ أثناء جلب العقارات");
  }
}

export async function getPropertyById(
  id: string
): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!property) return failure("العقار غير موجود");
    if (property.agencyId !== user.agencyId) return failure("غير مصرح");

    return success(property);
  } catch (error) {
    console.error("Get property error:", error);
    return failure("حدث خطأ أثناء جلب العقار");
  }
}

export async function getPropertyBySlug(
  slug: string
): Promise<ActionResponse> {
  try {
    const property = await prisma.property.findFirst({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!property) {
      return failure("العقار غير موجود");
    }

    return success(property);
  } catch (error) {
    console.error("Get property by slug error:", error);
    return failure("حدث خطأ أثناء جلب العقار");
  }
}
