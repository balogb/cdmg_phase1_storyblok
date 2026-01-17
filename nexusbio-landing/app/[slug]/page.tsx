import { getStoryBySlug } from "@/app/lib/storyblok-client";
import { StoryblokStory } from "@storyblok/react/rsc";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { isEnabled } = await draftMode();
    const story = await getStoryBySlug(slug, isEnabled);

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
      },
    };
  } catch {
    return {
      title: "NexusBio Therapeutics",
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  let story;
  
  try {
    story = await getStoryBySlug(slug, isEnabled);
  } catch (error) {
    console.error(`Story not found for slug: ${slug}`, error);
    notFound();
  }

  return <StoryblokStory story={story} />;
}

export const revalidate = 60;
