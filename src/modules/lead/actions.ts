"use server";

import { prisma } from "@/shared/lib/prisma";
import { success, failure } from "@/server/actions/response";
import type { ActionResponse } from "@/shared/lib/errors";
import { z } from "zod";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

export async function getLeads(
  filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");

    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { agencyId: user.agencyId };

    if (filters?.status && filters.status !== "ALL") {
      where.status = filters.status;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { phone: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true, name: true, email: true, phone: true, message: true,
          status: true, source: true, notes: true, createdAt: true, updatedAt: true,
          property: { select: { id: true, title: true, city: true } },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return success({
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get leads error:", error);
    return failure("حدث خطأ أثناء جلب العملاء المحتملين");
  }
}

export async function getLeadById(id: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!lead) return failure("العميل المحتمل غير موجود");
    if (lead.agencyId !== user.agencyId) return failure("غير مصرح");

    return success(lead);
  } catch (error) {
    console.error("Get lead error:", error);
    return failure("حدث خطأ أثناء جلب العميل المحتمل");
  }
}

export async function updateLeadStatus(
  id: string,
  status: string
): Promise<ActionResponse> {
  try {
    const statusResult = allowedLeadStatuses.safeParse(status);
    if (!statusResult.success) return failure("الحالة غير صحيحة");

    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return failure("العميل المحتمل غير موجود");
    if (existing.agencyId !== user.agencyId) return failure("غير مصرح");

    const lead = await prisma.lead.update({
      where: { id },
      data: { status: statusResult.data },
    });

    return success(lead);
  } catch (error) {
    console.error("Update lead status error:", error);
    return failure("حدث خطأ أثناء تحديث حالة العميل");
  }
}

export async function updateLeadNotes(
  id: string,
  notes: string
): Promise<ActionResponse> {
  try {
    if (typeof notes !== "string" || notes.length > 5000) return failure("الملاحظات غير صحيحة");

    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return failure("العميل المحتمل غير موجود");
    if (existing.agencyId !== user.agencyId) return failure("غير مصرح");

    const lead = await prisma.lead.update({
      where: { id },
      data: { notes },
    });

    return success(lead);
  } catch (error) {
    console.error("Update lead notes error:", error);
    return failure("حدث خطأ أثناء تحديث ملاحظات العميل");
  }
}

export async function deleteLead(id: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user?.agencyId) return failure("يجب تسجيل الدخول أولاً");

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return failure("العميل المحتمل غير موجود");
    if (existing.agencyId !== user.agencyId) return failure("غير مصرح");

    await prisma.lead.delete({ where: { id } });
    return success({ message: "تم حذف العميل المحتمل بنجاح" });
  } catch (error) {
    console.error("Delete lead error:", error);
    return failure("حدث خطأ أثناء حذف العميل المحتمل");
  }
}

const contactSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().optional(),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
  propertyId: z.string().optional(),
  agencyId: z.string().min(1, "الوكالة مطلوبة"),
});

const allowedLeadStatuses = z.enum(["NEW", "CONTACTED", "QUALIFIED", "NEGOTIATING", "WON", "LOST"]);

export async function createLead(data: z.infer<typeof contactSchema>): Promise<ActionResponse> {
  const parsed = contactSchema.safeParse(data);
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
    const agencyExists = await prisma.agency.findUnique({
      where: { id: parsed.data.agencyId },
      select: { id: true },
    });
    if (!agencyExists) return failure("الوكالة غير موجودة");

    const lead = await prisma.lead.create({
      data: {
        agencyId: parsed.data.agencyId,
        propertyId: parsed.data.propertyId || null,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
        source: "WEBSITE",
      },
    });

    await prisma.agencyNotification.create({
      data: {
        agencyId: parsed.data.agencyId,
        type: "LEAD",
        title: "عميل محتمل جديد",
        message: `تلقيت رسالة جديدة من ${parsed.data.name}`,
        link: `/dashboard/leads`,
      },
    });

    try {
      const agency = await prisma.agency.findUnique({
        where: { id: parsed.data.agencyId },
        select: { name: true, email: true },
      });
      if (agency?.email) {
        const { sendEmail, newLeadEmailHTML } = await import("@/shared/lib/email");
        const property = parsed.data.propertyId
          ? await prisma.property.findUnique({ where: { id: parsed.data.propertyId }, select: { title: true } })
          : null;
        await sendEmail({
          to: agency.email,
          subject: `عميل محتمل جديد - ${parsed.data.name}`,
          html: newLeadEmailHTML({
            agencyName: agency.name,
            leadName: parsed.data.name,
            leadEmail: parsed.data.email,
            leadPhone: parsed.data.phone || undefined,
            propertyName: property?.title,
            message: parsed.data.message || undefined,
          }),
        });
      }
    } catch (emailError) {
      console.error("Failed to send lead notification email:", emailError);
    }

    return success({ message: "تم إرسال رسالتك بنجاح", id: lead.id });
  } catch (error) {
    console.error("Create lead error:", error);
    return failure("حدث خطأ أثناء إرسال الرسالة");
  }
}
