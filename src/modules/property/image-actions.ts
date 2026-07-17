"use server";

import { prisma } from "@/shared/lib/prisma";
import { success, failure } from "@/server/actions/response";
import type { ActionResponse } from "@/shared/lib/errors";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

async function verifyPropertyOwnership(propertyId: string) {
  const user = await getCurrentUser();
  if (!user?.agencyId) throw new Error("Unauthorized");
  const property = await prisma.property.findUnique({ where: { id: propertyId }, select: { agencyId: true } });
  if (!property || property.agencyId !== user.agencyId) throw new Error("Forbidden");
  return user;
}

export async function addPropertyImage(
  propertyId: string,
  url: string,
  altText?: string,
  isPrimary?: boolean
): Promise<ActionResponse> {
  try {
    await verifyPropertyOwnership(propertyId);

    const maxOrder = await prisma.propertyImage.findFirst({
      where: { propertyId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const image = await prisma.propertyImage.create({
      data: {
        propertyId,
        url,
        altText: altText || null,
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
        isPrimary: isPrimary ?? false,
      },
    });

    return success(image);
  } catch (error) {
    console.error("Add image error:", error);
    return failure("Failed to add image");
  }
}

export async function deletePropertyImage(imageId: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");

    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
      select: { property: { select: { agencyId: true } } },
    });
    if (!image || image.property.agencyId !== user.agencyId) return failure("غير مصرح");

    await prisma.propertyImage.delete({ where: { id: imageId } });
    return success({ message: "Image deleted" });
  } catch (error) {
    console.error("Delete image error:", error);
    return failure("Failed to delete image");
  }
}

export async function setPrimaryImage(imageId: string, propertyId: string): Promise<ActionResponse> {
  try {
    await verifyPropertyOwnership(propertyId);

    await prisma.propertyImage.updateMany({
      where: { propertyId },
      data: { isPrimary: false },
    });

    await prisma.propertyImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    return success({ message: "Primary image set" });
  } catch (error) {
    console.error("Set primary error:", error);
    return failure("Failed to set primary image");
  }
}

export async function getPropertyImages(propertyId: string): Promise<ActionResponse> {
  try {
    await verifyPropertyOwnership(propertyId);

    const images = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { sortOrder: "asc" },
    });
    return success(images);
  } catch (error) {
    console.error("Get images error:", error);
    return failure("Failed to get images");
  }
}
