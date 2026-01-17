import { StoryblokServerComponent } from "@storyblok/react/rsc";
import { PageStoryblok } from "@/app/types/storyblok";

export default function Page({ blok }: { blok: PageStoryblok }) {
  return (
    <main>
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}
