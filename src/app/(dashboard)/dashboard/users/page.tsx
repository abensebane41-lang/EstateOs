import { prisma } from "@/shared/lib/prisma";
import { getCurrentUser } from "@/shared/lib/auth-helpers";
import { PageHeader } from "@/shared/components/shared/page-header";
import { UsersTable } from "./users-table";
import { UserPlus } from "lucide-react";

export default async function UsersPage() {
  const user = await getCurrentUser();
  if (!user?.agencyId) {
    return (
      <div>
        <PageHeader title="المستخدمين" description="إدارة مستخدمي الوكالة" />
        <p className="text-center text-text-secondary py-8">لا تملك صلاحية</p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    where: { agencyId: user.agencyId },
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="المستخدمين"
        description="إدارة مستخدمي الوكالة"
      />
      <UsersTable initialUsers={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
