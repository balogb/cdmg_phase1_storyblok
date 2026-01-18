import { MetadataRoute } from "next";

/**
 * Robots.txt configuration
 * Controls search engine crawler behavior
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",        // Block API routes
          "/api/draft/",  // Block draft mode endpoints
          "/api/webhooks/", // Block webhook endpoints
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
