"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { startTrialForAgency, activateSubscription, suspendSubscription, expireSubscription, extendTrial } from "@/modules/subscription/actions";
import { Play, Ban, Plus, StopCircle, CreditCard, Clock, CheckCircle, XCircle } from "lucide-react";

interface Subscription {
  id: string;
  status: string;
  planName: string | null;
  startDate: string;
  endDate: string | null;
  activatedAt: string | null;
  trialEndsAt: string | null;
}

interface Props {
  agencyId: string;
  currentSubscription: Subscription | null;
  agencyName: string;
  agencyEmail: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  TRIAL: { label: "تجريبي", className: "bg-warning/10 text-warning", icon: Clock },
  ACTIVE: { label: "نشط", className: "bg-success/10 text-success", icon: CheckCircle },
  EXPIRED: { label: "منتهي", className: "bg-text-tertiary/10 text-text-tertiary", icon: XCircle },
  SUSPENDED: { label: "معلق", className: "bg-error/10 text-error", icon: Ban },
};

export function SubscriptionManager({ agencyId, currentSubscription, agencyName, agencyEmail }: Props) {
  const [subscription, setSubscription] = useState<Subscription | null>(currentSubscription);
  const [activateDialog, setActivateDialog] = useState(false);
  const [planName, setPlanName] = useState("الأساسي");
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const status = subscription?.status || "NONE";
  const cfg = STATUS_CONFIG[status];

  function showMsg(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleStartTrial() {
    setLoading(true);
    const result = await startTrialForAgency(agencyId);
    if (result.success) {
      const now = new Date();
      const trialEnds = new Date(now);
      trialEnds.setDate(trialEnds.getDate() + 14);
      setSubscription({
        id: (result as any).data?.id || "temp",
        status: "TRIAL",
        planName: null,
        startDate: now.toISOString(),
        endDate: null,
        activatedAt: null,
        trialEndsAt: trialEnds.toISOString(),
      });
      showMsg("success", "تم بدء الفترة التجريبية (14 يوم)");
    } else {
      showMsg("error", result.error || "حدث خطأ");
    }
    setLoading(false);
  }

  async function handleActivate() {
    setLoading(true);
    if (!subscription) return;
    const result = await activateSubscription(subscription.id, planName, endDate);
    if (result.success) {
      setSubscription((prev) => prev ? { ...prev, status: "ACTIVE", planName, activatedAt: new Date().toISOString(), endDate } : prev);
      setActivateDialog(false);
      showMsg("success", `تم تفعيل الاشتراك "${planName}" حتى ${new Date(endDate).toLocaleDateString("ar-DZ")}`);
    } else {
      showMsg("error", result.error || "حدث خطأ");
    }
    setLoading(false);
  }

  async function handleSuspend() {
    if (!subscription) return;
    setLoading(true);
    const result = await suspendSubscription(subscription.id);
    if (result.success) {
      setSubscription((prev) => prev ? { ...prev, status: "SUSPENDED" } : prev);
      showMsg("success", "تم تعليق الاشتراك");
    } else {
      showMsg("error", result.error || "حدث خطأ");
    }
    setLoading(false);
  }

  async function handleExpire() {
    if (!subscription) return;
    setLoading(true);
    const result = await expireSubscription(subscription.id);
    if (result.success) {
      setSubscription((prev) => prev ? { ...prev, status: "EXPIRED", endDate: new Date().toISOString() } : prev);
      showMsg("success", "تم إنهاء الاشتراك");
    } else {
      showMsg("error", result.error || "حدث خطأ");
    }
    setLoading(false);
  }

  async function handleExtendTrial(days: number) {
    if (!subscription) return;
    setLoading(true);
    const result = await extendTrial(subscription.id, days);
    if (result.success) {
      setSubscription((prev) => {
        if (!prev) return prev;
        const current = prev.trialEndsAt ? new Date(prev.trialEndsAt) : new Date();
        current.setDate(current.getDate() + days);
        return { ...prev, trialEndsAt: current.toISOString() };
      });
      showMsg("success", `تم تمديد الفترة التجريبية ${days} أيام`);
    } else {
      showMsg("error", result.error || "حدث خطأ");
    }
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          إدارة الاشتراك
        </h2>
        {cfg && (
          <Badge variant={status === "ACTIVE" ? "success" : status === "TRIAL" ? "warning" : status === "SUSPENDED" ? "destructive" : "secondary"}>
            <cfg.icon className="ml-1 h-3 w-3" />
            {cfg.label}
          </Badge>
        )}
      </div>

      {message && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${message.type === "success" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
          {message.text}
        </div>
      )}

      {status === "NONE" && (
        <div className="text-center py-6">
          <p className="text-sm text-text-secondary mb-4">هذه الوكالة ليس لديها اشتراك</p>
          <Button onClick={handleStartTrial} disabled={loading}>
            <Play className="ml-2 h-4 w-4" />
            بدء فترة تجريبية (14 يوم)
          </Button>
        </div>
      )}

      {status === "TRIAL" && (
        <div className="space-y-4">
          <div className="rounded-lg bg-warning/5 border border-warning/20 p-4">
            <p className="text-sm text-text-secondary">
              الفترة التجريبية تنتهي: <span className="font-medium text-text-primary">{subscription?.trialEndsAt ? new Date(subscription.trialEndsAt).toLocaleDateString("ar-DZ") : "—"}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setActivateDialog(true)} disabled={loading}>
              <Play className="ml-2 h-4 w-4" />
              تفعيل الاشتراك
            </Button>
            <Button variant="outline" onClick={() => handleExtendTrial(7)} disabled={loading}>
              <Plus className="ml-2 h-4 w-4" />
              تمديد 7 أيام
            </Button>
            <Button variant="outline" onClick={() => handleExtendTrial(14)} disabled={loading}>
              <Plus className="ml-2 h-4 w-4" />
              تمديد 14 يوم
            </Button>
          </div>
        </div>
      )}

      {status === "ACTIVE" && (
        <div className="space-y-4">
          <div className="rounded-lg bg-success/5 border border-success/20 p-4">
            <p className="text-sm text-text-secondary">
              الخطة: <span className="font-medium text-text-primary">{subscription?.planName || "—"}</span>
            </p>
            {subscription?.activatedAt && (
              <p className="text-sm text-text-secondary">
                فُعّل يوم: <span className="font-medium text-text-primary">{new Date(subscription.activatedAt).toLocaleDateString("ar-DZ")}</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive" onClick={handleSuspend} disabled={loading}>
              <Ban className="ml-2 h-4 w-4" />
              تعليق الاشتراك
            </Button>
            <Button variant="outline" onClick={handleExpire} disabled={loading}>
              <StopCircle className="ml-2 h-4 w-4" />
              إنهاء الاشتراك
            </Button>
          </div>
        </div>
      )}

      {status === "SUSPENDED" && (
        <div className="space-y-4">
          <div className="rounded-lg bg-error/5 border border-error/20 p-4">
            <p className="text-sm text-text-secondary">الاشتراك معلق حالياً</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setActivateDialog(true)} disabled={loading}>
              <Play className="ml-2 h-4 w-4" />
              إعادة تفعيل
            </Button>
            <Button variant="outline" onClick={handleExpire} disabled={loading}>
              <StopCircle className="ml-2 h-4 w-4" />
              إنهاء الاشتراك
            </Button>
          </div>
        </div>
      )}

      {status === "EXPIRED" && (
        <div className="text-center py-6">
          <p className="text-sm text-text-secondary mb-4">انتهت صلاحية الاشتراك</p>
          <Button onClick={() => setActivateDialog(true)} disabled={loading}>
            <Play className="ml-2 h-4 w-4" />
            تفعيل اشتراك جديد
          </Button>
        </div>
      )}

      <Dialog open={activateDialog} onOpenChange={setActivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تفعيل اشتراك {agencyName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسم الخطة</Label>
              <Input value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="الأساسي، المتقدم..." />
            </div>
            <div className="space-y-2">
              <Label>تاريخ انتهاء الاشتراك</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} dir="ltr" className="text-left" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivateDialog(false)}>إلغاء</Button>
            <Button onClick={handleActivate} disabled={loading}>
              {loading ? "جاري التفعيل..." : "تفعيل"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
