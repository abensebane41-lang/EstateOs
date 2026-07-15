import { AsyncLocalStorage } from "async_hooks";

export interface TenantContext {
  agencyId: string;
  userId: string;
  userRole: string;
}

export const tenantStorage = new AsyncLocalStorage<TenantContext>();

export function getTenantContext(): TenantContext {
  const store = tenantStorage.getStore();
  if (!store) {
    throw new Error("No tenant context found. Ensure middleware is running.");
  }
  return store;
}

export function getAgencyId(): string {
  return getTenantContext().agencyId;
}
