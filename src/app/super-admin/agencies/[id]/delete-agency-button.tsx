"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { deleteAgency } from "@/modules/agency/actions";

interface DeleteAgencyButtonProps {
  agencyId: string;
  agencyName: string;
}

export function DeleteAgencyButton({ agencyId, agencyName }: DeleteAgencyButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const result = await deleteAgency(agencyId);
    setLoading(false);

    if (result.success) {
      router.push("/super-admin/agencies");
    } else {
      alert(result.error || "فشل في الحذف");
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="border-error/30 text-error hover:bg-error/5"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="ml-2 h-4 w-4" />
        حذف الوكالة
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد حذف الوكالة</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف وكالة <strong>{agencyName}</strong>؟
              <br />
              <span className="text-error font-medium">
                هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع العقارات والعملاء والمستخدمين والاشتراكات المرتبطة بهذه الوكالة.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "جاري الحذف..." : "نعم، احذف الوكالة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
