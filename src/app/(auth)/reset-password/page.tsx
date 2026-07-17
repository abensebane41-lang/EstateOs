"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Lock, CheckCircle, ArrowRight } from "lucide-react";

const AUTH_BASE = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005");

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">رابط غير صالح</CardTitle>
          <CardDescription>رابط إعادة التعيين غير صالح أو منتهي الصلاحية.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
            طلب رابط جديد
          </Link>
        </CardFooter>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${AUTH_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json();
        setError(data.error?.message || "حدث خطأ. حاول مرة أخرى.");
      }
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <CardTitle className="text-xl">تم تغيير كلمة المرور</CardTitle>
          <CardDescription>يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="inline-flex items-center text-sm text-primary hover:underline font-medium">
            تسجيل الدخول
            <ArrowRight className="mr-1 h-4 w-4" />
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">إعادة تعيين كلمة المرور</CardTitle>
        <CardDescription>أدخل كلمة المرور الجديدة</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور الجديدة</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              dir="ltr"
              minLength={8}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
            {!loading && <ArrowRight className="mr-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
