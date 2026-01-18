# Integration Hooks Documentation

This document describes the preparatory scaffolds and API contracts implemented in Phase 1 to support future phase integrations.

## Overview

| Phase | Integration | Status | Hooks Ready |
|-------|-------------|--------|-------------|
| Phase 2 | Relevance AI | Scaffold | Content export, variant storage |
| Phase 3 | Optimizely | Scaffold | Experiment decisions, tracking |
| Ongoing | Workflow Approvals | Partial | Webhook handler, stage definitions |
| Ongoing | Tableau Analytics | Scaffold | Event logging, data export |

---

## Phase 2: Relevance AI Integration

### Purpose
Generate platform-specific content variants (Meta Ads, Google Ads, Print) from CMS content using AI.

### Implemented Hooks

#### 1. Content Export Endpoint
**File:** `app/api/ai/export-content/route.ts`
**Endpoint:** `GET /api/ai/export-content?storySlug=home`

Exports CMS content in AI-friendly format with SEMANTIC metadata.

```typescript
// Response structure
interface AIContentExportResponse {
  success: boolean;
  data: {
    storyId: number;
    storySlug: string;
    extractedAt: string;
    components: Array<{
      componentType: string;
      uid: string;
      fields: Record<string, {
        value: string;
        semantic: string;  // e.g., "SEMANTIC:headline"
        maxLength?: number;
        required?: boolean;
      }>;
    }>;
  };
}
```

#### 2. Variant Storage Endpoint
**File:** `app/api/ai/store-variants/route.ts`
**Endpoint:** `POST /api/ai/store-variants`

Stores AI-generated variants for approval workflow.

```typescript
// Request body
interface AIVariantStorageRequest {
  sourceStoryId: number;
  variants: {
    meta?: MetaAdVariant[];
    google?: GoogleAdVariant[];
    print?: PrintVariant;
  };
}
```

#### 3. AI Dictionary Generator
**File:** `scripts/generate-ai-dictionary.ts`
**Command:** `npm run generate:ai-dictionary`

Exports component schemas with semantic metadata for Relevance AI configuration.

### Platform Constraints (Defined)
**File:** `app/types/integration-hooks.ts`

```typescript
interface PlatformConstraints {
  meta: {
    primaryText: { maxLength: 125; recommended: 90 };
    headline: { maxLength: 40; recommended: 27 };
    // ...
  };
  google: {
    headline: { maxLength: 30; count: 15 };
    description: { maxLength: 90; count: 4 };
    // ...
  };
  print: {
    headline: { maxLength: 80 };
    body: { maxLength: 2000 };
    disclaimer: { required: true };
  };
}
```

### Phase 2 Implementation Checklist
- [ ] Install Relevance AI SDK
- [ ] Implement content extraction in export-content route
- [ ] Configure Relevance AI project with platform templates
- [ ] Implement variant storage (Storyblok datasource or database)
- [ ] Add variant approval UI in Storyblok
- [ ] Connect to workflow approval system

---

## Phase 3: Optimizely Integration

### Purpose
Enable A/B testing with one experiment to validate tracking and conversion measurement.

### Implemented Hooks

#### 1. Optimizely Utilities
**File:** `app/lib/optimizely.ts`

Provides scaffold functions that mirror the Optimizely React SDK API.

```typescript
// Get experiment variation
const variation = getVariation("hero_layout_test", userContext);
// Returns: "control" | "variant_b" | etc.

// Check feature flag
const enabled = isFeatureEnabled("new_cta_style", userContext);

// Get feature variable
const ctaText = getFeatureVariable("cta_experiment", "button_text", userContext, "Learn More");
```

#### 2. React Hooks (Scaffolds)
```typescript
// Use in components
function HeroSection({ blok }) {
  const { variation, isReady } = useExperiment("hero_layout_test");

  if (!isReady) return <Loading />;

  return variation === "variant_b"
    ? <HeroVariantB blok={blok} />
    : <HeroControl blok={blok} />;
}
```

#### 3. User Context
```typescript
// Create bucketing context
const userContext = createUserContext(userId, {
  deviceType: "mobile",
  trafficSource: "google_ads",
  isReturningVisitor: true,
});
```

#### 4. Experiment Tracking
**File:** `app/lib/analytics.ts`

```typescript
// Track experiment exposure
trackExperimentExposure("hero_layout_test", "variant_b");

// Track conversion within experiment
trackExperimentConversion("hero_layout_test", "variant_b", "cta_click");
```

### A/B Variant Support (Already Implemented)
**File:** `app/components/storyblok/HeroSection.tsx`

