import { storyblokEditable } from "@storyblok/react/rsc";
import { ResourceLinkStoryblok } from "@/app/types/storyblok";
import Link from "next/link";

const fileTypeIcons: Record<string, string> = {
  pdf: "PDF",
  sec: "SEC",
  presentation: "PPT",
  external: "Link",
};

const fileTypeColors: Record<string, string> = {
  pdf: "bg-red-100 text-red-600",
  sec: "bg-green-100 text-green-600",
  presentation: "bg-orange-100 text-orange-600",
  external: "bg-blue-100 text-blue-600",
};

export default function ResourceLink({ blok }: { blok: ResourceLinkStoryblok }) {
  return (
    <Link
      href={blok.link?.cached_url || "#"}
      {...storyblokEditable(blok)}
      className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-6 border border-gray-200 transition-colors group"
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold ${
            fileTypeColors[blok.file_type] || fileTypeColors.external
          }`}
        >
          {fileTypeIcons[blok.file_type] || "Link"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-1 truncate">
            {blok.title}
          </h3>
          {blok.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {blok.description}
            </p>
          )}
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
