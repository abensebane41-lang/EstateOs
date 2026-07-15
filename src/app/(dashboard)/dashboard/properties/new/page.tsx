"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/shared/components/shared/page-header";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { createProperty } from "@/modules/property/actions";
import { WILAYAS, COMMUNES } from "@/shared/data/algeria";
import { PriceInput } from "@/shared/components/shared/price-input";
import { Plus, X, Star } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "شقة" },
  { value: "VILLA", label: "فيلا" },
  { value: "HOUSE", label: "منزل أرضي" },
  { value: "LAND", label: "أرض" },
  { value: "OFFICE", label: "مكتب" },
  { value: "COMMERCIAL", label: "محل تجاري" },
  { value: "WAREHOUSE", label: "مستودع" },
];

const LISTING_TYPES = [
  { value: "SALE", label: "للبيع" },
  { value: "RENT", label: "للإيجار" },
];

const STATUSES = [
  { value: "DRAFT", label: "مسودة" },
  { value: "PUBLISHED", label: "منشور" },
];

const SELECT_CLASSES =
  "flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1";

const HIDE_BEDROOMS = ["LAND", "COMMERCIAL", "WAREHOUSE"];

interface UploadedImage {
  file: File;
  preview: string;
  isPrimary: boolean;
}

export default function NewPropertyPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "DRAFT",
    price: 0,
    bedrooms: "",
    area: "",
    address: "",
    state: "",
    city: "",
  });

  const selectedCommunes = form.state ? (COMMUNES[form.state] || []) : [];
  const showBedrooms = !HIDE_BEDROOMS.includes(form.propertyType);

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
    const newImages: UploadedImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) continue;
      newImages.push({
        file,
        preview: URL.createObjectURL(file),
        isPrimary: images.length === 0 && newImages.length === 0,
      });
    }
    setImages((prev) => {
      const all = [...prev, ...newImages];
      if (all.length > 0 && !all.some((img) => img.isPrimary)) {
        all[0].isPrimary = true;
      }
      return all;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((img) => img.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  }

  function setPrimary(index: number) {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  }

  async function uploadImages(propertyId: string): Promise<boolean> {
    if (images.length === 0) return true;
    setUploadingImages(true);
    try {
      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("file", images[i].file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.url) {
          const { addPropertyImage } = await import("@/modules/property/image-actions");
          await addPropertyImage(propertyId, data.url, undefined, images[i].isPrimary);
        }
      }
      return true;
    } catch {
      return false;
    } finally {
      setUploadingImages(false);
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
      currency: "DZD",
      bedrooms: showBedrooms && form.bedrooms ? Number(form.bedrooms) : undefined,
      area: Number(form.area) || 0,
      address: form.address,
      city: form.city,
      state: wilayaName,
      isFeatured: false,
    };

    const result = await createProperty(data);

    if (result.success && result.data) {
      const prop = result.data as { id: string };
      await uploadImages(prop.id);
      router.push("/dashboard/properties");
    } else {
      setLoading(false);
      if (result.errors) {
        setErrors(result.errors);
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="إضافة عقار جديد"
        description="املأ البيانات التالية لإضافة عقار جديد"
        breadcrumbs={[
          { label: "لوحة التحكم", href: "/dashboard" },
          { label: "العقارات", href: "/dashboard/properties" },
          { label: "إضافة عقار جديد" },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان العقار *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="مثال: شقة فاخرة بالحي المكوّن"
                    required
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-error">{errors.title[0]}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">الوصف *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="وصف تفصيلي للعقار..."
                    rows={4}
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-error">{errors.description[0]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="propertyType">نوع العقار *</Label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={form.propertyType}
                      onChange={handleChange}
                      className={SELECT_CLASSES}
                    >
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="listingType">نوع الإعلان *</Label>
                    <select
                      id="listingType"
                      name="listingType"
                      value={form.listingType}
                      onChange={handleChange}
                      className={SELECT_CLASSES}
                    >
                      {LISTING_TYPES.map((lt) => (
                        <option key={lt.value} value={lt.value}>
                          {lt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="status">الحالة *</Label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={SELECT_CLASSES}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الموقع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">العنوان *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="العنوان التفصيلي"
                    required
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-error">{errors.address[0]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="state">الولاية *</Label>
                    <select
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className={SELECT_CLASSES}
                      required
                    >
                      <option value="">اختر الولاية</option>
                      {WILAYAS.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="city">البلدية *</Label>
                    <select
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className={SELECT_CLASSES}
                      required
                      disabled={!form.state}
                    >
                      <option value="">اختر البلدية</option>
                      {selectedCommunes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>صور العقار</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50 hover:bg-surface-secondary"
                >
                  <Plus className="mb-2 h-8 w-8 text-text-tertiary" />
                  <p className="text-sm text-text-secondary">اضغط لرفع الصور</p>
                  <p className="text-xs text-text-tertiary">JPG, PNG, WebP — حد أقصى 5 ميغابايت للصورة</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((img, i) => (
                      <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                        <img src={img.preview} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setPrimary(i)}
                            className={`rounded-full p-1.5 transition-colors ${img.isPrimary ? "bg-accent text-white" : "bg-white/80 text-text-primary hover:bg-white"}`}
                            title="صورة أساسية"
                          >
                            <Star className="h-4 w-4" fill={img.isPrimary ? "currentColor" : "none"} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="rounded-full bg-white/80 p-1.5 text-text-primary hover:bg-white transition-colors"
                            title="حذف"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {img.isPrimary && (
                          <div className="absolute bottom-1 right-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-white">
                            أساسية
                          </div>
                        )}
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
                <CardTitle>السعر والمساحة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PriceInput
                  id="price"
                  label="السعر *"
                  value={form.price}
                  onChange={handlePriceChange}
                  placeholder="0"
                  required
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-error">{errors.price[0]}</p>
                )}

                <div>
                  <Label htmlFor="area">المساحة (م²) *</Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    min="0"
                    value={form.area}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                  {errors.area && (
                    <p className="mt-1 text-xs text-error">{errors.area[0]}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {showBedrooms && (
              <Card>
                <CardHeader>
                  <CardTitle>الغرف</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="bedrooms">غرف النوم</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="0"
                      value={form.bedrooms}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading || uploadingImages} className="flex-1">
                {uploadingImages ? "جاري رفع الصور..." : loading ? "جاري الحفظ..." : "إضافة العقار"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/properties")}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
