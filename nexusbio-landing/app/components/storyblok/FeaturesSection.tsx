import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";
import { FeaturesSectionStoryblok } from "@/app/types/storyblok";

export default function FeaturesSection({
  blok,
}: {
  blok: FeaturesSectionStoryblok;
}) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {blok.section_title}
          </h2>
          {blok.section_subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {blok.section_subtitle}
            </p>
          )}
        </div>

        {/* Feature Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blok.features?.map((feature) => (
            <StoryblokServerComponent blok={feature} key={feature._uid} />
          ))}
        </div>
      </div>
    </section>
  );
}
