"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

const AUTH_BASE = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005");

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${AUTH_BASE}/api/auth/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirectTo: `${AUTH_BASE}/reset-password` }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        let msg = "حدث خطأ. حاول مرة أخرى.";
        try {
          const data = await res.json();
          msg = data.error?.message || data.message || `خطأ ${res.status}`;
        } catch {
          msg = `خطأ في الخادم (${res.status})`;
        }
        setError(msg);
      }
    } catch (e: any) {
      setError(e?.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <CardTitle className="text-xl">تم الإرسال</CardTitle>
          <CardDescription>
            إذا كان البريد الإلكتروني <span className="font-medium text-text-primary">{email}</span> مسجلاً، ستتلقى رابطاً لإعادة تعيين كلمة المرور.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <Link href="/login" className="text-sm text-primary hover:underline font-medium">
            العودة لتسجيل الدخول
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">نسيت كلمة المرور؟</CardTitle>
        <CardDescription>أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="text-left"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
            {!loading && <ArrowRight className="mr-2 h-4 w-4" />}
          </Button>
          <p className="text-sm text-text-secondary">
            تذكرت كلمة المرور؟{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              تسجيل الدخول
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
