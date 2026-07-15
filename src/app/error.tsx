"use client";

import { useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-error/10 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-error" />
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">حدث خطأ</h2>
      <p className="text-sm text-text-secondary mb-6 max-w-[28rem]">
        حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
      </p>
      <Button onClick={reset}>إعادة المحاولة</Button>
    </div>
  );
}
