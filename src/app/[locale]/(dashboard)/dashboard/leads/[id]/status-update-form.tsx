"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateLeadStatus } from "@/modules/lead/actions";

const STATUSES = [
  { value: "NEW", label: "جديد" },
  { value: "CONTACTED", label: "تم التواصل" },
  { value: "INTERESTED", label: "مهتم" },
  { value: "NEGOTIATION", label: "تفاوض" },
  { value: "CONVERTED", label: "تم التحويل" },
  { value: "LOST", label: "مفقود" },
];

export function StatusUpdateForm({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    await updateLeadStatus(leadId, newStatus);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
