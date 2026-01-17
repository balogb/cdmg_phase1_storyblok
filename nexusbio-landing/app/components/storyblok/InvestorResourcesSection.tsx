import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";
import { InvestorResourcesSectionStoryblok } from "@/app/types/storyblok";

export default function InvestorResourcesSection({
  blok,
}: {
  blok: InvestorResourcesSectionStoryblok;
}) {
  return (
    <section {...storyblokEditable(blok)} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          {blok.section_title}
        </h2>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blok.resources?.map((resource) => (
            <StoryblokServerComponent blok={resource} key={resource._uid} />
          ))}
        </div>
      </div>
    </section>
  );
}
