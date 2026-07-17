import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function SuperAdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-surface-secondary p-4 mb-4">
        <FileQuestion className="h-12 w-12 text-text-tertiary" />
      </div>
      <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
      <h2 className="text-xl font-semibold text-text-primary mb-2">الصفحة غير موجودة</h2>
      <p className="text-sm text-text-secondary mb-6 max-w-[28rem]">
        الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link href="/super-admin">
        <Button>العودة للوحة التحكم</Button>
      </Link>
    </div>
  );
}
