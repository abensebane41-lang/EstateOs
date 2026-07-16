"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function SuspendedPage({
  agencyName,
  status,
  endDate,
}: {
  agencyName: string;
  status: string;
  endDate?: string | null;
}) {
  const isSuspended = status === "SUSPENDED";
  const isExpired = status === "EXPIRED";

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error/10">
          <svg
            className="h-10 w-10 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-xl font-bold text-text-primary">
          {isSuspended ? "تم توقّف حسابك" : "اشتراكك منتهي"}
        </h1>
        <p className="mb-1 text-sm text-text-secondary">
          {agencyName}
        </p>

        <div className="my-4 rounded-xl bg-surface-secondary p-4">
          <p className="text-sm text-text-secondary">
            {isSuspended
              ? "تم توقّف اشتراكك من قبل الإدارة. يرجى التواصل معنا لاستعادة الحساب."
              : "انتهت صلاحية اشتراكك. يرجى تجديد الاشتراك لمواصلة الاستخدام."}
          </p>
          {endDate && (
            <p className="mt-2 text-xs text-text-tertiary">
              تاريخ الانتهاء: {new Date(endDate).toLocaleDateString("ar-DZ")}
            </p>
          )}
        </div>

        <p className="mb-6 text-sm text-text-secondary">
          يمكنك التواصل مع الإدارة عبر البريد الإلكتروني أو الهاتف لتجديد اشتراكك.
        </p>

        <a href="/login" className="block">
          <Button className="w-full gap-2" variant="outline">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </a>
      </div>
    </div>
  );
}
