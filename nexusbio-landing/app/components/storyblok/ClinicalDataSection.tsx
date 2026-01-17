import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";
import { ClinicalDataSectionStoryblok } from "@/app/types/storyblok";
import { render } from "storyblok-rich-text-react-renderer";

export default function ClinicalDataSection({
  blok,
}: {
  blok: ClinicalDataSectionStoryblok;
}) {
  return (
    <section {...storyblokEditable(blok)} className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          {blok.section_title}
        </h2>

        {/* Data Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blok.data_points?.map((stat) => (
            <StoryblokServerComponent blok={stat} key={stat._uid} />
          ))}
        </div>

        {/* Data Source */}
        {blok.data_source && (
          <p className="text-center text-sm text-gray-600 mb-8">
            Data Source: {blok.data_source}
          </p>
        )}

        {/* Trial Disclaimer */}
        {blok.trial_disclaimer && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 border-l-4 border-blue-600">
            <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
              {render(blok.trial_disclaimer as Parameters<typeof render>[0])}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
