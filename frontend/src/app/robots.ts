import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shenshi-family.miegoat.club";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/register", "/profile"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
