import { getStoryBySlug } from "@/app/lib/storyblok-client";
import { StoryblokStory } from "@storyblok/react/rsc";
import { Metadata } from "next";
import { draftMode } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { isEnabled } = await draftMode();
    const story = await getStoryBySlug("home", isEnabled);

    return {
      title: story.content.seo_title || "NexusBio Therapeutics",
      description:
        story.content.seo_description ||
        "Advancing oncology therapeutics through innovative research",
      openGraph: {
        title: story.content.seo_title,
        description: story.content.seo_description,
        images: story.content.og_image
          ? [{ url: story.content.og_image.filename }]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: story.content.seo_title,
        description: story.content.seo_description,
        images: story.content.og_image ? [story.content.og_image.filename] : [],
      },
    };
  } catch {
    return {
      title: "NexusBio Therapeutics",
      description: "Advancing oncology therapeutics through innovative research",
    };
  }
}

export default async function HomePage() {
  try {
    const { isEnabled } = await draftMode();
    const story = await getStoryBySlug("home", isEnabled);

    return <StoryblokStory story={story} />;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-lg px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Content Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Please create a story with slug &quot;home&quot; in Storyblok to see
            your landing page.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 text-left">
            <h2 className="font-semibold text-blue-900 mb-2">Quick Setup:</h2>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Copy .env.example to .env.local</li>
              <li>Add your Storyblok access token</li>
              <li>Create component schemas in Storyblok</li>
              <li>Create a story with slug &quot;home&quot;</li>
              <li>Add page sections and publish</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

// Enable ISR with 60-second revalidation
export const revalidate = 60;
