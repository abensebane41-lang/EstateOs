"use server";

import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";
import { success, failure } from "@/server/actions/response";
import type { ActionResponse } from "@/shared/lib/errors";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

async function requireAgencyId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user?.agencyId) {
    throw new Error("يجب تسجيل الدخول أولاً");
  }
  return user.agencyId;
}

const updateAgencySchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  description: z.string().max(1000).optional(),
  logoUrl: z.string().url().optional(),
});

export async function getAgencyProfile(): Promise<ActionResponse> {
  try {
    const agencyId = await requireAgencyId();
    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      include: {
        _count: { select: { properties: true, leads: true, users: true } },
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    return success(agency);
  } catch (error) {
    console.error("Get agency error:", error);
    return failure("Failed to load agency profile");
  }
}

export async function updateAgencyProfile(data: {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
}): Promise<ActionResponse> {
  try {
    const parsed = updateAgencySchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });
      return failure("Validation failed", errors);
    }
    const agencyId = await requireAgencyId();
    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: parsed.data,
    });
    return success(agency);
  } catch (error) {
    console.error("Update agency error:", error);
    return failure("Failed to update agency profile");
  }
}

export async function getAgencyNotifications(): Promise<ActionResponse> {
  try {
    const agencyId = await requireAgencyId();
    const notifications = await prisma.agencyNotification.findMany({
      where: { agencyId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return success(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    return failure("Failed to load notifications");
  }
}

export async function markNotificationRead(id: string): Promise<ActionResponse> {
  try {
    const agencyId = await requireAgencyId();
    const notification = await prisma.agencyNotification.findUnique({ where: { id } });
    if (!notification) return failure("الإشعار غير موجود");
    if (notification.agencyId !== agencyId) return failure("غير مصرح");

    await prisma.agencyNotification.update({
      where: { id },
      data: { isRead: true },
    });
    return success({ message: "marked as read" });
  } catch (error) {
    return failure("Failed to mark notification");
  }
}

export async function markAllNotificationsRead(): Promise<ActionResponse> {
  try {
    const agencyId = await requireAgencyId();
    await prisma.agencyNotification.updateMany({
      where: { agencyId, isRead: false },
      data: { isRead: true },
    });
    return success({ message: "All marked as read" });
  } catch (error) {
    return failure("Failed to mark all notifications");
  }
}

export async function getUnreadNotificationCount() {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return success(0);
    const count = await prisma.agencyNotification.count({
      where: { agencyId: user.agencyId, isRead: false },
    });
    return success(count);
  } catch (error) {
    return failure("Failed to count notifications");
  }
}

export async function deleteAgency(agencyId: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return failure("غير مصرح — مدير النظام فقط");
    }

    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) return failure("الوكالة غير موجودة");

    await prisma.agency.delete({ where: { id: agencyId } });

    return success({ message: "تم حذف الوكالة بنجاح" });
  } catch (error) {
    console.error("Delete agency error:", error);
    return failure("فشل في حذف الوكالة");
  }
}
