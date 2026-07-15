export const SITE_NAME = "EstateOS";
export const SITE_DESCRIPTION = "منصة إدارة العقارات";
export const DEFAULT_CURRENCY = "DZD";

export const AGENCY_DEFAULTS = {
  primaryColor: "#0F2747",
  accentColor: "#C9A227",
} as const;

export const PAGINATION_DEFAULTS = {
  pageSize: 12,
  maxPageSize: 50,
} as const;

export const UPLOAD_LIMITS = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxImages: 20,
} as const;