The HeroSection component already supports layout variants:

```typescript
const isVariantB = blok.variant === "variant_b";
// Layout adjusts based on variant (centered vs left-aligned)
```

### Phase 3 Implementation Checklist
- [ ] Install `@optimizely/react-sdk`
- [ ] Configure SDK with OPTIMIZELY_SDK_KEY
- [ ] Replace scaffold functions with SDK calls
- [ ] Create experiment in Optimizely dashboard
- [ ] Configure primary metric (e.g., CTA click rate)
- [ ] Set up GA4 or custom event tracking
- [ ] Run experiment with 50/50 traffic split
- [ ] Analyze results and validate tracking

---

## Workflow Approvals

### Purpose
Enforce content governance with multi-stage approval before deployment.

### Implemented Hooks

#### 1. Webhook Handler
**File:** `app/api/webhooks/storyblok/route.ts`

Receives Storyblok webhook events and triggers automated responses.

```
POST /api/webhooks/storyblok

Events handled:
- workflow_step_changed: Trigger audits, send notifications
- published: Log event, invalidate cache
- unpublished: Archive analytics data
```

#### 2. Workflow Stage Definitions
**File:** `app/types/integration-hooks.ts`

```typescript
enum WorkflowStage {
  DRAFT = "draft",
  CONTENT_REVIEW = "content_review",
  LEGAL_REVIEW = "legal_review",
  COMPLIANCE_REVIEW = "compliance_review",
  FINAL_APPROVAL = "final_approval",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}
```

#### 3. Workflow Banner (Implemented)
**File:** `app/components/layout/WorkflowBanner.tsx`

Displays current workflow stage in Visual Editor preview.

#### 4. Approval Action Types
```typescript
interface ApprovalAction {
  actionId: string;
  storyId: number;
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
```

### Storyblok Workflow Setup (Required)

1. **Create Workflow in Storyblok:**
   - Settings > Workflows > Create Workflow
   - Add stages: Draft → Content Review → Legal Review → Compliance Review → Final Approval

2. **Map Stage IDs:**
   Update `WORKFLOW_STAGE_MAP` in webhook route with actual Storyblok step IDs.

3. **Configure Webhook:**
   - Settings > Webhooks > Add Webhook
   - URL: `https://your-domain.com/api/webhooks/storyblok`
   - Secret: Set in `STORYBLOK_WEBHOOK_SECRET`
   - Events: `workflow_step_changed`, `published`, `unpublished`

### Implementation Checklist
- [ ] Create workflow stages in Storyblok (requires Premium plan)
- [ ] Map Storyblok step IDs to WorkflowStage enum
- [ ] Configure webhook URL and secret
- [ ] Implement notification sending (Slack/email)
- [ ] Add audit failure handling (auto-reject to Draft)
- [ ] Create Wrike task integration (Phase 4)

---

## Tableau Analytics

### Purpose
Centralized dashboard for content performance, experiment results, and workflow metrics.

### Implemented Hooks

#### 1. Analytics Event Logging
**File:** `app/lib/analytics.ts`

Centralized event tracking with scaffold for multiple backends.

```typescript
// Page tracking
trackPageView("/clinical-data", "Clinical Data | NexusBio");

// Conversion tracking
trackConversion("cta_click", { cta_text: "View Results" });
trackConversion("resource_download", { resource_type: "pdf" });
trackConversion("contact_form_submit", { inquiry_type: "Investor" });

// Scroll tracking
trackScrollDepth(50);
trackScrollDepth(100);

// Experiment tracking
trackExperimentExposure("hero_test", "variant_b");
trackExperimentConversion("hero_test", "variant_b", "cta_click");

// Workflow tracking (server-side)
trackWorkflowEvent("stage_changed", storyId, "home", {
  from_stage: "draft",
  to_stage: "legal_review",
});
```

#### 2. Analytics Export Endpoint
**File:** `app/api/analytics/export/route.ts`
**Endpoint:** `GET /api/analytics/export?type=content&period=daily&format=json`

Exports data in Tableau-consumable format.

```
Query Parameters:
- type: content | experiment | workflow | ai
- period: hourly | daily | weekly | monthly
- startDate: ISO date string
- endDate: ISO date string
- format: json | csv
```

#### 3. Metrics Types (Defined)
**File:** `app/types/integration-hooks.ts`

