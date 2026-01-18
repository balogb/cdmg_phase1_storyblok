/**
 * Optimizely Integration Scaffold
 *
 * This module provides the foundation for Phase 3 Optimizely integration.
 * It defines the experiment context and decision functions that will be
 * implemented with the actual Optimizely SDK.
 *
 * STATUS: SCAFFOLD ONLY - Implement with Optimizely SDK in Phase 3
 *
 * Phase 3 Implementation:
 * 1. npm install @optimizely/react-sdk
 * 2. Replace scaffold functions with SDK calls
 * 3. Configure SDK key via OPTIMIZELY_SDK_KEY env var
 */

import type {
  OptimizelyConfig,
  Experiment,
  ExperimentUserContext,
  ExperimentVariation,
} from "@/app/types/integration-hooks";
import { trackExperimentExposure } from "./analytics";

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Optimizely configuration
 * Set OPTIMIZELY_SDK_KEY in environment variables for Phase 3
 */
const config: OptimizelyConfig = {
  sdkKey: process.env.OPTIMIZELY_SDK_KEY || "",
  logLevel: process.env.NODE_ENV === "production" ? "WARNING" : "DEBUG",
};

/**
 * Check if Optimizely is configured
 */
export function isOptimizelyEnabled(): boolean {
  return Boolean(config.sdkKey);
}

// =============================================================================
// USER CONTEXT
// =============================================================================

/**
 * Create user context for experiment bucketing
 * This determines which variation a user sees
 */
