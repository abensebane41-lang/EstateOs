"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/modules/lead/actions";

const NEXT_STATUS: Record<string, string> = {
  NEW: "CONTACTED",
  CONTACTED: "INTERESTED",
  INTERESTED: "NEGOTIATION",
  NEGOTIATION: "CONVERTED",
};

const NEXT_LABEL: Record<string, string> = {
  NEW: "تواصل",
  CONTACTED: "مهتم",
  INTERESTED: "تفاوض",
  NEGOTIATION: "تحويل",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-primary/10 text-primary hover:bg-primary/20",
  CONTACTED: "bg-warning/10 text-warning hover:bg-warning/20",
  INTERESTED: "bg-success/10 text-success hover:bg-success/20",
  NEGOTIATION: "bg-accent/10 text-accent-dark hover:bg-accent/20",
  CONVERTED: "bg-success/10 text-success hover:bg-success/20",
  LOST: "bg-error/10 text-error hover:bg-error/20",
};

export function QuickStatusUpdate({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nextStatus = NEXT_STATUS[currentStatus];
  const nextLabel = NEXT_LABEL[currentStatus];

  if (!nextStatus) return null;

  async function handleUpdate() {
    await updateLeadStatus(leadId, nextStatus);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleUpdate}
      disabled={isPending}
      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${STATUS_COLORS[currentStatus]}`}
    >
      {isPending ? "..." : nextLabel}
    </button>
  );
}
