"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { createLead } from "@/modules/lead/actions";
import { Send, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ContactFormProps {
  agencyId: string;
  propertyId?: string;
  propertyName?: string;
}

export function ContactForm({ agencyId, propertyId, propertyName }: ContactFormProps) {
  const t = useTranslations("property");
  const defaultMessage = propertyName ? t("defaultMessage", { name: propertyName }) : "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: defaultMessage,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => { const next = { ...prev }; delete next[e.target.name]; return next; });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await createLead({ ...formData, agencyId, propertyId });

    if (result.success) {
      setSuccess(true);
    } else {
      if (result.errors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(result.errors).forEach(([key, msgs]) => { fieldErrors[key] = msgs[0]; });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: result.error });
      }
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-success/20 bg-success/5 p-6 text-center">
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-success" />
        <h3 className="text-lg font-semibold text-text-primary mb-1">{t("contactSuccessTitle")}</h3>
        <p className="text-sm text-text-secondary">{t("contactSuccessDesc")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="rounded-lg bg-error/10 p-3 text-sm text-error">{errors.general}</div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">{t("fullName")}</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder={t("fullNamePlaceholder")} required />
        {errors.name && <p className="text-xs text-error">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" required dir="ltr" className="text-left" />
        {errors.email && <p className="text-xs text-error">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t("phoneLabel")}</Label>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+213 xxx xxx xxx" dir="ltr" className="text-left" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("messageLabel")}</Label>
        <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} required />
        {errors.message && <p className="text-xs text-error">{errors.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        <Send className="ml-2 h-4 w-4" />
        {loading ? t("sending") : t("sendMessage")}
      </Button>
    </form>
  );
}
