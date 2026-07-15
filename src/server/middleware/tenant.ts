import { tenantStorage, type TenantContext } from "@/server/context";

export async function withTenant<T>(
  context: TenantContext,
  fn: () => Promise<T>
): Promise<T> {
  return tenantStorage.run(context, fn);
}
