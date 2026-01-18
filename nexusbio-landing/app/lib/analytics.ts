/**
 * Analytics Event Logging Utility
 *
 * Centralized event logging for all tracking needs:
 * - Page views and user engagement
 * - Conversion events
 * - Experiment exposures
 * - Workflow events
 * - System events
 *
 * STATUS: SCAFFOLD with console logging
 * Phase 2+: Connect to analytics backend (GA4, Segment, custom)
 */

import type {
  TrackingEvent,
  ConversionEvent,
  ConversionEventType,
  AnalyticsEvent,
} from "@/app/types/integration-hooks";

/**
 * Analytics configuration
 * Configure these in environment variables for Phase 2+
 */
const config = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
  debug: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true",
  endpoint: process.env.ANALYTICS_ENDPOINT || "/api/analytics/events",
};

/**
 * Generate unique IDs for tracking
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create session ID (persists across page loads)
 */
function getSessionId(): string {
  if (typeof window === "undefined") return "server";

  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

/**
 * Get or create user ID (persists across sessions)
 */
function getUserId(): string {
  if (typeof window === "undefined") return "server";

  let userId = localStorage.getItem("analytics_user_id");
  if (!userId) {
    userId = generateId();
    localStorage.setItem("analytics_user_id", userId);
  }
  return userId;
}

/**
 * Log event to console in debug mode
 */
function debugLog(event: TrackingEvent | AnalyticsEvent): void {
  if (config.debug) {
    console.log("[Analytics]", JSON.stringify(event, null, 2));
  }
}

/**
 * Send event to analytics backend
 * SCAFFOLD: Currently logs to console, implement API call in Phase 2+
 */
async function sendEvent(event: TrackingEvent | AnalyticsEvent): Promise<void> {
  debugLog(event);

  if (!config.enabled) {
    return;
  }

  // PHASE 2+ IMPLEMENTATION:
  // Option 1: Send to custom analytics endpoint
  // await fetch(config.endpoint, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(event),
  // });

  // Option 2: Send to Google Analytics 4
  // gtag("event", event.eventName, event.properties);

  // Option 3: Send to Segment
  // analytics.track(event.eventName, event.properties);
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Track page view
 */
export function trackPageView(pagePath: string, pageTitle: string): void {
  const event: TrackingEvent = {
    eventName: "page_view",
    eventType: "page_view",
    timestamp: new Date().toISOString(),
    userId: getUserId(),
    sessionId: getSessionId(),
    properties: {
      path: pagePath,
      title: pageTitle,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    },
  };

  sendEvent(event);
}

/**
 * Track conversion event
 */
export function trackConversion(
  conversionType: ConversionEventType,
  properties: Record<string, string | number | boolean> = {}
): void {
  const event: ConversionEvent = {
    eventName: conversionType,
    eventType: "conversion",
    conversionType,
    timestamp: new Date().toISOString(),
    userId: getUserId(),
    sessionId: getSessionId(),
    properties: {
      ...properties,
      url: typeof window !== "undefined" ? window.location.href : "",
    },
  };

  sendEvent(event);
}

/**
 * Track CTA click
 */
export function trackCTAClick(ctaText: string, ctaDestination: string): void {
  trackConversion("cta_click", {
    cta_text: ctaText,
    cta_destination: ctaDestination,
  });
}

/**
 * Track resource download
 */
export function trackResourceDownload(
  resourceTitle: string,
  resourceType: string,
  resourceUrl: string
): void {
  trackConversion("resource_download", {
    resource_title: resourceTitle,
    resource_type: resourceType,
    resource_url: resourceUrl,
  });
}

/**
 * Track contact form submission
 */
export function trackContactFormSubmit(inquiryType: string): void {
  trackConversion("contact_form_submit", {
    inquiry_type: inquiryType,
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: 50 | 100): void {
  const eventType: ConversionEventType =
    depth === 50 ? "scroll_depth_50" : "scroll_depth_100";
  trackConversion(eventType, { depth_percent: depth });
}

/**
 * Track experiment exposure
 * Used when a user is bucketed into an experiment variation
 */
export function trackExperimentExposure(
  experimentKey: string,
  variationKey: string
): void {
  const event: TrackingEvent = {
    eventName: "experiment_exposure",
    eventType: "custom",
    timestamp: new Date().toISOString(),
    userId: getUserId(),
    sessionId: getSessionId(),
    properties: {
      experiment_key: experimentKey,
      variation_key: variationKey,
    },
    experimentContext: {
      experimentKey,
      variationKey,
    },
  };

  sendEvent(event);
}

/**
 * Track experiment conversion
 * Used when a user converts within an experiment
 */
export function trackExperimentConversion(
  experimentKey: string,
  variationKey: string,
  conversionType: ConversionEventType,
  value?: number
): void {
  const event: ConversionEvent = {
    eventName: `experiment_${conversionType}`,
    eventType: "conversion",
    conversionType,
    conversionValue: value,
    timestamp: new Date().toISOString(),
    userId: getUserId(),
    sessionId: getSessionId(),
    properties: {
      experiment_key: experimentKey,
      variation_key: variationKey,
    },
    experimentContext: {
      experimentKey,
      variationKey,
    },
  };

  sendEvent(event);
}

/**
 * Track workflow event (server-side)
 */
export function trackWorkflowEvent(
  eventName: string,
  storyId: number,
  storySlug: string,
  data: Record<string, string | number | boolean>
): void {
  const event: AnalyticsEvent = {
    eventId: generateId(),
    eventName,
    eventCategory: "workflow",
    timestamp: new Date().toISOString(),
    source: "webhook",
    data: {
      story_id: storyId,
      story_slug: storySlug,
      ...data,
    },
  };

  sendEvent(event);
}

/**
 * Track AI generation event (server-side)
 */
export function trackAIGeneration(
  sourceStoryId: number,
  platform: "meta" | "google" | "print",
  variantCount: number,
  generationTime: number
): void {
  const event: AnalyticsEvent = {
    eventId: generateId(),
    eventName: "ai_variant_generated",
    eventCategory: "content",
    timestamp: new Date().toISOString(),
    source: "api",
    data: {
      source_story_id: sourceStoryId,
      platform,
      variant_count: variantCount,
      generation_time_ms: generationTime,
    },
  };

  sendEvent(event);
}

// =============================================================================
// REACT HOOKS (for client-side tracking)
// =============================================================================

/**
 * Hook to track page views automatically
 * Usage: usePageTracking() in layout or page component
 */
export function usePageTracking(): void {
  if (typeof window === "undefined") return;

  // Track on mount
  trackPageView(window.location.pathname, document.title);
}

/**
 * Hook to track scroll depth
 * Usage: useScrollTracking() in page component
 */
export function useScrollTracking(): void {
  if (typeof window === "undefined") return;

  let tracked50 = false;
  let tracked100 = false;

  const handleScroll = () => {
    const scrollPercent =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;

    if (!tracked50 && scrollPercent >= 50) {
      tracked50 = true;
      trackScrollDepth(50);
    }

    if (!tracked100 && scrollPercent >= 95) {
      tracked100 = true;
      trackScrollDepth(100);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Cleanup would be handled by useEffect in actual React component
}