export function createUserContext(
  userId?: string,
  attributes?: ExperimentUserContext["attributes"]
): ExperimentUserContext {
  // Get or generate user ID
  const resolvedUserId =
    userId ||
    (typeof window !== "undefined"
      ? localStorage.getItem("optimizely_user_id") ||
        `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : `server_${Date.now()}`);

  // Persist user ID
  if (typeof window !== "undefined" && !userId) {
    localStorage.setItem("optimizely_user_id", resolvedUserId);
  }

  // Detect device type
  const deviceType: ExperimentUserContext["attributes"]["deviceType"] =
    typeof window !== "undefined"
      ? window.innerWidth < 768
        ? "mobile"
        : window.innerWidth < 1024
        ? "tablet"
        : "desktop"
      : "desktop";

  return {
    userId: resolvedUserId,
    attributes: {
      deviceType,
      ...attributes,
    },
  };
}

// =============================================================================
// EXPERIMENT DECISIONS
// =============================================================================

/**
 * Get variation for an experiment
 *
 * SCAFFOLD: Returns control variation
 * Phase 3: Replace with actual Optimizely SDK decision
 *
 * @example
 * const variation = getVariation("hero_layout_test", userContext);
 * if (variation === "variant_b") {
 *   // Render variant B
 * }
 */
export function getVariation(
  experimentKey: string,
  userContext: ExperimentUserContext
): string {
  if (!isOptimizelyEnabled()) {
    console.log(
      `[Optimizely] SDK not configured, returning control for: ${experimentKey}`
    );
    return "control";
  }

  // PHASE 3 IMPLEMENTATION:
  // const client = getOptimizelyClient();
  // const user = client.createUserContext(userContext.userId, userContext.attributes);
  // const decision = user.decide(experimentKey);
  // return decision.variationKey;

  // SCAFFOLD: Return control and log
  console.log(`[Optimizely] SCAFFOLD: Would bucket user ${userContext.userId} into experiment ${experimentKey}`);

  // Track exposure for analytics
  trackExperimentExposure(experimentKey, "control");

  return "control";
}

/**
 * Get all active experiments for a user
 *
 * SCAFFOLD: Returns empty array
 * Phase 3: Replace with actual experiment list
 */
export function getActiveExperiments(
  userContext: ExperimentUserContext
): Array<{ experimentKey: string; variationKey: string }> {
  if (!isOptimizelyEnabled()) {
    return [];
  }

  // PHASE 3 IMPLEMENTATION:
  // const client = getOptimizelyClient();
  // const user = client.createUserContext(userContext.userId, userContext.attributes);
  // const decisions = user.decideAll();
  // return decisions.map(d => ({ experimentKey: d.flagKey, variationKey: d.variationKey }));

  return [];
}

/**
 * Check if a feature flag is enabled
 *
 * SCAFFOLD: Returns false
 * Phase 3: Replace with actual feature flag check
 */
export function isFeatureEnabled(
  featureKey: string,
  userContext: ExperimentUserContext
): boolean {
  if (!isOptimizelyEnabled()) {
    return false;
  }

  // PHASE 3 IMPLEMENTATION:
  // const client = getOptimizelyClient();
  // const user = client.createUserContext(userContext.userId, userContext.attributes);
  // const decision = user.decide(featureKey);
  // return decision.enabled;

  console.log(`[Optimizely] SCAFFOLD: Would check feature ${featureKey}`);
  return false;
}

/**
 * Get feature variable value
 *
 * SCAFFOLD: Returns default value
 * Phase 3: Replace with actual variable retrieval
 */
export function getFeatureVariable<T extends string | number | boolean>(
  featureKey: string,
  variableKey: string,
  userContext: ExperimentUserContext,
  defaultValue: T
): T {
  if (!isOptimizelyEnabled()) {
    return defaultValue;
  }

  // PHASE 3 IMPLEMENTATION:
  // const client = getOptimizelyClient();
  // const user = client.createUserContext(userContext.userId, userContext.attributes);
  // const decision = user.decide(featureKey);
  // return decision.variables[variableKey] as T ?? defaultValue;

  console.log(`[Optimizely] SCAFFOLD: Would get variable ${variableKey} from ${featureKey}`);
  return defaultValue;
}

// =============================================================================
// REACT INTEGRATION SCAFFOLDS
// =============================================================================

/**
 * React context for Optimizely (scaffold)
 *
 * Phase 3: Replace with OptimizelyProvider from @optimizely/react-sdk
 *
 * @example
 * // In layout.tsx
 * <OptimizelyProvider>
 *   {children}
 * </OptimizelyProvider>
 *
 * // In component
 * const { variation } = useExperiment("hero_layout_test");
 */
export interface OptimizelyContextValue {
  isReady: boolean;
  userContext: ExperimentUserContext | null;
  getVariation: (experimentKey: string) => string;
  isFeatureEnabled: (featureKey: string) => boolean;
}

/**
 * Hook scaffold for experiments
 *
 * Phase 3: Replace with useDecision from @optimizely/react-sdk
 *
 * @example
 * function HeroSection() {
 *   const { variation, isReady } = useExperiment("hero_layout_test");
 *
 *   if (!isReady) return <Loading />;
 *
 *   return variation === "variant_b"
 *     ? <HeroVariantB />
 *     : <HeroControl />;
 * }
 */
export function useExperiment(experimentKey: string): {
  variation: string;
  isReady: boolean;
} {
  // PHASE 3 IMPLEMENTATION:
  // const [decision, clientReady] = useDecision(experimentKey);
  // return {
  //   variation: decision.variationKey,
  //   isReady: clientReady,
  // };

  return {
    variation: "control",
    isReady: true,
  };
}

/**
 * Hook scaffold for feature flags
 *
 * Phase 3: Replace with useDecision from @optimizely/react-sdk
 */
export function useFeatureFlag(featureKey: string): {
  enabled: boolean;
  variables: Record<string, unknown>;
  isReady: boolean;
} {
  // PHASE 3 IMPLEMENTATION:
  // const [decision, clientReady] = useDecision(featureKey);
  // return {
  //   enabled: decision.enabled,
  //   variables: decision.variables,
  //   isReady: clientReady,
  // };

  return {
    enabled: false,
    variables: {},
    isReady: true,
  };
}

// =============================================================================
// EXPERIMENT WRAPPER COMPONENT PATTERN
// =============================================================================

/**
 * Experiment wrapper component pattern
 *
 * This pattern allows wrapping any component with A/B testing logic.
 * The actual implementation will use Optimizely's React SDK.
 *
 * @example
 * // Define experiment variations
 * const heroExperiment = {
 *   control: HeroSectionControl,
 *   variant_b: HeroSectionVariantB,
 * };
 *
 * // Use in page
 * <ExperimentWrapper
 *   experimentKey="hero_layout_test"
 *   variations={heroExperiment}
 *   fallback={<HeroSectionControl />}
 * />
 */
export interface ExperimentWrapperProps<T extends string> {
  experimentKey: string;
  variations: Record<T, React.ComponentType<unknown>>;
  fallback: React.ReactNode;
  // Props to pass to the variation component
  componentProps?: Record<string, unknown>;
}

/**
 * Type helper for experiment variations
 */
export type VariationComponent = React.ComponentType<{
  blok: unknown;
  experimentContext?: {
    experimentKey: string;
    variationKey: string;
  };
}>;
