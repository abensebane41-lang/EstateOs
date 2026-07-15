import { auth } from "@/modules/auth/auth";
import { headers } from "next/headers";
import { UnauthorizedError } from "./errors";

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new UnauthorizedError("يجب تسجيل الدخول أولاً");
  }

  return session;
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

export async function requireAgencyAccess() {
  const session = await requireAuth();

  if (!session.user.agencyId) {
    throw new UnauthorizedError("لا تملك صلاحية الوصول لهذه الوكالة");
  }

  return {
    user: session.user,
    agencyId: session.user.agencyId,
  };
}
