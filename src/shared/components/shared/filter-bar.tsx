"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { PriceInputString } from "@/shared/components/shared/price-input";
import { ChevronDown, ChevronUp, X, Search, SlidersHorizontal } from "lucide-react";
import { WILAYAS, COMMUNES } from "@/shared/data/algeria";

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "شقة" },
  { value: "VILLA", label: "فيلا" },
  { value: "STUDIO", label: "ستوديو" },
  { value: "HOUSE", label: "منزل أرضي" },
  { value: "LAND", label: "أرض" },
  { value: "OFFICE", label: "مكتب" },
  { value: "COMMERCIAL", label: "محل" },
  { value: "WAREHOUSE", label: "مستودع" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "الأرخص" },
  { value: "price_desc", label: "الأغلى" },
  { value: "area_desc", label: "الأكبر مساحة" },
  { value: "views", label: "الأكثر مشاهدة" },
];

const ALGERIA_STATES = WILAYAS.map(w => w.name);

interface FilterBarProps {
  totalResults: number;
}

export function FilterBar({ totalResults }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);

  const [purpose, setPurpose] = useState(searchParams.get("purpose") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minArea, setMinArea] = useState(searchParams.get("minArea") || "");
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") || "");
  const [floor, setFloor] = useState(searchParams.get("floor") || "");
  const [furnished, setFurnished] = useState(searchParams.get("furnished") === "1");
  const [parking, setParking] = useState(searchParams.get("parking") === "1");
  const [balcony, setBalcony] = useState(searchParams.get("balcony") === "1");
  const [featured, setFeatured] = useState(searchParams.get("featured") === "1");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const selectedWilaya = WILAYAS.find(w => w.name === state);
  const stateCode = selectedWilaya?.code || "";
  const communesForState = stateCode ? (COMMUNES[stateCode] || []) : [];

  const activeFilterCount = [
    search, purpose, type, state, city, minPrice, maxPrice, minArea, maxArea,
    bedrooms, bathrooms, floor, furnished, parking, balcony, featured,
  ].filter(Boolean).length;

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (purpose) params.set("purpose", purpose);
    if (type) params.set("type", type);
    if (state) params.set("state", state);
    if (city) params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minArea) params.set("minArea", minArea);
    if (maxArea) params.set("maxArea", maxArea);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (bathrooms) params.set("bathrooms", bathrooms);
    if (floor) params.set("floor", floor);
    if (furnished) params.set("furnished", "1");
    if (parking) params.set("parking", "1");
    if (balcony) params.set("balcony", "1");
    if (featured) params.set("featured", "1");
    if (sort && sort !== "newest") params.set("sort", sort);
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [search, purpose, type, state, city, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, floor, furnished, parking, balcony, featured, sort, router]);

  function resetFilters() {
    setSearch(""); setPurpose(""); setType(""); setState(""); setCity("");
    setMinPrice(""); setMaxPrice(""); setMinArea(""); setMaxArea("");
    setBedrooms(""); setBathrooms(""); setFloor("");
    setFurnished(false); setParking(false); setBalcony(false); setFeatured(false);
    setSort("newest");
    router.push("?", { scroll: false });
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-luxury sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <SlidersHorizontal className="h-5 w-5 text-accent" />
          </div>
          <h2 className="font-[family-name:var(--font-public-heading)] text-lg font-semibold text-text-primary">بحث متقدم</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">{totalResults} نتيجة</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent border border-accent/20">
              {activeFilterCount} فلتر
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-2 sm:col-span-3 lg:col-span-4">
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">بحث بالاسم أو العنوان</Label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyFilters(); }}
              placeholder="مثال: فيلا وهران..."
              className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary pr-10 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
            {search && (
              <button onClick={() => { setSearch(""); }} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">نوع العملية</Label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            <option value="">الكل</option>
            <option value="SALE">للبيع</option>
            <option value="RENT">للإيجار</option>
          </select>
        </div>

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">نوع العقار</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            <option value="">الكل</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">الولاية</Label>
          <select
            value={state}
            onChange={(e) => { setState(e.target.value); setCity(""); }}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            <option value="">الكل</option>
            {ALGERIA_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">المدينة</Label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!state}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors disabled:opacity-50"
          >
            <option value="">الكل</option>
            {communesForState.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <PriceInputString
          value={minPrice}
          onChange={setMinPrice}
          label="السعر الأدنى"
          placeholder="من..."
        />

        <PriceInputString
          value={maxPrice}
          onChange={setMaxPrice}
          label="السعر الأعلى"
          placeholder="إلى..."
        />

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">الغرف</Label>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            <option value="">أي عدد</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">الترتيب</Label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 flex items-center gap-1.5 text-sm text-accent hover:text-accent-dark font-medium transition-colors"
      >
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {expanded ? "إخفاء الفلاتر" : "فلاتر إضافية"}
      </button>

      {expanded && (
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border/50 pt-5 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <Label className="text-xs text-text-secondary mb-1.5 block font-medium">الحمامات</Label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            >
              <option value="">أي عدد</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>

          <div>
            <Label className="text-xs text-text-secondary mb-1.5 block font-medium">المساحة من</Label>
            <Input type="number" placeholder="م²" value={minArea} onChange={(e) => setMinArea(e.target.value)} dir="ltr" className="text-left h-11 rounded-xl border-border/60 bg-surface-secondary" />
          </div>

          <div>
            <Label className="text-xs text-text-secondary mb-1.5 block font-medium">المساحة إلى</Label>
            <Input type="number" placeholder="م²" value={maxArea} onChange={(e) => setMaxArea(e.target.value)} dir="ltr" className="text-left h-11 rounded-xl border-border/60 bg-surface-secondary" />
          </div>

          <div>
            <Label className="text-xs text-text-secondary mb-1.5 block font-medium">الطابق</Label>
            <Input type="number" placeholder="رقم الطابق" value={floor} onChange={(e) => setFloor(e.target.value)} dir="ltr" className="text-left h-11 rounded-xl border-border/60 bg-surface-secondary" />
          </div>

          <div className="flex items-end gap-5 sm:col-span-3 lg:col-span-3">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
              <input type="checkbox" checked={furnished} onChange={(e) => setFurnished(e.target.checked)} className="h-4 w-4 rounded border-border accent-accent" />
              مفروش
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
              <input type="checkbox" checked={parking} onChange={(e) => setParking(e.target.checked)} className="h-4 w-4 rounded border-border accent-accent" />
              موقف سيارات
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
              <input type="checkbox" checked={balcony} onChange={(e) => setBalcony(e.target.checked)} className="h-4 w-4 rounded border-border accent-accent" />
              شرفة
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-border accent-accent" />
              مميز فقط
            </label>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-6">
        <Button onClick={applyFilters} className="flex-1 sm:flex-none bg-gradient-to-l from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-md">
          <Search className="ml-2 h-4 w-4" />
          بحث
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="outline" onClick={resetFilters} className="border-accent/30 text-accent hover:bg-accent/5">
            <X className="ml-2 h-4 w-4" />
            إعادة ضبط
          </Button>
        )}
      </div>
    </div>
  );
}
