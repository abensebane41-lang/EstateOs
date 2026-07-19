"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

const STATUSES = ["ALL", "NEW", "CONTACTED", "INTERESTED", "NEGOTIATION", "CONVERTED", "LOST"] as const;

export function StatusFilter({ currentStatus }: { currentStatus: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("leadStatus");
  const tDashboard = useTranslations("dashboard");

  function handleFilter(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "ALL") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/dashboard/leads?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((value) => (
        <button
          key={value}
          onClick={() => handleFilter(value)}
          className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            currentStatus === value
              ? "bg-primary text-white"
              : "bg-white border border-border text-text-secondary hover:bg-surface-secondary"
          }`}
        >
          {value === "ALL" ? tDashboard("leadFilterAll") : t(value)}
        </button>
      ))}
    </div>
  );
}
