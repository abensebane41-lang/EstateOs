"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateLeadNotes } from "@/modules/lead/actions";
import { useTranslations } from "next-intl";

export function NotesEditForm({
  leadId,
  notes,
}: {
  leadId: string;
  notes: string | null;
}) {
  const router = useRouter();
  const [value, setValue] = useState(notes ?? "");
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("dashboard");

  async function handleSave() {
    await updateLeadNotes(leadId, value);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={5}
        placeholder={t("leadNotesPlaceholder")}
        className="flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 resize-none"
      />
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending || value === (notes ?? "")}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isPending ? t("leadNotesSaving") : t("leadNotesSave")}
        </button>
      </div>
    </div>
  );
}
