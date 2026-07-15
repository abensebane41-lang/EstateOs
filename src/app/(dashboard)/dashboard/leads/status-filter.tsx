"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const TABS = [
  { value: "ALL", label: "الكل" },
  { value: "NEW", label: "جديد" },
  { value: "CONTACTED", label: "تم التواصل" },
  { value: "INTERESTED", label: "مهتم" },
  { value: "NEGOTIATION", label: "تفاوض" },
  { value: "CONVERTED", label: "تم التحويل" },
  { value: "LOST", label: "مفقود" },
];

export function StatusFilter({ currentStatus }: { currentStatus: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleFilter(tab.value)}
          className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            currentStatus === tab.value
              ? "bg-primary text-white"
              : "bg-white border border-border text-text-secondary hover:bg-surface-secondary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
