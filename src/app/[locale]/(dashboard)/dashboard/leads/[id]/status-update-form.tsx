"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateLeadStatus } from "@/modules/lead/actions";
import { useTranslations } from "next-intl";

const STATUSES = ["NEW", "CONTACTED", "INTERESTED", "NEGOTIATION", "CONVERTED", "LOST"] as const;

export function StatusUpdateForm({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("leadStatus");

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
      {STATUSES.map((value) => (
        <option key={value} value={value}>
          {t(value)}
        </option>
      ))}
    </select>
  );
}
