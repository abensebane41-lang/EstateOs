import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate, slugify } from "@/shared/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toContain("base");
    expect(result).toContain("extra");
    expect(result).not.toContain("hidden");
  });
});

describe("formatCurrency", () => {
  it("formats DZD by default", () => {
    const result = formatCurrency(1500000);
    expect(result).toContain("1");
    expect(result).toContain("500");
  });

  it("formats with custom currency", () => {
    const result = formatCurrency(100, "USD");
    expect(result).toBeDefined();
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2024-06-15");
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  it("formats a Date object", () => {
    const result = formatDate(new Date("2024-01-01"));
    expect(result).toBeDefined();
  });
});

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles arabic-like characters", () => {
    const result = slugify("شقة للبيع");
    expect(result).toBeDefined();
  });

  it("removes special characters", () => {
    expect(slugify("Hello! @World#")).toBe("hello-world");
  });

  it("trims leading/trailing dashes", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
  });

  it("collapses multiple spaces/underscores", () => {
    expect(slugify("hello___world")).toBe("hello-world");
  });
});
