"use server";

import { prisma } from "@/shared/lib/prisma";
import { success, failure } from "@/server/actions/response";
import { getCurrentUser } from "@/shared/lib/auth-helpers";

async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function getSubscriptions() {
  try {
    await requireSuperAdmin();
    const subscriptions = await prisma.subscription.findMany({
      include: { agency: { select: { id: true, name: true, slug: true, email: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
    return success(subscriptions);
  } catch (error) {
    return failure("Failed to load subscriptions");
  }
}

export async function startTrialForAgency(agencyId: string) {
  try {
    await requireSuperAdmin();

    const existing = await prisma.subscription.findFirst({
      where: { agencyId, status: { in: ["TRIAL", "ACTIVE"] } },
    });
    if (existing) return failure("هذه الوكالة لديها اشتراك نشط بالفعل");

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const subscription = await prisma.subscription.create({
      data: {
        agencyId,
        status: "TRIAL",
        startDate: new Date(),
        trialEndsAt,
      },
    });

    await prisma.agencyNotification.create({
      data: {
        agencyId,
        type: "SUBSCRIPTION",
        title: "تم بدء الفترة التجريبية",
        message: "تم تفعيل فترة تجريبية لمدة 14 يوماً",
      },
    });

    return success(subscription);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") return failure("غير مصرح");
    return failure("Failed to start trial");
  }
}

export async function activateSubscription(subscriptionId: string, planName: string, endDate?: string) {
  try {
    await requireSuperAdmin();

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: "ACTIVE",
        planName,
        activatedAt: new Date(),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    await prisma.agencyNotification.create({
      data: {
        agencyId: subscription.agencyId,
        type: "SUBSCRIPTION",
        title: "تم تفعيل اشتراكك",
        message: `تم تفعيل اشتراك "${planName}" بنجاح`,
      },
    });

    try {
      const agency = await prisma.agency.findUnique({
        where: { id: subscription.agencyId },
        select: { name: true, email: true },
      });
      if (agency?.email) {
        const { sendEmail, subscriptionActivatedEmailHTML } = await import("@/shared/lib/email");
        await sendEmail({
          to: agency.email,
          subject: `تم تفعيل اشتراكك - ${planName}`,
          html: subscriptionActivatedEmailHTML({ agencyName: agency.name, planName }),
        });
      }
    } catch (emailError) {
      console.error("Failed to send subscription email:", emailError);
    }

    return success(subscription);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") return failure("غير مصرح");
    return failure("Failed to activate subscription");
  }
}

export async function suspendSubscription(subscriptionId: string) {
  try {
    await requireSuperAdmin();

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: "SUSPENDED" },
    });

    await prisma.agencyNotification.create({
      data: {
        agencyId: subscription.agencyId,
        type: "SUBSCRIPTION",
        title: "تم تعليق اشتراكك",
        message: "تم تعليق اشتراكك. يرجى التواصل مع الإدارة.",
      },
    });

    return success(subscription);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") return failure("غير مصرح");
    return failure("Failed to suspend subscription");
  }
}

export async function expireSubscription(subscriptionId: string) {
  try {
    await requireSuperAdmin();

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: "EXPIRED", endDate: new Date() },
    });

    await prisma.agencyNotification.create({
      data: {
        agencyId: subscription.agencyId,
        type: "SUBSCRIPTION",
        title: "انتهاء الاشتراك",
        message: "انتهت صلاحية اشتراكك. يرجى التجديد.",
      },
    });

    return success(subscription);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") return failure("غير مصرح");
    return failure("Failed to expire subscription");
  }
}

export async function extendTrial(subscriptionId: string, days: number) {
  try {
    await requireSuperAdmin();

    const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (!sub) return failure("Subscription not found");

    const currentEnd = sub.trialEndsAt || new Date();
    const newEnd = new Date(Math.max(currentEnd.getTime(), Date.now()));
    newEnd.setDate(newEnd.getDate() + days);

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { trialEndsAt: newEnd },
    });

    return success(subscription);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") return failure("غير مصرح");
    return failure("Failed to extend trial");
  }
}

export async function getAgencySubscriptions(agencyId: string) {
  try {
    await requireSuperAdmin();
    const subscriptions = await prisma.subscription.findMany({
      where: { agencyId },
      orderBy: { createdAt: "desc" },
    });
    return success(subscriptions);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") return failure("غير مصرح");
    return failure("Failed to load subscriptions");
  }
}
