"use server";

import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";
import { success, failure } from "@/server/actions/response";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

const addUserSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().optional(),
  role: z.enum(["AGENCY_OWNER", "AGENCY_AGENT"], { message: "الدور غير صحيح" }),
});

export async function getAgencyUsers() {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");

    const users = await prisma.user.findMany({
      where: { agencyId: user.agencyId },
      select: { id: true, name: true, email: true, role: true, phone: true, avatarUrl: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return success(users);
  } catch (error) {
    return failure("Failed to load users");
  }
}

export async function addUser(data: z.infer<typeof addUserSchema>) {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");
    if (user.role !== "AGENCY_OWNER" && user.role !== "SUPER_ADMIN") {
      return failure("غير مصرح — المالك فقط يضيف مستخدمين");
    }

    const parsed = addUserSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });
      return failure("Validation failed", errors);
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return failure("البريد الإلكتروني مستخدم بالفعل");

    const tempPassword = Math.random().toString(36).slice(-12) + "A1!";
    const newUser = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        role: parsed.data.role,
        agencyId: user.agencyId,
        password: tempPassword,
      },
      select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });
    return success(newUser);
  } catch (error) {
    return failure("Failed to add user");
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");
    if (user.role !== "AGENCY_OWNER" && user.role !== "SUPER_ADMIN") {
      return failure("غير مصرح — المالك فقط يعدّل الأدوار");
    }

    const target = await prisma.user.findUnique({ where: { id: userId }, select: { agencyId: true } });
    if (!target) return failure("المستخدم غير موجود");
    if (target.agencyId !== user.agencyId) return failure("غير مصرح");

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    return success(updated);
  } catch (error) {
    return failure("Failed to update user role");
  }
}

export async function deleteUser(userId: string) {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");
    if (user.role !== "AGENCY_OWNER" && user.role !== "SUPER_ADMIN") {
      return failure("غير مصرح — المالك فقط يحذف المستخدمين");
    }

    const target = await prisma.user.findUnique({ where: { id: userId }, select: { agencyId: true, role: true } });
    if (!target) return failure("المستخدم غير موجود");
    if (target.agencyId !== user.agencyId) return failure("غير مصرح");
    if (target.role === "SUPER_ADMIN") return failure("لا يمكن حذف مدير النظام");

    await prisma.user.delete({ where: { id: userId } });
    return success({ message: "User deleted" });
  } catch (error) {
    return failure("Failed to delete user");
  }
}
