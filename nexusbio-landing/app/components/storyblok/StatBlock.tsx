import { storyblokEditable } from "@storyblok/react/rsc";
import { StatBlockStoryblok } from "@/app/types/storyblok";

export default function StatBlock({ blok }: { blok: StatBlockStoryblok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="bg-white rounded-xl p-8 text-center shadow-md"
    >
      {/* Metric */}
      <div className="text-5xl font-bold text-blue-600 mb-2">{blok.metric}</div>

      {/* Label */}
      <div className="text-lg font-semibold text-gray-900 mb-3">
        {blok.metric_label}
      </div>

      {/* Context */}
      {blok.context && (
        <p className="text-sm text-gray-600 leading-relaxed">{blok.context}</p>
      )}
    </div>
  );
}
