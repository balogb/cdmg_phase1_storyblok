import StoryblokClient from "storyblok-js-client";

// Content Delivery API client (for published content)
export const storyblokClient = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN!,
  cache: {
    clear: "auto",
    type: "memory",
  },
});

// Management API client (for schema operations - backend only)
export const storyblokManagementClient = new StoryblokClient({
  accessToken: process.env.STORYBLOK_MANAGEMENT_TOKEN!,
  oauthToken: process.env.STORYBLOK_MANAGEMENT_TOKEN!,
});

// Type-safe story fetching with caching
export async function getStoryBySlug(slug: string, isDraft: boolean = false) {
  try {
    const { data } = await storyblokClient.get(`cdn/stories/${slug}`, {
      version: isDraft ? "draft" : "published",
      resolve_relations: [],
      cv: Date.now(), // Cache busting for development
    });

    return data.story;
  } catch (error) {
    console.error(`Error fetching story: ${slug}`, error);
    throw error;
  }
}

// Rate limit monitoring
let requestCount = 0;
let requestWindow = Date.now();

export function checkRateLimit() {
  const now = Date.now();
  if (now - requestWindow > 1000) {
    // Reset every second
    requestCount = 0;
    requestWindow = now;
  }

  requestCount++;

  if (requestCount > 6) {
    console.warn(
      "⚠️ BLOCKER: Approaching Storyblok rate limit (6 req/sec on paid plans)"
    );
  }

  return { count: requestCount, limit: 6 };
}
