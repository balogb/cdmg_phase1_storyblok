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

// Rate Limiter class to handle Storyblok quota limits
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerSecond = 3; // Standard free tier limit (adjust to 6 for paid)
  private requestInterval = 1000 / this.requestsPerSecond;

  async execute<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        await request();
        await new Promise((resolve) => setTimeout(resolve, this.requestInterval));
      }
    }

    this.processing = false;
  }
}

// Helper to fetch global settings
export async function getGlobalSettings(isDraft: boolean = false) {
  try {
    const { data } = await rateLimiter.execute(() =>
      storyblokClient.get(`cdn/stories/settings`, {
        version: isDraft ? "draft" : "published",
        cv: Date.now(),
      })
    );
    return data.story.content;
  } catch (error) {
    console.error("Error fetching global settings:", error);
    return null;
  }
}

export const rateLimiter = new RateLimiter();

// Type-safe story fetching with caching
export async function getStoryBySlug(slug: string, isDraft: boolean = false) {
  try {
    const { data } = await rateLimiter.execute(() =>
      storyblokClient.get(`cdn/stories/${slug}`, {
        version: isDraft ? "draft" : "published",
        resolve_relations: [],
        cv: Date.now(),
      })
    );

    return data.story;
  } catch (error) {
    console.error(`Error fetching story: ${slug}`, error);
    throw error;
  }
}
