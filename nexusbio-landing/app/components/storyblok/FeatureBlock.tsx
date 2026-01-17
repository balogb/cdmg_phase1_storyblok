import { storyblokEditable } from "@storyblok/react/rsc";
import { FeatureBlockStoryblok } from "@/app/types/storyblok";
import Image from "next/image";

export default function FeatureBlock({ blok }: { blok: FeatureBlockStoryblok }) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* Icon */}
      {blok.icon?.filename && (
        <div className="mb-6">
          <Image
            src={blok.icon.filename}
            alt={blok.icon.alt || ""}
            width={64}
            height={64}
            className="w-16 h-16"
          />
        </div>
      )}

      {/* Fallback icon placeholder */}
      {!blok.icon?.filename && (
        <div className="mb-6 w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">{blok.title}</h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed mb-4">{blok.description}</p>

      {/* Citation */}
      {blok.citation && (
        <p className="text-sm text-gray-500 italic border-t pt-3">
          {blok.citation}
        </p>
      )}
    </div>
  );
}
