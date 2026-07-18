"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { updateAgencyProfile } from "@/modules/agency/actions";
import { Save, Building2, CreditCard, Users, Home, Globe, Copy, Check, Upload, X, Lock, Languages } from "lucide-react";
import { changePassword } from "@/modules/auth/actions";
import { updateAgencyLocale } from "@/modules/agency/actions";

interface AgencyData {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  description: string | null;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  createdAt: string;
  _count: { properties: number; leads: number };
  subscriptions: Array<{ status: string; trialEndsAt: string | null; startDate: string }>;
}

export function SettingsForm({ agency }: { agency: AgencyData }) {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(agency.logoUrl);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formData, setFormData] = useState({
    name: agency.name || "",
    phone: agency.phone || "",
    email: agency.email || "",
    address: agency.address || "",
    description: agency.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedLocale, setSelectedLocale] = useState(locale);

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/agency/${agency.slug}`
    : `/agency/${agency.slug}`;

  function copyPublicUrl() {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function removeLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadLogoToStorage(): Promise<string | null> {
    if (!logoFile) return null;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", logoFile);
      const res = await fetch("/api/upload/logo", { method: "POST", body: fd });
      const data = await res.json();
      return res.ok && data.url ? data.url : null;
    } catch { return null; }
    finally { setUploadingLogo(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let logoUrl: string | undefined = undefined;
      if (logoFile) {
        const uploaded = await uploadLogoToStorage();
        if (uploaded) logoUrl = uploaded;
      }
      const result = await updateAgencyProfile({ ...formData, logoUrl });
      if (result.success) {
        setMessage({ type: "success", text: t("profileSaved") });
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch {
      setMessage({ type: "error", text: t("profileSaveError") });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: t("passwordMismatch") });
      setPasswordSaving(false);
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (result.success) {
        setPasswordMessage({ type: "success", text: t("passwordChanged") });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordMessage({ type: "error", text: result.error });
      }
    } catch {
      setPasswordMessage({ type: "error", text: t("passwordChangeError") });
    } finally {
      setPasswordSaving(false);
    }
  }

  function handleLocaleChange(newLocale: string) {
    setSelectedLocale(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    updateAgencyLocale(newLocale as "ar" | "fr").catch(() => {});
    router.refresh();
  }

  const subscription = agency.subscriptions[0];
  const trialEndsAt = subscription?.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
  const isTrialExpired = trialEndsAt ? trialEndsAt < new Date() : false;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">{t("propertiesCount")}</p>
            <p className="text-xl font-bold text-text-primary">{agency._count.properties}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
          <div className="rounded-lg bg-accent/10 p-3">
            <Users className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">{t("leadsCount")}</p>
            <p className="text-xl font-bold text-text-primary">{agency._count.leads}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
          <div className="rounded-lg bg-success/10 p-3">
            <CreditCard className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-text-secondary">{t("subscription")}</p>
            <Badge variant={subscription?.status === "TRIAL" ? "warning" : subscription?.status === "ACTIVE" ? "success" : "secondary"}>
              {subscription?.status === "TRIAL" ? t("trial") : subscription?.status === "ACTIVE" ? t("active") : subscription?.status === "EXPIRED" ? t("expired") : t("suspended")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-accent/20 bg-accent/5 p-6">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Globe className="h-5 w-5 text-accent" />
          {t("publicUrl")}
        </h3>
        <p className="mb-4 text-sm text-text-secondary">{t("publicUrlDesc")}</p>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg border border-border bg-white px-4 py-2.5 font-mono text-sm text-text-primary" dir="ltr">
            {publicUrl}
          </div>
          <Button onClick={copyPublicUrl} variant={copied ? "default" : "outline"} className="shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="mr-2">{copied ? t("copiedLink") : t("copyLink")}</span>
          </Button>
          <a href={`/agency/${agency.slug}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="shrink-0">
              <Globe className="h-4 w-4" />
              <span className="mr-2">{t("openLink")}</span>
            </Button>
          </a>
        </div>
      </div>

      {subscription && (
        <div className="rounded-xl border border-border bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
            <CreditCard className="h-5 w-5" />
            {t("subscriptionInfo")}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-text-secondary">{tCommon("status")}</p>
              <Badge variant={subscription.status === "TRIAL" ? "warning" : subscription.status === "ACTIVE" ? "success" : "secondary"}>
                {subscription.status === "TRIAL" ? t("trial") : subscription.status === "ACTIVE" ? t("active") : t("expired")}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-text-secondary">{t("startDate")}</p>
              <p className="text-sm font-medium text-text-primary">
                {new Date(subscription.startDate).toLocaleDateString("ar-DZ")}
              </p>
            </div>
            {trialEndsAt && (
              <div>
                <p className="text-sm text-text-secondary">{t("trialEnds")}</p>
                <p className={`text-sm font-medium ${isTrialExpired ? "text-error" : "text-text-primary"}`}>
                  {trialEndsAt.toLocaleDateString("ar-DZ")}
                  {isTrialExpired && ` ${t("expiredParentheses")}`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Upload className="h-5 w-5" />
          {t("uploadLogo")}
        </h3>
        <div className="flex items-center gap-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border transition-colors hover:border-primary/50"
          >
            {logoPreview ? (
              <>
                <img src={logoPreview} alt={t("uploadLogo")} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeLogo(); }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <Upload className="h-6 w-6 text-text-tertiary" />
            )}
          </div>
          <div>
            <p className="text-sm text-text-secondary">{t("uploadLogoHint")}</p>
            <p className="text-xs text-text-tertiary">{t("uploadLogoFormats")}</p>
            {uploadingLogo && <p className="mt-1 text-xs text-accent">{t("uploadLogoLoading")}</p>}
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleLogoSelect} />
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Building2 className="h-5 w-5" />
          {t("agencyProfile")}
        </h3>

        {message && (
          <div className={`mb-4 rounded-lg p-3 text-sm ${message.type === "success" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("agencyNameLabel")}</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phoneLabel")}</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} dir="ltr" className="text-left" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} dir="ltr" className="text-left" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t("addressLabel")}</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("agencyDescriptionLabel")}</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} placeholder={t("descriptionPlaceholder")} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="ml-2 h-4 w-4" />
            {saving ? t("saveProfileLoading") : t("saveProfile")}
          </Button>
        </div>
      </form>

      <form onSubmit={handlePasswordChange} className="rounded-xl border border-border bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Lock className="h-5 w-5" />
          {t("changePassword")}
        </h3>

        {passwordMessage && (
          <div className={`mb-4 rounded-lg p-3 text-sm ${passwordMessage.type === "success" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
            {passwordMessage.text}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
            <Input id="currentPassword" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))} required dir="ltr" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("newPassword")}</Label>
              <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))} required dir="ltr" minLength={8} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmNewPassword")}</Label>
              <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))} required dir="ltr" minLength={8} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={passwordSaving} variant="outline">
            <Lock className="ml-2 h-4 w-4" />
            {passwordSaving ? t("updatePasswordLoading") : t("updatePassword")}
          </Button>
        </div>
      </form>

      <div className="rounded-xl border border-border bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
          <Languages className="h-5 w-5" />
          {t("language")}
        </h3>
        <div className="space-y-3">
          <div>
            <Label>{t("language")}</Label>
            <select
              value={selectedLocale}
              onChange={(e) => handleLocaleChange(e.target.value)}
              className="mt-1 flex h-10 w-full max-w-xs rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            >
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">{t("accountInfo")}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{t("accountId")}</span>
            <span className="font-mono text-xs text-text-tertiary">{agency.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{t("slug")}</span>
            <span className="text-sm text-text-primary">{agency.slug}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{t("createdAt")}</span>
            <span className="text-sm text-text-primary">{new Date(agency.createdAt).toLocaleDateString("ar-DZ")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
