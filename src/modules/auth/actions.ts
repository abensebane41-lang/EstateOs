"use server";

import { auth } from "@/modules/auth/auth";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";
import { success, failure } from "@/server/actions/response";
import type { ActionResponse } from "@/shared/lib/errors";
import { slugify } from "@/shared/lib/utils";

const registerSchema = z.object({
  agencyName: z.string().min(2, "اسم الوكالة مطلوب"),
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(8, "رقم الهاتف مطلوب"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  logoUrl: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export async function registerAgency(data: z.infer<typeof registerSchema>): Promise<ActionResponse> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    });
    return failure("Validation failed", errors);
  }

  const { agencyName, name, email, phone, password, logoUrl } = parsed.data;

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    const slug = slugify(agencyName) || `agency-${Date.now()}`;
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.agency.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const agency = await prisma.agency.create({
      data: {
        name: agencyName,
        slug: finalSlug,
        phone,
        email,
        logoUrl: logoUrl || null,
        users: {
          connect: { id: result.user.id },
        },
      },
    });

    await prisma.user.update({
      where: { id: result.user.id },
      data: {
        agencyId: agency.id,
        role: "AGENCY_OWNER",
      },
    });

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    await prisma.subscription.create({
      data: {
        agencyId: agency.id,
        status: "TRIAL",
        startDate: new Date(),
        trialEndsAt,
      },
    });

    try {
      const { sendEmail, welcomeEmailHTML } = await import("@/shared/lib/email");
      await sendEmail({
        to: email,
        subject: `مرحباً بك في EstateOS - ${agencyName}`,
        html: welcomeEmailHTML(agencyName),
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return success({ message: "تم إنشاء الحساب بنجاح" });
  } catch (error) {
    console.error("Registration error:", error);
    return failure("حدث خطأ أثناء إنشاء الحساب");
  }
}

export async function loginAgency(data: z.infer<typeof loginSchema>): Promise<ActionResponse> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    });
    return failure("Validation failed", errors);
  }

  const { email, password } = parsed.data;

  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return success({
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return failure("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }
}

export async function logoutAction(): Promise<ActionResponse> {
  try {
    await auth.api.signOut({
      headers: await (await import("next/headers")).headers(),
    });
    return success({ message: "تم تسجيل الخروج بنجاح" });
  } catch (error) {
    console.error("Logout error:", error);
    return failure("حدث خطأ أثناء تسجيل الخروج");
  }
}

export async function changePassword(data: { currentPassword: string; newPassword: string }): Promise<ActionResponse> {
  const schema = z.object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  });

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return failure("بيانات غير صحيحة");
  }

  try {
    const headers = await (await import("next/headers")).headers();
    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      return failure("يجب تسجيل الدخول أولاً");
    }

    const { currentPassword, newPassword } = parsed.data;

    const result = await auth.api.changePassword({
      headers,
      body: { currentPassword, newPassword },
    });

    return success({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    console.error("Change password error:", error);
    return failure("كلمة المرور الحالية غير صحيحة");
  }
}
