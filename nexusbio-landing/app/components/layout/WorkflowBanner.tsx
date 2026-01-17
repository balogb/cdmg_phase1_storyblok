"use client";

import { useSearchParams } from "next/navigation";

interface WorkflowBannerProps {
  workflowStepId?: number | null;
  tagList?: string[];
}

/**
 * WorkflowBanner
 * Displays the current Storyblok workflow stage when in preview mode.
 * This is dynamic to handle any workflow step IDs, even beyond the free tier.
 */
export default function WorkflowBanner({ workflowStepId, tagList = [] }: WorkflowBannerProps) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("_storyblok") !== null;

  // Only show in preview mode
  if (!isPreview) return null;

  // Best practice: Map IDs to human names if known, otherwise fallback to ID
  const stepMap: Record<number, string> = {
    0: "Draft",
    // These are common IDs, but we should be flexible
  };

  const stepName = workflowStepId !== undefined && workflowStepId !== null 
    ? stepMap[workflowStepId] || `Stage ID: ${workflowStepId}`
    : "No Stage Defined";

  const isLegalApproved = tagList.includes("Legal Approved");

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <div className={`px-4 py-2 rounded-full shadow-lg border-2 text-sm font-bold flex items-center gap-2 ${
        isLegalApproved ? "bg-green-100 border-green-500 text-green-700" : "bg-blue-100 border-blue-500 text-blue-700"
      }`}>
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
        WORKFLOW: {stepName.toUpperCase()}
      </div>
      
      {tagList.length > 0 && (
        <div className="flex flex-wrap justify-end gap-1">
          {tagList.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-800 text-white text-[10px] rounded uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
