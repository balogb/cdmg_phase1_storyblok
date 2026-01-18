/**
 * Integration Hooks Type Definitions
 *
 * This file defines the interfaces and types for future phase integrations.
 * Phase 1: Define types only (no implementation)
 * Phase 2+: Implement against these contracts
 *
 * IMPORTANT: These are scaffolds/contracts for future development.
 * Do not implement until the respective phase begins.
 */

// =============================================================================
// PHASE 2: RELEVANCE AI - Content Transformation
// =============================================================================

/**
 * Platform-specific content constraints for AI-generated copy
 */
export interface PlatformConstraints {
  meta: {
    primaryText: { maxLength: 125; recommended: 90 };
    headline: { maxLength: 40; recommended: 27 };
    description: { maxLength: 30; recommended: 27 };
    imageRatio: "1:1" | "1.91:1" | "4:5";
  };
  google: {
    headline: { maxLength: 30; count: 15 };
    description: { maxLength: 90; count: 4 };
    path: { maxLength: 15; count: 2 };
  };
  print: {
    headline: { maxLength: 80 };
    body: { maxLength: 2000 };
    disclaimer: { required: true };
  };
}

/**
 * Source content extracted from CMS for AI transformation
 */
export interface AISourceContent {
  storyId: number;
  storySlug: string;
  extractedAt: string;
  components: AIComponentContent[];
}

/**
 * Individual component content with semantic metadata
 */
export interface AIComponentContent {
  componentType: string;
  uid: string;
  fields: Record<string, AIFieldContent>;
}

/**
 * Field content with semantic hints for AI
 */
export interface AIFieldContent {
  value: string;
  semantic: string; // e.g., "SEMANTIC:headline"
  maxLength?: number;
  required?: boolean;
}

/**
 * AI-generated content variants per platform
 */
export interface AIGeneratedVariants {
  sourceStoryId: number;
  generatedAt: string;
  variants: {
    meta?: MetaAdVariant[];
    google?: GoogleAdVariant[];
    print?: PrintVariant;
  };
  approvalStatus: "pending" | "approved" | "rejected";
}

export interface MetaAdVariant {
  variantId: string;
  primaryText: string;
  headline: string;
  description: string;
  imageUrl?: string;
  ctaType: "LEARN_MORE" | "SIGN_UP" | "CONTACT_US" | "DOWNLOAD";
}

export interface GoogleAdVariant {
  variantId: string;
  headlines: string[]; // Up to 15
  descriptions: string[]; // Up to 4
  finalUrl: string;
  paths: string[]; // Up to 2
}

export interface PrintVariant {
  variantId: string;
  headline: string;
  subheadline: string;
  bodyContent: string;
  disclaimer: string;
  citations: string[];
}

/**
 * API endpoint contract for Phase 2
 * Endpoint: GET /api/ai/export-content?storySlug=home
 */
export interface AIContentExportResponse {
  success: boolean;
  data?: AISourceContent;
  error?: string;
}

/**
 * API endpoint contract for Phase 2
 * Endpoint: POST /api/ai/store-variants
 */
export interface AIVariantStorageRequest {
  sourceStoryId: number;
  variants: AIGeneratedVariants["variants"];
}

// =============================================================================
// PHASE 3: OPTIMIZELY - Experimentation & Tracking
// =============================================================================

/**
 * Optimizely SDK configuration placeholder
 * Will be populated with actual SDK key in Phase 3
 */
export interface OptimizelyConfig {
  sdkKey: string; // Will be set via env var: OPTIMIZELY_SDK_KEY
  datafileUrl?: string;
  eventDispatcher?: "default" | "custom";
  logLevel: "DEBUG" | "INFO" | "WARNING" | "ERROR";
}

/**
 * Experiment definition for A/B tests
 */
export interface Experiment {
  experimentKey: string;
  experimentId: string;
  status: "draft" | "running" | "paused" | "concluded";
  variations: ExperimentVariation[];
  metrics: ExperimentMetric[];
  trafficAllocation: number; // 0-100
}

