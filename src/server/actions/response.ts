import { type ActionResponse } from "@/shared/lib/errors";

export function success<T>(data: T): ActionResponse<T> {
  return { success: true, data };
}

export function failure(
  error: string,
  errors?: Record<string, string[]>
): ActionResponse {
  return { success: false, error, errors };
}
