"use server";

import { prisma } from "@/shared/lib/prisma";
import { success, failure } from "@/server/actions/response";

export async function toggleFavorite(userId: string, propertyId: string) {
  try {
    const existing = await prisma.propertyFavorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });

    if (existing) {
      await prisma.propertyFavorite.delete({ where: { id: existing.id } });
      return success({ favorited: false });
    } else {
      await prisma.propertyFavorite.create({ data: { userId, propertyId } });
      return success({ favorited: true });
    }
  } catch (error) {
    return failure("Failed to toggle favorite");
  }
}

export async function isFavorited(userId: string, propertyId: string) {
  try {
    const existing = await prisma.propertyFavorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });
    return success({ favorited: !!existing });
  } catch (error) {
    return success({ favorited: false });
  }
}

export async function getUserFavorites(userId: string) {
  try {
    const favorites = await prisma.propertyFavorite.findMany({
      where: { userId },
      include: { property: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
      orderBy: { createdAt: "desc" },
    });
    return success(favorites.map((f) => f.property));
  } catch (error) {
    return failure("Failed to load favorites");
  }
}

export async function getFavoriteCount(propertyId: string) {
  try {
    const count = await prisma.propertyFavorite.count({ where: { propertyId } });
    return success(count);
  } catch (error) {
    return success(0);
  }
}
