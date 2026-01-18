import { MetadataRoute } from "next";
import { storyblokClient } from "@/app/lib/storyblok-client";

/**
 * Dynamic sitemap generation from Storyblok stories
 * Automatically updates when new pages are published
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  // Static pages that always exist
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  try {
    // Fetch all published stories from Storyblok
    const { data } = await storyblokClient.get("cdn/stories", {
      version: "published",
      per_page: 100,
      excluding_slugs: "settings,global-settings", // Exclude non-page content
    });

    const dynamicPages: MetadataRoute.Sitemap = data.stories
      .filter((story: { full_slug: string }) => {
        // Exclude the home page (already in static) and settings pages
        return (
          story.full_slug !== "home" &&
          !story.full_slug.startsWith("settings")
        );
      })
      .map((story: { full_slug: string; published_at: string }) => ({
        url: `${baseUrl}/${story.full_slug}`,
        lastModified: new Date(story.published_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static pages if Storyblok fetch fails
    return staticPages;
  }
}
