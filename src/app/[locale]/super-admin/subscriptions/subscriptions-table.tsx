"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { activateSubscription, suspendSubscription, expireSubscription, extendTrial } from "@/modules/subscription/actions";
import { CheckCircle, XCircle, Clock, Play, Ban, Plus, StopCircle } from "lucide-react";

interface Subscription {
  id: string;
  agencyId: string;
  status: string;
  planName: string | null;
  startDate: string;
  endDate: string | null;
  activatedAt: string | null;
  trialEndsAt: string | null;
  agency: { id: string; name: string; slug: string; email: string | null; phone: string | null };
}

const statusConfig: Record<string, { label: string; className: string; icon: typeof CheckCircle }> = {
  TRIAL: { label: "تجريبي", className: "bg-warning/10 text-warning", icon: Clock },
  ACTIVE: { label: "نشط", className: "bg-success/10 text-success", icon: CheckCircle },
  EXPIRED: { label: "منتهي", className: "bg-text-tertiary/10 text-text-tertiary", icon: XCircle },
  SUSPENDED: { label: "معلق", className: "bg-error/10 text-error", icon: Ban },
};

export function SubscriptionsTable({ initialSubscriptions }: { initialSubscriptions: Subscription[] }) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [activateDialog, setActivateDialog] = useState<string | null>(null);
  const [planName, setPlanName] = useState("الأساسي");
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState<string | null>(null);

  async function handleActivate(subId: string) {
    setLoading(subId);
    await activateSubscription(subId, planName, endDate);
    setSubscriptions((prev) => prev.map((s) => s.id === subId ? { ...s, status: "ACTIVE", planName, activatedAt: new Date().toISOString(), endDate } : s));
    setActivateDialog(null);
    setPlanName("الأساسي");
    setLoading(null);
  }

  async function handleSuspend(subId: string) {
    setLoading(subId);
    await suspendSubscription(subId);
    setSubscriptions((prev) => prev.map((s) => s.id === subId ? { ...s, status: "SUSPENDED" } : s));
    setLoading(null);
  }

  async function handleExpire(subId: string) {
    setLoading(subId);
    await expireSubscription(subId);
    setSubscriptions((prev) => prev.map((s) => s.id === subId ? { ...s, status: "EXPIRED", endDate: new Date().toISOString() } : s));
    setLoading(null);
  }

  async function handleExtendTrial(subId: string, days: number) {
    setLoading(subId);
    await extendTrial(subId, days);
    setSubscriptions((prev) => prev.map((s) => {
      if (s.id !== subId) return s;
      const current = s.trialEndsAt ? new Date(s.trialEndsAt) : new Date();
      current.setDate(current.getDate() + days);
      return { ...s, trialEndsAt: current.toISOString() };
    }));
    setLoading(null);
  }

  return (
    <div>
      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-right px-4 py-3 font-medium text-text-secondary">الوكالة</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">الحالة</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">الخطة</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">تاريخ البداية</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">ينتهي</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.map((sub) => {
                const cfg = statusConfig[sub.status] || statusConfig.TRIAL;
                const Icon = cfg.icon;
                return (
                  <tr key={sub.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-primary">{sub.agency.name}</p>
                      <p className="text-xs text-text-tertiary">{sub.agency.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={sub.status === "ACTIVE" ? "success" : sub.status === "TRIAL" ? "warning" : sub.status === "SUSPENDED" ? "destructive" : "secondary"}>
                        <Icon className="ml-1 h-3 w-3" />
                        {cfg.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{sub.planName ?? "—"}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{new Date(sub.startDate).toLocaleDateString("ar-DZ")}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {sub.status === "TRIAL" && sub.trialEndsAt
                        ? new Date(sub.trialEndsAt).toLocaleDateString("ar-DZ")
                        : sub.endDate
                        ? new Date(sub.endDate).toLocaleDateString("ar-DZ")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {(sub.status === "TRIAL" || sub.status === "SUSPENDED") && (
                          <>
                            <Button size="sm" variant="default" onClick={() => setActivateDialog(sub.id)} disabled={loading === sub.id}>
                              <Play className="ml-1 h-3 w-3" /> تفعيل
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleExtendTrial(sub.id, 7)} disabled={loading === sub.id}>
                              <Plus className="ml-1 h-3 w-3" /> +7 أيام
                            </Button>
                          </>
                        )}
                        {sub.status === "ACTIVE" && (
                          <>
                            <Button size="sm" variant="destructive" onClick={() => handleSuspend(sub.id)} disabled={loading === sub.id}>
                              <Ban className="ml-1 h-3 w-3" /> تعليق
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleExpire(sub.id)} disabled={loading === sub.id}>
                              <StopCircle className="ml-1 h-3 w-3" /> إنهاء
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-text-secondary">لا توجد اشتراكات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!activateDialog} onOpenChange={() => setActivateDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تفعيل الاشتراك</DialogTitle>
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
            <Button variant="outline" onClick={() => setActivateDialog(null)}>إلغاء</Button>
            <Button onClick={() => activateDialog && handleActivate(activateDialog)} disabled={loading === activateDialog}>
              {loading === activateDialog ? "جاري التفعيل..." : "تفعيل"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
