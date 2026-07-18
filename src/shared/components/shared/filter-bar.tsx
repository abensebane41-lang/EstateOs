"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { PriceInputString } from "@/shared/components/shared/price-input";
import { ChevronDown, ChevronUp, X, Search, SlidersHorizontal } from "lucide-react";
import { WILAYAS } from "@/shared/data/algeria";

interface FilterBarProps {
  totalResults: number;
  locale?: string;
}

export function FilterBar({ totalResults }: FilterBarProps) {
  const t = useTranslations("filter");
  const tPropertyTypes = useTranslations("propertyTypes");
  const tProperty = useTranslations("property");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);

  const ALGERIA_STATES = WILAYAS.map(w => ({ value: w.name, label: locale === "fr" ? w.nameFr : w.name }));
  const stateToValue = (displayName: string): string => {
    const w = WILAYAS.find(w => w.name === displayName || w.nameFr === displayName);
    return w ? w.name : displayName;
  };
  const valueToDisplay = (value: string): string => {
    const w = WILAYAS.find(w => w.name === value);
    return w ? (locale === "fr" ? w.nameFr : w.name) : value;
  };

  const [purpose, setPurpose] = useState(searchParams.get("purpose") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [state, setState] = useState(searchParams.get("state") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minArea, setMinArea] = useState(searchParams.get("minArea") || "");
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [floor, setFloor] = useState(searchParams.get("floor") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const selectedWilaya = WILAYAS.find(w => w.name === state || w.nameFr === state);

  const PROPERTY_TYPES = [
    { value: "APARTMENT", label: tPropertyTypes("APARTMENT") },
    { value: "VILLA", label: tPropertyTypes("VILLA") },
    { value: "STUDIO", label: tPropertyTypes("STUDIO") },
    { value: "HOUSE", label: tPropertyTypes("HOUSE") },
    { value: "LAND", label: tPropertyTypes("LAND") },
    { value: "OFFICE", label: tPropertyTypes("OFFICE") },
    { value: "COMMERCIAL", label: tPropertyTypes("COMMERCIAL") },
    { value: "WAREHOUSE", label: tPropertyTypes("WAREHOUSE") },
  ];

  const SORT_OPTIONS = [
    { value: "newest", label: t("newest") },
    { value: "price_asc", label: t("cheapest") },
    { value: "price_desc", label: t("mostExpensive") },
    { value: "area_desc", label: t("largestArea") },
    { value: "views", label: t("mostViewed") },
  ];

  const activeFilterCount = [
    search, purpose, type, state, city, minPrice, maxPrice, minArea, maxArea,
    bedrooms, floor,
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
    if (floor) params.set("floor", floor);
    if (sort && sort !== "newest") params.set("sort", sort);
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [search, purpose, type, state, city, minPrice, maxPrice, minArea, maxArea, bedrooms, floor, sort, router]);

  function resetFilters() {
    setSearch(""); setPurpose(""); setType(""); setState(""); setCity("");
    setMinPrice(""); setMaxPrice(""); setMinArea(""); setMaxArea("");
    setBedrooms(""); setFloor("");
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
          <h2 className="font-[family-name:var(--font-public-heading)] text-lg font-semibold text-text-primary">{t("advancedSearch")}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">{totalResults} {t("results")}</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent border border-accent/20">
              {activeFilterCount} {t("activeFilters")}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-2 sm:col-span-3 lg:col-span-4">
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">{t("searchByNameOrTitle")}</Label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyFilters(); }}
              placeholder={t("searchPlaceholder")}
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
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">{t("dealType")}</Label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            <option value="">{t("all")}</option>
            <option value="SALE">{t("forSale")}</option>
            <option value="RENT">{t("forRent")}</option>
          </select>
        </div>

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">{t("propertyType")}</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            <option value="">{t("all")}</option>
            {PROPERTY_TYPES.map((tp) => (
              <option key={tp.value} value={tp.value}>{tp.label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">{t("wilaya")}</Label>
          <select
            value={state}
            onChange={(e) => { setState(e.target.value); setCity(""); }}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            <option value="">{t("all")}</option>
            {ALGERIA_STATES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">{t("city")}</Label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("cityPlaceholder")}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
        </div>

        <PriceInputString
          value={minPrice}
          onChange={setMinPrice}
          label={t("minPrice")}
          placeholder={t("minPricePlaceholder")}
        />

        <PriceInputString
          value={maxPrice}
          onChange={setMaxPrice}
          label={t("maxPrice")}
          placeholder={t("maxPricePlaceholder")}
        />

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">{t("bedrooms")}</Label>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-border/60 bg-surface-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          >
            <option value="">{t("anyCount")}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div>
          <Label className="text-xs text-text-secondary mb-1.5 block font-medium">{t("sortBy")}</Label>
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
        {expanded ? t("hideFilters") : t("moreFilters")}
      </button>

      {expanded && (
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border/50 pt-5 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <Label className="text-xs text-text-secondary mb-1.5 block font-medium">{t("minArea")}</Label>
            <Input type="number" step="any" placeholder={tCommon("areaUnit")} value={minArea} onChange={(e) => setMinArea(e.target.value)} dir="ltr" className="text-left h-11 rounded-xl border-border/60 bg-surface-secondary" />
          </div>

          <div>
            <Label className="text-xs text-text-secondary mb-1.5 block font-medium">{t("maxArea")}</Label>
            <Input type="number" step="any" placeholder={tCommon("areaUnit")} value={maxArea} onChange={(e) => setMaxArea(e.target.value)} dir="ltr" className="text-left h-11 rounded-xl border-border/60 bg-surface-secondary" />
          </div>

          <div>
            <Label className="text-xs text-text-secondary mb-1.5 block font-medium">{t("floorNumber")}</Label>
            <Input type="number" step="any" placeholder={t("floorPlaceholder")} value={floor} onChange={(e) => setFloor(e.target.value)} dir="ltr" className="text-left h-11 rounded-xl border-border/60 bg-surface-secondary" />
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-6">
        <Button onClick={applyFilters} className="flex-1 sm:flex-none bg-gradient-to-l from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-md">
          <Search className="ml-2 h-4 w-4" />
          {t("searchButton")}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="outline" onClick={resetFilters} className="border-accent/30 text-accent hover:bg-accent/5">
            <X className="ml-2 h-4 w-4" />
            {t("resetButton")}
          </Button>
        )}
      </div>
    </div>
  );
}
