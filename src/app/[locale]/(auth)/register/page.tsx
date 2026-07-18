"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { registerAgency } from "@/modules/auth/actions";
import { Building2, Camera, X } from "lucide-react";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    agencyName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  }

  function handleLogoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors({ logo: t("logoSizeError") });
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    if (errors.logo) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.logo;
        return next;
      });
    }
  }

  function removeLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadLogo(): Promise<string | null> {
    if (!logoFile) return null;
    setUploadingLogo(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", logoFile);
      const res = await fetch("/api/upload/logo", { method: "POST", body: formDataObj });
      const data = await res.json();
      if (res.ok && data.url) return data.url;
      return null;
    } catch {
      return null;
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: t("passwordMismatch") });
      return;
    }

    setLoading(true);

    try {
      let logoUrl: string | undefined = undefined;
      if (logoFile) {
        const uploaded = await uploadLogo();
        if (uploaded) logoUrl = uploaded;
      }

      const result = await registerAgency({
        agencyName: formData.agencyName,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        logoUrl,
      });

      if (result.success) {
        router.push("/login?registered=true");
      } else {
        if (result.errors) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(result.errors).forEach(([key, msgs]) => {
            fieldErrors[key] = msgs[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: result.error });
        }
      }
    } catch {
      setErrors({ general: t("unexpectedError") });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("registerTitle")}</CardTitle>
        <CardDescription>{t("registerSubtitle")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errors.general && (
            <div className="rounded-lg bg-error/10 p-3 text-sm text-error">
              {errors.general}
            </div>
          )}

          <div className="space-y-2">
            <Label>{t("logoLabel")}</Label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border transition-colors hover:border-primary/50"
              >
                {logoPreview ? (
                  <img src={logoPreview} alt={t("logoLabel")} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="h-5 w-5 text-text-tertiary" />
                    <span className="text-[10px] text-text-tertiary">{t("addLogo")}</span>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleLogoSelect}
              />
              <div className="flex-1">
                <p className="text-sm text-text-secondary">{t("logoDesc")}</p>
                <p className="text-xs text-text-tertiary">{t("logoHint")}</p>
                <p className="text-xs text-text-tertiary">{t("logoFormats")}</p>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="mt-1 flex items-center gap-1 text-xs text-error hover:underline"
                  >
                    <X className="h-3 w-3" />
                    {t("removeLogo")}
                  </button>
                )}
              </div>
            </div>
            {errors.logo && <p className="text-xs text-error">{errors.logo}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="agencyName">{t("agencyNameLabel")}</Label>
            <Input
              id="agencyName"
              name="agencyName"
              placeholder={t("agencyNamePlaceholder")}
              value={formData.agencyName}
              onChange={handleChange}
              required
            />
            {errors.agencyName && <p className="text-xs text-error">{errors.agencyName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">{t("fullNameLabel")}</Label>
            <Input
              id="name"
              name="name"
              placeholder={t("fullNamePlaceholder")}
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="text-xs text-error">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailLabel")} *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={formData.email}
              onChange={handleChange}
              required
              dir="ltr"
              className="text-left"
            />
            {errors.email && <p className="text-xs text-error">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phoneLabel")}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder={t("phonePlaceholder")}
              value={formData.phone}
              onChange={handleChange}
              required
              dir="ltr"
              className="text-left"
            />
            {errors.phone && <p className="text-xs text-error">{errors.phone}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("passwordLabel")} *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("passwordPlaceholderRegister")}
              value={formData.password}
              onChange={handleChange}
              required
              dir="ltr"
            />
            {errors.password && <p className="text-xs text-error">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              dir="ltr"
            />
            {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={loading || uploadingLogo}>
            {uploadingLogo ? t("logoUploadLoading") : loading ? t("registerLoading") : t("registerButton")}
          </Button>
          <p className="text-sm text-text-secondary">
            {t("hasAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              {t("loginNow")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