```typescript
interface ContentMetrics {
  storyId: number;
  storySlug: string;
  period: "daily" | "weekly" | "monthly";
  metrics: {
    pageViews: number;
    uniqueVisitors: number;
    avgTimeOnPage: number;
    bounceRate: number;
    scrollDepth: { reached25, reached50, reached75, reached100 };
    conversions: Record<ConversionEventType, number>;
    deviceBreakdown: { mobile, tablet, desktop };
    trafficSources: Record<string, number>;
  };
}

interface ExperimentMetrics {
  experimentKey: string;
  variations: Array<{
    variationKey: string;
    visitors: number;
    conversions: number;
    conversionRate: number;
    confidence?: number;
  }>;
}

interface WorkflowMetrics {
  storiesCreated: number;
  storiesPublished: number;
  avgTimeToPublish: number;
  auditPassRate: number;
}
```

### Tableau Connection Options

1. **Direct API Connection:**
   - Web Data Connector to `/api/analytics/export`
   - Scheduled refresh

2. **Database Intermediary:**
   - Events → PostgreSQL/BigQuery → Tableau
   - More scalable for large data volumes

3. **Google Analytics 4 Export:**
   - GA4 BigQuery export → Tableau
   - Native integration available

### Implementation Checklist
- [ ] Choose analytics backend (GA4, custom, Segment)
- [ ] Implement event storage (database or GA4)
- [ ] Connect analytics export endpoint to data source
- [ ] Create Tableau workbook with data source
- [ ] Build dashboards: Content, Experiments, Workflow
- [ ] Set up refresh schedule

---

## Environment Variables Summary

All integration hooks are configured via environment variables. See `.env.example` for complete list.

### Phase 1 (Current)
```
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN
STORYBLOK_MANAGEMENT_TOKEN
STORYBLOK_SPACE_ID
STORYBLOK_PREVIEW_SECRET
STORYBLOK_WEBHOOK_SECRET
```

### Phase 2 (Relevance AI)
```
RELEVANCE_AI_API_KEY
RELEVANCE_AI_PROJECT_ID
AI_VARIANTS_STORAGE
```

### Phase 3 (Optimizely)
```
OPTIMIZELY_SDK_KEY
OPTIMIZELY_ENVIRONMENT
```

### Analytics
```
NEXT_PUBLIC_ANALYTICS_ENABLED
NEXT_PUBLIC_ANALYTICS_DEBUG
ANALYTICS_ENDPOINT
NEXT_PUBLIC_GA4_MEASUREMENT_ID
```

### Notifications
```
SLACK_WEBHOOK_URL
SENDGRID_API_KEY
NOTIFICATION_EMAILS
```

### Tableau
```
TABLEAU_SERVER_URL
TABLEAU_API_TOKEN
TABLEAU_SITE_ID
```

---

## File Structure

```
app/
├── api/
│   ├── ai/
│   │   ├── export-content/route.ts    # Phase 2: Content export
│   │   └── store-variants/route.ts    # Phase 2: Variant storage
│   ├── analytics/
│   │   └── export/route.ts            # Tableau data export
│   └── webhooks/
│       └── storyblok/route.ts         # Workflow webhooks
├── lib/
│   ├── analytics.ts                   # Event tracking utility
│   └── optimizely.ts                  # Experiment utilities
└── types/
    └── integration-hooks.ts           # All integration types
```

---

## Testing Integration Hooks

### Verify Webhook Handler
```bash
# Send test webhook
curl -X POST http://localhost:3000/api/webhooks/storyblok \
  -H "Content-Type: application/json" \
  -d '{"action":"workflow_step_changed","story_id":123,"space_id":456,"workflow_step_id":789}'
```

### Verify Export Endpoint
```bash
# Request content export (will return 501 scaffold response)
curl http://localhost:3000/api/ai/export-content?storySlug=home

# Request analytics export
curl "http://localhost:3000/api/analytics/export?type=content&period=daily"
```

### Verify Analytics Logging
```javascript
// In browser console
import { trackCTAClick } from '@/app/lib/analytics';
trackCTAClick("View Results", "/clinical-data");
// Check console for [Analytics] log output
```

---

## Next Steps by Phase

### Before Phase 2 Begins
1. Confirm Relevance AI account and pricing
2. Document AI prompt templates for each platform
3. Define variant approval workflow
4. Decide storage location for variants

### Before Phase 3 Begins
1. Create Optimizely account
2. Define first experiment hypothesis
3. Set up primary and secondary metrics
4. Determine traffic allocation strategy

### Before Tableau Integration
1. Choose analytics data source
2. Define KPIs for each dashboard
3. Set up data refresh schedule
4. Determine access permissions

---

END OF INTEGRATION HOOKS DOCUMENTATION
