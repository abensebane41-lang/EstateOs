"use server";

import { prisma } from "@/shared/lib/prisma";
import { success, failure } from "@/server/actions/response";
import type { ActionResponse } from "@/shared/lib/errors";

export async function addPropertyImage(
  propertyId: string,
  url: string,
  altText?: string,
  isPrimary?: boolean
): Promise<ActionResponse> {
  try {
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
    await prisma.propertyImage.delete({ where: { id: imageId } });
    return success({ message: "Image deleted" });
  } catch (error) {
    console.error("Delete image error:", error);
    return failure("Failed to delete image");
  }
}

export async function setPrimaryImage(imageId: string, propertyId: string): Promise<ActionResponse> {
  try {
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
