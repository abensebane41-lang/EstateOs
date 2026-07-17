import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/shared/lib/prisma";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const isPostgres = dbUrl.startsWith("postgresql") || dbUrl.startsWith("postgres");
const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  database: prismaAdapter(prisma, {
    provider: isPostgres ? "postgresql" : "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }: { user: { name: string; email: string }; url: string; token: string }) => {
      console.log(`[Auth] Password reset requested for ${user.email}, url: ${url.substring(0, 40)}...`);
      try {
        const emailModule = await import("@/shared/lib/email");
        const result = await emailModule.sendEmail({
          to: user.email,
          subject: "إعادة تعيين كلمة المرور - EstateOS",
          html: `<div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0F2747;">إعادة تعيين كلمة المرور</h2>
            <p>مرحباً ${user.name},</p>
            <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاص بك. اضغط على الرابط أدناه:</p>
            <a href="${url}" style="display: inline-block; background: #0F2747; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">إعادة التعيين</a>
            <p style="color: #666; font-size: 14px;">إذا لم تطلب هذا، تجاهل هذه الرسالة.</p>
          </div>`,
        });
        console.log(`[Auth] Reset email result:`, JSON.stringify(result));
      } catch (e: any) {
        console.error("[Auth] Failed to send reset email:", e?.message || e);
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "AGENCY_OWNER",
      },
      agencyId: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
});
