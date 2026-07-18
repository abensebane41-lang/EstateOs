"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { updateProperty, deleteProperty } from "@/modules/property/actions";
import { WILAYAS } from "@/shared/data/algeria";
import { PriceInput } from "@/shared/components/shared/price-input";
import { Plus, X, Star, Phone, Video } from "lucide-react";

const SELECT_CLASSES =
  "flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1";

const HIDE_BEDROOMS = ["LAND", "COMMERCIAL", "WAREHOUSE"];
const HIDE_FLOOR = ["LAND", "COMMERCIAL", "WAREHOUSE"];

interface PropertyFormProps {
  property: {
    id: string;
    title: string;
    description: string;
    propertyType: string;
    listingType?: string;
    status: string;
    price: number;
    currency: string;
    bedrooms: number | null;
    area: number;
    address: string;
    city: string;
    state: string | null;
    agentPhone?: string | null;
    videoUrl?: string | null;
    floor?: number | null;
    images?: { id: string; url: string; isPrimary: boolean; altText?: string | null }[];
  };
  mode: "edit" | "view";
}

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter();
  const t = useTranslations("dashboard");
  const tPropertyTypes = useTranslations("propertyTypes");
  const tProperty = useTranslations("property");
  const tCommon = useTranslations("common");
  const tConfirmation = useTranslations("confirmation");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [existingImages, setExistingImages] = useState(property.images || []);
  const [newImages, setNewImages] = useState<{ file: File; preview: string; isPrimary: boolean }[]>([]);
  const initialWilayaCode = property.state ? (WILAYAS.find((w) => w.name === property.state)?.code || "") : "";
  const [form, setForm] = useState({
    title: property.title,
    description: property.description,
    propertyType: property.propertyType,
    listingType: property.listingType || "SALE",
    status: property.status,
    price: property.price,
    bedrooms: property.bedrooms !== null ? String(property.bedrooms) : "",
    area: String(property.area),
    address: property.address,
    city: property.city,
    state: initialWilayaCode,
    agentPhone: property.agentPhone || "",
    videoUrl: property.videoUrl || "",
    floor: property.floor !== null ? String(property.floor) : "",
  });

  const showBedrooms = !HIDE_BEDROOMS.includes(form.propertyType);
  const showFloor = !HIDE_FLOOR.includes(form.propertyType);

  const PROPERTY_TYPES = [
    { value: "APARTMENT", label: tPropertyTypes("APARTMENT") },
    { value: "VILLA", label: tPropertyTypes("VILLA") },
    { value: "HOUSE", label: tPropertyTypes("HOUSE") },
    { value: "LAND", label: tPropertyTypes("LAND") },
    { value: "OFFICE", label: tPropertyTypes("OFFICE") },
    { value: "COMMERCIAL", label: tPropertyTypes("COMMERCIAL") },
    { value: "WAREHOUSE", label: tPropertyTypes("WAREHOUSE") },
  ];

  const LISTING_TYPES = [
    { value: "SALE", label: tProperty("sale") },
    { value: "RENT", label: tProperty("rent") },
  ];

  const STATUSES = [
    { value: "DRAFT", label: t("draft") },
    { value: "PUBLISHED", label: t("publishedLabel") },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "state") next.city = "";
      return next;
    });
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handlePriceChange = (value: number) => {
    setForm((prev) => ({ ...prev, price: value }));
    if (errors.price) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.price;
        return next;
      });
    }
  };

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const imgs: { file: File; preview: string; isPrimary: boolean }[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) continue;
      imgs.push({ file: files[i], preview: URL.createObjectURL(files[i]), isPrimary: false });
    }
    setNewImages((prev) => [...prev, ...imgs]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeNewImage(index: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingImage(imageId: string) {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  async function uploadNewImages(propertyId: string) {
    for (const img of newImages) {
      const formData = new FormData();
      formData.append("file", img.file);
      formData.append("propertyId", propertyId);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.url) {
          const { addPropertyImage } = await import("@/modules/property/image-actions");
          await addPropertyImage(propertyId, data.url, undefined, img.isPrimary);
        }
      } catch { /* skip */ }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const wilayaName = form.state ? WILAYAS.find((w) => w.code === form.state)?.name : undefined;
    const data = {
      title: form.title,
      description: form.description,
      propertyType: form.propertyType,
      listingType: form.listingType,
      status: form.status,
      price: form.price || 0,
      bedrooms: showBedrooms && form.bedrooms ? Number(form.bedrooms) : undefined,
      floor: showFloor && form.floor ? Number(form.floor) : undefined,
      area: Number(form.area) || 0,
      address: form.address,
      city: form.city,
      state: wilayaName,
      agentPhone: form.agentPhone || undefined,
      videoUrl: form.videoUrl || undefined,
    };

    const result = await updateProperty(property.id, data);

    if (result.success) {
      await uploadNewImages(property.id);
      router.push("/dashboard/properties");
    } else {
      setLoading(false);
      const failed = result as { success: false; error: string; errors?: Record<string, string[]> };
      if (failed.errors) setErrors(failed.errors);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteProperty(property.id);
    if (result.success) router.push("/dashboard/properties");
    setDeleting(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("basicInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{t("titleRequired")}</Label>
                  <Input id="title" name="title" value={form.title} onChange={handleChange} required />
                  {errors.title && <p className="mt-1 text-xs text-error">{errors.title[0]}</p>}
                </div>
                <div>
                  <Label htmlFor="description">{t("descriptionRequired")}</Label>
                  <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} required />
                  {errors.description && <p className="mt-1 text-xs text-error">{errors.description[0]}</p>}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="propertyType">{t("propertyTypeRequired")}</Label>
                    <select id="propertyType" name="propertyType" value={form.propertyType} onChange={handleChange} className={SELECT_CLASSES}>
                      {PROPERTY_TYPES.map((tp) => (<option key={tp.value} value={tp.value}>{tp.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="listingType">{t("listingTypeRequired")}</Label>
                    <select id="listingType" name="listingType" value={form.listingType} onChange={handleChange} className={SELECT_CLASSES}>
                      {LISTING_TYPES.map((lt) => (<option key={lt.value} value={lt.value}>{lt.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="status">{t("statusRequired")}</Label>
                    <select id="status" name="status" value={form.status} onChange={handleChange} className={SELECT_CLASSES}>
                      {STATUSES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("location")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">{t("addressLabel")}</Label>
                  <Input id="address" name="address" value={form.address} onChange={handleChange} required />
                  {errors.address && <p className="mt-1 text-xs text-error">{errors.address[0]}</p>}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="state">{t("wilayaLabel")}</Label>
                    <select id="state" name="state" value={form.state} onChange={handleChange} className={SELECT_CLASSES} required>
                      <option value="">{t("wilayaPlaceholder")}</option>
                      {WILAYAS.map((w) => (<option key={w.code} value={w.code}>{w.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="city">{t("cityLabel")}</Label>
                    <input id="city" name="city" value={form.city} onChange={handleChange} placeholder={t("cityPlaceholder")} className={SELECT_CLASSES} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("images")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {existingImages.map((img) => (
                      <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                        <img src={img.url} alt={img.altText || ""} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <button type="button" onClick={() => removeExistingImage(img.id)} className="rounded-full bg-white/80 p-1.5 text-text-primary hover:bg-white transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {img.isPrimary && (
                          <div className="absolute bottom-1 right-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-white">{tProperty("primary")}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50"
                >
                  <Plus className="mb-2 h-6 w-6 text-text-tertiary" />
                  <p className="text-sm text-text-secondary">{t("uploadHintEdit")}</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleImageSelect} />

                {newImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {newImages.map((img, i) => (
                      <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                        <img src={img.preview} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <button type="button" onClick={() => removeNewImage(i)} className="rounded-full bg-white/80 p-1.5 text-text-primary hover:bg-white transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("priceAndArea")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PriceInput
                  id="price"
                  label={t("priceLabel")}
                  value={form.price}
                  onChange={handlePriceChange}
                  required
                />
                {errors.price && <p className="mt-1 text-xs text-error">{errors.price[0]}</p>}
                <div>
                  <Label htmlFor="area">{t("areaRequired")}</Label>
                  <Input id="area" name="area" type="number" min="0" value={form.area} onChange={handleChange} required />
                  {errors.area && <p className="mt-1 text-xs text-error">{errors.area[0]}</p>}
                </div>
              </CardContent>
            </Card>

            {showBedrooms && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("rooms")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="bedrooms">{t("bedroomsLabel")}</Label>
                  <Input id="bedrooms" name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={handleChange} placeholder="0" />
                </CardContent>
              </Card>
            )}

            {showFloor && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("floorLabel")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="floor">{t("floorLabel")}</Label>
                  <Input id="floor" name="floor" type="number" min="0" value={form.floor} onChange={handleChange} placeholder="0" />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>{t("agentPhone")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="agentPhone">{t("agentPhoneLabel")}</Label>
                <Input id="agentPhone" name="agentPhone" value={form.agentPhone} onChange={handleChange} placeholder="0555123456" dir="ltr" />
                <p className="mt-1.5 text-xs text-text-tertiary">
                  {t("agentPhoneDesc")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("videoUrl")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="videoUrl">{t("videoUrlLabel")}</Label>
                <Input id="videoUrl" name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." dir="ltr" />
                <p className="mt-1.5 text-xs text-text-tertiary">
                  {t("videoUrlDesc")}
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? t("saving") : t("saveChanges")}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/properties")}>
                {tCommon("cancel")}
              </Button>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">{t("deleteProperty")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("confirmDelete")}</DialogTitle>
                  <DialogDescription>{t("confirmDeleteDesc")}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">{tCommon("cancel")}</Button></DialogClose>
                  <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                    {deleting ? t("creating") : tCommon("delete")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </form>
    </div>
  );
}