export interface ExperimentVariation {
  variationKey: string;
  variationId: string;
  featureEnabled: boolean;
  variables: Record<string, string | number | boolean>;
}

export interface ExperimentMetric {
  metricKey: string;
  metricType: "conversion" | "revenue" | "engagement";
  eventName: string;
  aggregation: "unique" | "total" | "sum";
}

/**
 * User context for experiment bucketing
 */
export interface ExperimentUserContext {
  userId: string; // Anonymous or authenticated
  attributes: {
    deviceType?: "mobile" | "tablet" | "desktop";
    trafficSource?: string;
    userAgent?: string;
    geo?: string;
    isReturningVisitor?: boolean;
    [key: string]: string | number | boolean | undefined;
  };
}

/**
 * Tracking event for analytics
 */
export interface TrackingEvent {
  eventName: string;
  eventType: "page_view" | "conversion" | "engagement" | "custom";
  timestamp: string;
  userId: string;
  sessionId: string;
  properties: Record<string, string | number | boolean>;
  experimentContext?: {
    experimentKey: string;
    variationKey: string;
  };
}

/**
 * Predefined conversion events for IR landing pages
 */
export type ConversionEventType =
  | "cta_click"
  | "resource_download"
  | "contact_form_submit"
  | "video_play"
  | "scroll_depth_50"
  | "scroll_depth_100"
  | "time_on_page_30s"
  | "time_on_page_60s"
  | "external_link_click";

/**
 * Conversion event definition
 */
export interface ConversionEvent extends TrackingEvent {
  eventType: "conversion";
  conversionType: ConversionEventType;
  conversionValue?: number; // For revenue tracking
}

// =============================================================================
// WORKFLOW APPROVALS - Content Governance
// =============================================================================

/**
 * Workflow stage definitions
 * Map to Storyblok workflow_step_id values
 */
