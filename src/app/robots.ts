import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/super-admin/", "/dashboard/", "/api/"],
      },
    ],
    sitemap: "https://estate-os-beryl.vercel.app/sitemap.xml",
  };
}
