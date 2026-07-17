"use client";

import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const UNITS = [
  { value: 1, label: "د.ج" },
  { value: 1_000_000, label: "مليون سنتيم" },
  { value: 1_000_000_000, label: "مليار سنتيم" },
];

function detectUnit(total: number): number {
  if (total >= 1_000_000_000) return 1_000_000_000;
  if (total >= 1_000_000) return 1_000_000;
  return 1;
}

function formatDisplay(total: number, unit: number): string {
  if (unit === 1) return String(total);
  const divided = total / unit;
  return divided === Math.floor(divided) ? String(divided) : String(divided);
}

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

export function PriceInput({ value, onChange, label, placeholder, required, id, className }: PriceInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [unit, setUnit] = useState(1);

  useEffect(() => {
    const numValue = Number(value) || 0;
    if (numValue > 0) {
      const detected = detectUnit(numValue);
      setUnit(detected);
      setDisplayValue(formatDisplay(numValue, detected));
    } else {
      setDisplayValue("");
      setUnit(1);
    }
  }, [value]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    const numVal = parseFloat(raw) || 0;
    onChange(numVal * unit);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = Number(e.target.value);
    const currentTotal = (parseFloat(displayValue) || 0) * unit;
    const newDisplay = currentTotal / newUnit;
    setUnit(newUnit);
    setDisplayValue(newDisplay > 0 ? String(newDisplay) : "");
    onChange(currentTotal);
  };

  return (
    <div className={className}>
      {label && <Label className="text-xs text-text-secondary mb-1 block">{label}</Label>}
      <div className="flex gap-2">
        <Input
          type="number"
          id={id}
          value={displayValue}
          onChange={handleValueChange}
          placeholder={placeholder || "0"}
          min="0"
          required={required}
          dir="ltr"
          className="text-left flex-1"
        />
        <select
          value={unit}
          onChange={handleUnitChange}
          className="flex h-10 w-[90px] shrink-0 rounded-lg border border-border bg-white px-2 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {UNITS.map((u) => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface PriceInputStringProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  dir?: string;
  className?: string;
}

export function PriceInputString({ value, onChange, label, placeholder, className }: PriceInputStringProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [unit, setUnit] = useState(1);

  useEffect(() => {
    const numValue = Number(value) || 0;
    if (numValue > 0) {
      const detected = detectUnit(numValue);
      setUnit(detected);
      setDisplayValue(formatDisplay(numValue, detected));
    } else {
      setDisplayValue("");
      setUnit(1);
    }
  }, []);

  useEffect(() => {
    const numValue = Number(value) || 0;
    if (numValue > 0) {
      const detected = detectUnit(numValue);
      setUnit(detected);
      setDisplayValue(formatDisplay(numValue, detected));
    } else {
      setDisplayValue("");
      setUnit(1);
    }
  }, [value]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    const numVal = parseFloat(raw) || 0;
    onChange(String(numVal * unit));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = Number(e.target.value);
    const currentTotal = (parseFloat(displayValue) || 0) * unit;
    const newDisplay = currentTotal / newUnit;
    setUnit(newUnit);
    setDisplayValue(newDisplay > 0 ? String(newDisplay) : "");
    onChange(String(currentTotal));
  };

  return (
    <div className={className}>
      {label && <Label className="text-xs text-text-secondary mb-1 block">{label}</Label>}
      <div className="flex gap-2">
        <Input
          type="number"
          value={displayValue}
          onChange={handleValueChange}
          placeholder={placeholder || "0"}
          min="0"
          dir="ltr"
          className="text-left flex-1"
        />
        <select
          value={unit}
          onChange={handleUnitChange}
          className="flex h-10 w-[90px] shrink-0 rounded-lg border border-border bg-white px-2 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {UNITS.map((u) => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
