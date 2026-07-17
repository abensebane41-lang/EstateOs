"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { addUser, deleteUser } from "@/modules/user/actions";
import { UserPlus, Trash2, Copy, Check, Eye, EyeOff } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
}

const roleLabels: Record<string, string> = {
  AGENCY_OWNER: "مالك الوكالة",
  AGENCY_AGENT: "مندوب",
  SUPER_ADMIN: "مدير النظام",
  CUSTOMER: "عميل",
};

const roleVariants: Record<string, "default" | "secondary" | "accent"> = {
  AGENCY_OWNER: "default",
  AGENCY_AGENT: "accent",
  SUPER_ADMIN: "secondary",
  CUSTOMER: "secondary",
};

export function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [addDialog, setAddDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ name: string; email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleAdd() {
    setLoading(true);
    setError("");
    const result = await addUser({ ...formData, role: "AGENCY_AGENT" });
    if (result.success) {
      const newUser = result.data as User;
      setUsers((prev) => [{ ...newUser, createdAt: new Date().toISOString() }, ...prev]);
      setSuccessInfo({ name: formData.name, email: formData.email, password: formData.password });
      setAddDialog(false);
      setFormData({ name: "", email: "", phone: "", password: "" });
    } else {
      setError(typeof result.error === "string" ? result.error : "خطأ في الإدخال");
    }
    setLoading(false);
  }

  function copyCredentials() {
    if (!successInfo) return;
    const text = `حسابك في EstateOS\nالبريد: ${successInfo.email}\nكلمة المرور: ${successInfo.password}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setAddDialog(true)}>
          <UserPlus className="ml-2 h-4 w-4" />
          إضافة مستخدم
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-right px-4 py-3 font-medium text-text-secondary">الاسم</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">البريد</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">الدور</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">الهاتف</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">تاريخ التسجيل</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-text-secondary">لا يوجد مستخدمين</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-medium">
                          {user.name.slice(0, 2)}
                        </div>
                        <span className="font-medium text-text-primary">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary" dir="ltr">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={roleVariants[user.role] || "secondary"}>{roleLabels[user.role] || user.role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-text-secondary" dir="ltr">{user.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{new Date(user.createdAt).toLocaleDateString("ar-DZ")}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="h-4 w-4 text-error" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>إضافة مستخدم جديد</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {error && <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{error}</div>}
            <div className="space-y-2">
              <Label>الاسم</Label>
              <Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="الاسم الكامل" />
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} placeholder="user@email.com" dir="ltr" className="text-left" />
            </div>
            <div className="space-y-2">
              <Label>كلمة المرور</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  placeholder="6 أحرف على الأقل"
                  dir="ltr"
                  className="text-left pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>الهاتف (اختياري)</Label>
              <Input value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} dir="ltr" className="text-left" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>إلغاء</Button>
            <Button onClick={handleAdd} disabled={loading || !formData.name || !formData.email || !formData.password}>
              {loading ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!successInfo} onOpenChange={() => setSuccessInfo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تمت الإضافة بنجاح</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">أرسل هذه البيانات للمستخدم عبر واتساب أو مكالمة:</p>
            <div className="rounded-xl border border-border bg-surface-secondary p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary">الاسم</span>
                <span className="text-sm font-medium text-text-primary">{successInfo?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary">البريد</span>
                <span className="text-sm font-medium text-text-primary" dir="ltr">{successInfo?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-text-secondary">كلمة المرور</span>
                <span className="text-sm font-mono font-medium text-text-primary" dir="ltr">{successInfo?.password}</span>
              </div>
            </div>
            <Button onClick={copyCredentials} variant="outline" className="w-full gap-2">
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              {copied ? "تم النسخ" : "نسخ البيانات"}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setSuccessInfo(null)}>حسناً</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