export enum WorkflowStage {
  DRAFT = "draft",
  CONTENT_REVIEW = "content_review",
  LEGAL_REVIEW = "legal_review",
  COMPLIANCE_REVIEW = "compliance_review",
  FINAL_APPROVAL = "final_approval",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

/**
 * Workflow stage metadata
 * Configure in Storyblok, reference here for application logic
 */
export interface WorkflowStageConfig {
  stage: WorkflowStage;
  storyblokStepId: number; // Maps to Storyblok workflow_step_id
  displayName: string;
  color: string;
  requiredApprovers: ApproverRole[];
  autoAuditOnEntry: boolean;
  notifyOnEntry: NotificationTarget[];
}

export type ApproverRole =
  | "content_author"
  | "content_editor"
  | "legal_counsel"
  | "compliance_officer"
  | "marketing_director"
  | "executive_sponsor";

export type NotificationTarget =
  | "author"
  | "editors"
  | "legal_team"
  | "compliance_team"
  | "slack_channel"
  | "email_list";

/**
 * Approval action record
 */
export interface ApprovalAction {
  actionId: string;
  storyId: number;
  storySlug: string;
  fromStage: WorkflowStage;
  toStage: WorkflowStage;
  actionType: "approve" | "reject" | "request_changes";
  actionBy: {
    userId: string;
    email: string;
    role: ApproverRole;
  };
  timestamp: string;
  comment?: string;
  auditResults?: AuditResult;
}

/**
 * Audit result from automated checks
 */
export interface AuditResult {
  auditId: string;
  runAt: string;
  passed: boolean;
  checks: {
    accessibility: AuditCheckResult;
    responsive: AuditCheckResult;
    compliance?: AuditCheckResult;
  };
}

export interface AuditCheckResult {
  passed: boolean;
  score?: number;
  violations: AuditViolation[];
}

export interface AuditViolation {
  rule: string;
  severity: "error" | "warning" | "info";
  description: string;
  element?: string;
  suggestion?: string;
}

/**
 * Storyblok webhook payload for workflow events
 */
export interface StoryblokWorkflowWebhook {
  action: "workflow_step_changed" | "published" | "unpublished" | "moved";
  story_id: number;
  space_id: number;
  full_slug: string;
  workflow_step_id: number | null;
  workflow_step_name?: string;
  user_id: number;
  timestamp: string;
}

/**
 * Notification payload for workflow events
 */
export interface WorkflowNotification {
  type: "stage_change" | "approval_required" | "audit_failed" | "published";
  storyId: number;
  storyName: string;
  storySlug: string;
  currentStage: WorkflowStage;
  previousStage?: WorkflowStage;
  triggeredBy: string;
  message: string;
  actionUrl: string; // Deep link to Storyblok editor
  recipients: NotificationTarget[];
}

// =============================================================================
// TABLEAU ANALYTICS - Dashboard & Reporting
// =============================================================================

/**
 * Analytics event schema for Tableau consumption
 * Events are logged and exported for dashboard visualization
 */
export interface AnalyticsEvent {
  eventId: string;
  eventName: string;
  eventCategory: "content" | "experiment" | "workflow" | "user" | "system";
  timestamp: string;
  source: "web" | "api" | "webhook" | "cron";
  data: Record<string, string | number | boolean | null>;
}

/**
 * Content performance metrics for Tableau
 */
export interface ContentMetrics {
  storyId: number;
  storySlug: string;
  period: "hourly" | "daily" | "weekly" | "monthly";
  periodStart: string;
  periodEnd: string;
  metrics: {
    pageViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    bounceRate: number;
    scrollDepth: {
      reached25: number;
      reached50: number;
      reached75: number;
      reached100: number;
    };
    conversions: Record<ConversionEventType, number>;
    deviceBreakdown: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    trafficSources: Record<string, number>;
  };
}

/**
 * Experiment metrics for Tableau
 */
export interface ExperimentMetrics {
  experimentKey: string;
  experimentName: string;
  status: Experiment["status"];
  startDate: string;
  endDate?: string;
  variations: {
    variationKey: string;
    visitors: number;
    conversions: number;
    conversionRate: number;
    revenue?: number;
    confidence?: number;
    isWinner?: boolean;
  }[];
  primaryMetric: {
    name: string;
    controlRate: number;
    treatmentRate: number;
    lift: number;
    statisticalSignificance: number;
  };
}

/**
 * Workflow metrics for Tableau
 */
export interface WorkflowMetrics {
  period: "daily" | "weekly" | "monthly";
  periodStart: string;
  periodEnd: string;
  metrics: {
    storiesCreated: number;
    storiesPublished: number;
    avgTimeToPublish: number; // hours
    approvalsByStage: Record<WorkflowStage, number>;
    rejectionsByStage: Record<WorkflowStage, number>;
    auditPassRate: number;
    auditFailures: {
      accessibility: number;
      responsive: number;
      compliance: number;
    };
  };
}

/**
 * AI generation metrics for Tableau
 */
export interface AIGenerationMetrics {
  period: "daily" | "weekly" | "monthly";
  periodStart: string;
  periodEnd: string;
  metrics: {
    variantsGenerated: number;
    variantsApproved: number;
    variantsRejected: number;
    byPlatform: {
      meta: number;
      google: number;
      print: number;
    };
    avgGenerationTime: number; // seconds
    topPerformingVariants: {
      variantId: string;
      platform: string;
      conversionRate: number;
    }[];
  };
}

/**
 * Tableau data export format
 * Endpoint: GET /api/analytics/export?type=content&period=daily&format=json
 */
export interface TableauExportRequest {
  type: "content" | "experiment" | "workflow" | "ai";
  period: "hourly" | "daily" | "weekly" | "monthly";
  startDate?: string;
  endDate?: string;
  format: "json" | "csv";
}

export interface TableauExportResponse {
  success: boolean;
  exportedAt: string;
  recordCount: number;
  data: ContentMetrics[] | ExperimentMetrics[] | WorkflowMetrics[] | AIGenerationMetrics[];
  nextPageToken?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * API response wrapper for consistency
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

/**
 * Pagination for list endpoints
 */
export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
