import { describe, it, expect } from "vitest";
import {
  newLeadEmailHTML,
  subscriptionActivatedEmailHTML,
  welcomeEmailHTML,
} from "@/shared/lib/email";

describe("newLeadEmailHTML", () => {
  it("generates valid HTML with all fields", () => {
    const html = newLeadEmailHTML({
      agencyName: "وكالة الأمل",
      leadName: "أحمد بن علي",
      leadEmail: "ahmed@example.com",
      leadPhone: "0555123456",
      propertyName: "شقة فاخرة في بن عكنون",
      message: "أرغب في معرفة التفاصيل",
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("وكالة الأمل");
    expect(html).toContain("أحمد بن علي");
    expect(html).toContain("ahmed@example.com");
    expect(html).toContain("0555123456");
    expect(html).toContain("شقة فاخرة في بن عكنون");
    expect(html).toContain("أرغب في معرفة التفاصيل");
    expect(html).toContain("rtl");
  });

  it("generates valid HTML without optional fields", () => {
    const html = newLeadEmailHTML({
      agencyName: "وكالة الأمل",
      leadName: "أحمد",
      leadEmail: "a@b.com",
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("وكالة الأمل");
    expect(html).not.toContain("الهاتف");
  });
});

describe("subscriptionActivatedEmailHTML", () => {
  it("generates valid HTML", () => {
    const html = subscriptionActivatedEmailHTML({
      agencyName: "وكالة الأمل",
      planName: "الخطة الشهرية",
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("وكالة الأمل");
    expect(html).toContain("الخطة الشهرية");
    expect(html).toContain("rtl");
  });
});

describe("welcomeEmailHTML", () => {
  it("generates valid HTML with agency name", () => {
    const html = welcomeEmailHTML("وكالة الأمل");

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("وكالة الأمل");
    expect(html).toContain("EstateOS");
    expect(html).toContain("rtl");
  });
});
