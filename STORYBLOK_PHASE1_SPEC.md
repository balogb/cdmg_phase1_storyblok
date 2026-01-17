# STORYBLOK PHASE 1 IMPLEMENTATION SPEC
## Governed Marketing Tech Stack - CMS Builder POC

**Purpose:** Build production-ready landing page template in Storyblok to understand implementation challenges before client engagement.

**Critical Context:** This is YOUR POC before doing the client's POC. Document every blocker, decision point, and gotcha.

---

## PROJECT OVERVIEW

**Fictitious Company:** NexusBio Therapeutics  
**Vertical:** Biopharma/Medical Devices (Investor Relations)  
**Use Case:** Product launch landing page for Phase 3 clinical trial announcement

**Sample Page Structure (inspired by CDMG):**
1. Hero: Headline + Trial Results + Forward-Looking Statements Disclaimer + CTA
2. Science Overview: 3-column benefit blocks with medical icons
3. Clinical Data: Table/stats section with regulatory citations
4. Investor Resources: Document downloads + SEC filing links
5. Footer: Legal disclaimers + Contact + Compliance notices

**Why This Matters for Phase 3 (Optimizely):**
- Each section needs to be A/B testable independently
- Content variations must map to Optimizely flag variables
- Components must work across Google Ads (text), Meta (image+text), Print (long-form)

---

## ARCHITECTURE DECISIONS

### Tech Stack
```
Frontend Framework: Next.js 14.2+ (App Router)
Styling: Tailwind CSS 3.4+
Language: TypeScript 5.x
CMS: Storyblok (Premium plan features assumed for future)
Deployment: AWS-ready (Vercel-compatible for dev)
Node Version: 20.x LTS
```

**Why Next.js App Router:**
- Server Components reduce client JS (critical for ad platform optimization)
- Incremental Static Regeneration (ISR) for content updates without full rebuilds
- Built-in Image Optimization (Meta Ads require specific image specs)
- Edge Runtime support (low latency for global IR content)

**Why Tailwind:**
- Utility-first allows rapid component variation creation (Phase 2 AI transformation)
- JIT compilation keeps bundle size minimal
- Easy to extract variants for platform-specific styling

### CMS Integration Pattern
```
Storyblok Management API: Component schema setup
Storyblok Content Delivery API: Runtime content fetching
Authentication: Token-based (preview vs published)
Caching Strategy: ISR with 60s revalidation (configurable)
```

---

## SAMPLE COMPANY PROFILE

**NexusBio Therapeutics, Inc.**
- **Ticker:** NASDAQ: NXBT (fictitious)
- **Sector:** Biopharmaceutical - Oncology therapeutics
- **Stage:** Phase 3 clinical trials
- **Product:** NeuraTX-7 (small molecule for glioblastoma treatment)
- **Compliance Requirements:** SEC Regulation FD, FDA promotional guidelines
- **Target Audience:** Institutional investors, buy-side analysts, retail investors

**Landing Page Context:**
Announcing positive Phase 3 interim results for NeuraTX-7, showing 47% progression-free survival improvement vs. standard of care. Page must balance promotional tone with regulatory compliance (forward-looking statements, risk disclosures).

---

## ENVIRONMENT SETUP

### Local Development (Your Laptop)

```bash
# 1. Create Next.js project with TypeScript and Tailwind
npx create-next-app@latest nexusbio-landing \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd nexusbio-landing

# 2. Install Storyblok SDK and dependencies
npm install @storyblok/react storyblok-js-client
npm install -D @types/node

# 3. Install additional dependencies
npm install clsx tailwind-merge
npm install @headlessui/react @heroicons/react
npm install sharp  # Next.js image optimization

# 4. Environment variables setup
cat > .env.local << EOF
# Storyblok API Tokens
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here
STORYBLOK_MANAGEMENT_TOKEN=your_management_token_here

# Environment
NEXT_PUBLIC_ENV=development

# Optional: Enable draft mode for Visual Editor
STORYBLOK_PREVIEW_SECRET=random_secret_string
EOF

# 5. Add to .gitignore
echo ".env.local" >> .gitignore
echo ".vercel" >> .gitignore
echo "storyblok-component-types.d.ts" >> .gitignore

# 6. Create project structure
mkdir -p app/components/storyblok
mkdir -p app/lib
mkdir -p app/types
mkdir -p public/icons
```

### Storyblok Account Setup

**Required Actions:**
1. Create Storyblok account at https://app.storyblok.com/#!/signup
2. Create new space: "NexusBio Landing Page POC"
3. Generate API tokens:
   - Settings > Access Tokens > Preview Token (for dev)
   - Settings > Access Tokens > Management Token (for schema setup)
4. Note Space ID (will be in URL: app.storyblok.com/#!/me/spaces/{SPACE_ID})

**Plan Tier Decision Point:**
- **Free Tier:** Sufficient for Phase 1 POC, single developer
- **Basic ($89/month):** Team collaboration if needed
- **Premium ($2,099/month):** Required for Phases 2-5 (workflows, pipelines)

**Recommendation:** Start on Free tier for your POC, document upgrade timing.

---

## STORYBLOK COMPONENT SCHEMAS

### Semantic Metadata Convention

All field descriptions use this pattern:
```
"SEMANTIC:field_type - Human description for context"
```

This enables Phase 2 AI extraction without schema changes.

### Component 1: Hero Section

**Create via Storyblok UI or Management API:**

```json
{
  "name": "hero_section",
  "display_name": "Hero Section",
  "schema": {
    "headline": {
      "type": "text",
      "required": true,
      "max_length": 120,
      "description": "SEMANTIC:headline - Primary headline for page (optimized for SEO and ad platforms)",
      "display_name": "Headline"
    },
    "subheadline": {
      "type": "textarea",
      "required": true,
      "max_length": 250,
      "description": "SEMANTIC:subheadline - Supporting description (will transform to Meta ad primary text)",
      "display_name": "Subheadline"
    },
    "cta_text": {
      "type": "text",
      "required": true,
      "default_value": "View Clinical Data",
      "description": "SEMANTIC:cta - Primary call-to-action button text",
      "display_name": "CTA Button Text"
    },
    "cta_link": {
      "type": "multilink",
      "required": true,
      "description": "SEMANTIC:cta_link - URL for primary action (internal or external)",
      "display_name": "CTA Link"
    },
    "background_image": {
      "type": "asset",
      "filetypes": ["images"],
      "description": "SEMANTIC:hero_image - Background image (min 1920x1080, will optimize for responsive)",
      "display_name": "Background Image"
    },
    "legal_disclaimer": {
      "type": "richtext",
      "required": true,
      "description": "SEMANTIC:legal_disclaimer - Forward-looking statements and risk disclosure (required for SEC compliance)",
      "display_name": "Legal Disclaimer"
    },
    "show_trial_badge": {
      "type": "boolean",
      "default_value": true,
      "description": "SEMANTIC:trial_badge - Display Phase 3 status badge",
      "display_name": "Show Phase 3 Badge"
    }
  },
  "is_root": false,
  "is_nestable": true,
  "color": "#1b98e0"
}
```

### Component 2: Feature Block

```json
{
  "name": "feature_block",
  "display_name": "Feature Block",
  "schema": {
    "icon": {
      "type": "asset",
      "filetypes": ["images"],
      "description": "SEMANTIC:icon - Feature icon (SVG preferred, will display at 64x64)",
      "display_name": "Icon"
    },
    "title": {
      "type": "text",
      "required": true,
      "max_length": 80,
      "description": "SEMANTIC:feature_title - Feature headline (will use in Google Search Ads)",
      "display_name": "Title"
    },
    "description": {
      "type": "textarea",
      "required": true,
      "max_length": 300,
      "description": "SEMANTIC:feature_description - Detailed explanation (source for platform variations)",
      "display_name": "Description"
    },
    "citation": {
      "type": "text",
      "description": "SEMANTIC:citation - Scientific citation or regulatory reference (e.g., 'NEJM 2025;382:142-151')",
      "display_name": "Citation (Optional)"
    }
  },
  "is_root": false,
  "is_nestable": true,
  "color": "#66bb6a"
}
```

### Component 3: Features Section (Container)

```json
{
  "name": "features_section",
  "display_name": "Features Section",
  "schema": {
    "section_title": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:section_headline - Section heading",
      "display_name": "Section Title"
    },
    "section_subtitle": {
      "type": "textarea",
      "description": "SEMANTIC:section_description - Optional introductory text",
      "display_name": "Section Subtitle"
    },
    "features": {
      "type": "bloks",
      "restrict_components": true,
      "component_whitelist": ["feature_block"],
      "minimum": 3,
      "maximum": 4,
      "description": "SEMANTIC:feature_list - Individual feature blocks (3-4 recommended)",
      "display_name": "Feature Blocks"
    }
  },
  "is_root": false,
  "is_nestable": true,
  "color": "#66bb6a"
}
```

### Component 4: Clinical Data Section

```json
{
  "name": "clinical_data_section",
  "display_name": "Clinical Data Section",
  "schema": {
    "section_title": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:section_headline - Data section heading",
      "display_name": "Section Title"
    },
    "data_points": {
      "type": "bloks",
      "restrict_components": true,
      "component_whitelist": ["stat_block"],
      "description": "SEMANTIC:clinical_metrics - Individual data points with regulatory context",
      "display_name": "Data Points"
    },
    "trial_disclaimer": {
      "type": "richtext",
      "required": true,
      "description": "SEMANTIC:legal_disclaimer - Trial methodology and limitations disclosure",
      "display_name": "Trial Disclaimer"
    },
    "data_source": {
      "type": "text",
      "description": "SEMANTIC:citation - Primary data source (e.g., 'ClinicalTrials.gov NCT04857294')",
      "display_name": "Data Source"
    }
  },
  "is_root": false,
  "is_nestable": true,
  "color": "#ffa726"
}
```

### Component 5: Stat Block

```json
{
  "name": "stat_block",
  "display_name": "Stat Block",
  "schema": {
    "metric": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:metric_value - Primary statistic (e.g., '47%', '12.4 months')",
      "display_name": "Metric"
    },
    "metric_label": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:metric_label - What the metric represents",
      "display_name": "Metric Label"
    },
    "context": {
      "type": "textarea",
      "description": "SEMANTIC:metric_context - Additional context or comparison",
      "display_name": "Context (Optional)"
    }
  },
  "is_root": false,
  "is_nestable": true,
  "color": "#ffa726"
}
```

### Component 6: Investor Resources Section

```json
{
  "name": "investor_resources_section",
  "display_name": "Investor Resources",
  "schema": {
    "section_title": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:section_headline - Resources section heading",
      "display_name": "Section Title"
    },
    "resources": {
      "type": "bloks",
      "restrict_components": true,
      "component_whitelist": ["resource_link"],
      "description": "SEMANTIC:resource_list - Downloadable documents and external links",
      "display_name": "Resource Links"
    }
  },
  "is_root": false,
  "is_nestable": true,
  "color": "#ab47bc"
}
```

### Component 7: Resource Link

```json
{
  "name": "resource_link",
  "display_name": "Resource Link",
  "schema": {
    "title": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:resource_title - Document or link title",
      "display_name": "Title"
    },
    "description": {
      "type": "textarea",
      "description": "SEMANTIC:resource_description - Brief description of resource",
      "display_name": "Description"
    },
    "link": {
      "type": "multilink",
      "required": true,
      "description": "SEMANTIC:resource_link - URL or asset download",
      "display_name": "Link"
    },
    "file_type": {
      "type": "option",
      "options": [
        {"name": "PDF", "value": "pdf"},
        {"name": "SEC Filing", "value": "sec"},
        {"name": "Presentation", "value": "presentation"},
        {"name": "External Link", "value": "external"}
      ],
      "description": "SEMANTIC:resource_type - Type of resource for icon display",
      "display_name": "File Type"
    }
  },
  "is_root": false,
  "is_nestable": true,
  "color": "#ab47bc"
}
```

### Component 8: Footer

```json
{
  "name": "footer_section",
  "display_name": "Footer",
  "schema": {
    "company_name": {
      "type": "text",
      "required": true,
      "default_value": "NexusBio Therapeutics, Inc.",
      "description": "SEMANTIC:company_name - Legal entity name",
      "display_name": "Company Name"
    },
    "copyright_text": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:copyright - Copyright notice",
      "display_name": "Copyright Text"
    },
    "legal_links": {
      "type": "bloks",
      "restrict_components": true,
      "component_whitelist": ["footer_link"],
      "description": "SEMANTIC:legal_navigation - Privacy policy, terms, etc.",
      "display_name": "Legal Links"
    },
    "compliance_notice": {
      "type": "richtext",
      "required": true,
      "description": "SEMANTIC:legal_disclaimer - SEC, FDA compliance statements",
      "display_name": "Compliance Notice"
    },
    "contact_email": {
      "type": "text",
      "description": "SEMANTIC:contact_email - Investor relations email",
      "display_name": "Contact Email"
    }
  },
  "is_root": false,
  "is_nestable": true,
  "color": "#78909c"
}
```

### Component 9: Footer Link

```json
{
  "name": "footer_link",
  "display_name": "Footer Link",
  "schema": {
    "label": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:link_text - Link text",
      "display_name": "Label"
    },
    "url": {
      "type": "multilink",
      "required": true,
      "description": "SEMANTIC:link_url - Destination URL",
      "display_name": "URL"
    }
  },
  "is_root": false,
  "is_nestable": true,
  "color": "#78909c"
}
```

### Component 10: Page (Root Component)

```json
{
  "name": "page",
  "display_name": "Page",
  "schema": {
    "body": {
      "type": "bloks",
      "restrict_components": true,
      "component_whitelist": [
        "hero_section",
        "features_section",
        "clinical_data_section",
        "investor_resources_section",
        "footer_section"
      ],
      "description": "SEMANTIC:page_sections - Page content sections",
      "display_name": "Page Sections"
    },
    "seo_title": {
      "type": "text",
      "required": true,
      "max_length": 60,
      "description": "SEMANTIC:seo_title - Page title for search engines and social sharing",
      "display_name": "SEO Title"
    },
    "seo_description": {
      "type": "textarea",
      "required": true,
      "max_length": 160,
      "description": "SEMANTIC:seo_description - Meta description for search results",
      "display_name": "SEO Description"
    },
    "og_image": {
      "type": "asset",
      "filetypes": ["images"],
      "description": "SEMANTIC:og_image - Social sharing image (1200x630 recommended)",
      "display_name": "Open Graph Image"
    }
  },
  "is_root": true,
  "is_nestable": false,
  "color": "#1b98e0"
}
```

---

## FRONTEND IMPLEMENTATION

### 1. Storyblok Configuration (`app/lib/storyblok.ts`)

```typescript
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

// Import all Storyblok components (will create these next)
import HeroSection from "@/app/components/storyblok/HeroSection";
import FeaturesSection from "@/app/components/storyblok/FeaturesSection";
import FeatureBlock from "@/app/components/storyblok/FeatureBlock";
import ClinicalDataSection from "@/app/components/storyblok/ClinicalDataSection";
import StatBlock from "@/app/components/storyblok/StatBlock";
import InvestorResourcesSection from "@/app/components/storyblok/InvestorResourcesSection";
import ResourceLink from "@/app/components/storyblok/ResourceLink";
import FooterSection from "@/app/components/storyblok/FooterSection";
import FooterLink from "@/app/components/storyblok/FooterLink";
import Page from "@/app/components/storyblok/Page";

const components = {
  hero_section: HeroSection,
  features_section: FeaturesSection,
  feature_block: FeatureBlock,
  clinical_data_section: ClinicalDataSection,
  stat_block: StatBlock,
  investor_resources_section: InvestorResourcesSection,
  resource_link: ResourceLink,
  footer_section: FooterSection,
  footer_link: FooterLink,
  page: Page,
};

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components,
  apiOptions: {
    region: "us", // Change to "eu" if using EU data center
  },
});
```

### 2. API Client Utility (`app/lib/storyblok-client.ts`)

```typescript
import StoryblokClient from "storyblok-js-client";

// Content Delivery API client (for published content)
export const storyblokClient = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN!,
  cache: {
    clear: "auto",
    type: "memory",
  },
});

// Management API client (for schema operations - backend only)
export const storyblokManagementClient = new StoryblokClient({
  accessToken: process.env.STORYBLOK_MANAGEMENT_TOKEN!,
  oauthToken: process.env.STORYBLOK_MANAGEMENT_TOKEN!,
});

// Type-safe story fetching with caching
export async function getStoryBySlug(slug: string, isDraft: boolean = false) {
  try {
    const { data } = await storyblokClient.get(`cdn/stories/${slug}`, {
      version: isDraft ? "draft" : "published",
      resolve_relations: [],
      cv: Date.now(), // Cache busting for development
    });

    return data.story;
  } catch (error) {
    console.error(`Error fetching story: ${slug}`, error);
    throw error;
  }
}

// BLOCKER IDENTIFIER: Rate limit monitoring
let requestCount = 0;
let requestWindow = Date.now();

export function checkRateLimit() {
  const now = Date.now();
  if (now - requestWindow > 1000) {
    // Reset every second
    requestCount = 0;
    requestWindow = now;
  }

  requestCount++;

  if (requestCount > 6) {
    console.warn(
      "⚠️ BLOCKER: Approaching Storyblok rate limit (6 req/sec on paid plans)"
    );
  }

  return { count: requestCount, limit: 6 };
}
```

### 3. Type Definitions (`app/types/storyblok.ts`)

```typescript
// Base Storyblok component interface
export interface StoryblokComponent {
  _uid: string;
  component: string;
  _editable?: string;
}

// Hero Section
export interface HeroSectionStoryblok extends StoryblokComponent {
  component: "hero_section";
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_link: {
    cached_url: string;
    linktype: string;
  };
  background_image: {
    filename: string;
    alt?: string;
  };
  legal_disclaimer: any; // Richtext type
  show_trial_badge: boolean;
}

// Feature Block
export interface FeatureBlockStoryblok extends StoryblokComponent {
  component: "feature_block";
  icon: {
    filename: string;
    alt?: string;
  };
  title: string;
  description: string;
  citation?: string;
}

// Features Section
export interface FeaturesSectionStoryblok extends StoryblokComponent {
  component: "features_section";
  section_title: string;
  section_subtitle?: string;
  features: FeatureBlockStoryblok[];
}

// Stat Block
export interface StatBlockStoryblok extends StoryblokComponent {
  component: "stat_block";
  metric: string;
  metric_label: string;
  context?: string;
}

// Clinical Data Section
export interface ClinicalDataSectionStoryblok extends StoryblokComponent {
  component: "clinical_data_section";
  section_title: string;
  data_points: StatBlockStoryblok[];
  trial_disclaimer: any; // Richtext
  data_source?: string;
}

// Resource Link
export interface ResourceLinkStoryblok extends StoryblokComponent {
  component: "resource_link";
  title: string;
  description?: string;
  link: {
    cached_url: string;
    linktype: string;
  };
  file_type: "pdf" | "sec" | "presentation" | "external";
}

// Investor Resources Section
export interface InvestorResourcesSectionStoryblok extends StoryblokComponent {
  component: "investor_resources_section";
  section_title: string;
  resources: ResourceLinkStoryblok[];
}

// Footer Link
export interface FooterLinkStoryblok extends StoryblokComponent {
  component: "footer_link";
  label: string;
  url: {
    cached_url: string;
    linktype: string;
  };
}

// Footer Section
export interface FooterSectionStoryblok extends StoryblokComponent {
  component: "footer_section";
  company_name: string;
  copyright_text: string;
  legal_links: FooterLinkStoryblok[];
  compliance_notice: any; // Richtext
  contact_email?: string;
}

// Page (Root)
export interface PageStoryblok extends StoryblokComponent {
  component: "page";
  body: (
    | HeroSectionStoryblok
    | FeaturesSectionStoryblok
    | ClinicalDataSectionStoryblok
    | InvestorResourcesSectionStoryblok
    | FooterSectionStoryblok
  )[];
  seo_title: string;
  seo_description: string;
  og_image?: {
    filename: string;
  };
}

// Story wrapper
export interface StoryblokStory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: PageStoryblok;
  created_at: string;
  published_at: string;
  first_published_at: string;
}
```

### 4. Hero Section Component (`app/components/storyblok/HeroSection.tsx`)

```typescript
import { storyblokEditable } from "@storyblok/react/rsc";
import { HeroSectionStoryblok } from "@/app/types/storyblok";
import { render } from "storyblok-rich-text-react-renderer";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection({ blok }: { blok: HeroSectionStoryblok }) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      {blok.background_image?.filename && (
        <div className="absolute inset-0 z-0">
          <Image
            src={blok.background_image.filename}
            alt={blok.background_image.alt || ""}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {/* Phase 3 Badge */}
        {blok.show_trial_badge && (
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-blue-600 rounded-full text-sm font-semibold">
            Phase 3 Clinical Trial
          </div>
        )}

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          {blok.headline}
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          {blok.subheadline}
        </p>

        {/* CTA */}
        <Link
          href={blok.cta_link.cached_url}
          className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg"
        >
          {blok.cta_text}
        </Link>

        {/* Legal Disclaimer */}
        {blok.legal_disclaimer && (
          <div className="mt-12 max-w-3xl mx-auto text-xs text-gray-300 leading-relaxed">
            {render(blok.legal_disclaimer)}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
```

### 5. Features Section Component (`app/components/storyblok/FeaturesSection.tsx`)

```typescript
import { storyblokEditable, StoryblokComponent } from "@storyblok/react/rsc";
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
          {blok.features.map((feature) => (
            <StoryblokComponent blok={feature} key={feature._uid} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 6. Feature Block Component (`app/components/storyblok/FeatureBlock.tsx`)

```typescript
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
```

### 7. Clinical Data Section Component (`app/components/storyblok/ClinicalDataSection.tsx`)

```typescript
import { storyblokEditable, StoryblokComponent } from "@storyblok/react/rsc";
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
          {blok.data_points.map((stat) => (
            <StoryblokComponent blok={stat} key={stat._uid} />
          ))}
        </div>

        {/* Data Source */}
        {blok.data_source && (
          <p className="text-center text-sm text-gray-600 mb-8">
            Data Source: {blok.data_source}
          </p>
        )}

        {/* Trial Disclaimer */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 border-l-4 border-blue-600">
          <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
            {render(blok.trial_disclaimer)}
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 8. Stat Block Component (`app/components/storyblok/StatBlock.tsx`)

```typescript
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
```

### 9. Investor Resources Section Component (`app/components/storyblok/InvestorResourcesSection.tsx`)

```typescript
import { storyblokEditable, StoryblokComponent } from "@storyblok/react/rsc";
import { InvestorResourcesSectionStoryblok } from "@/app/types/storyblok";

export default function InvestorResourcesSection({
  blok,
}: {
  blok: InvestorResourcesSectionStoryblok;
}) {
  return (
    <section {...storyblokEditable(blok)} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          {blok.section_title}
        </h2>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blok.resources.map((resource) => (
            <StoryblokComponent blok={resource} key={resource._uid} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 10. Resource Link Component (`app/components/storyblok/ResourceLink.tsx`)

```typescript
import { storyblokEditable } from "@storyblok/react/rsc";
import { ResourceLinkStoryblok } from "@/app/types/storyblok";
import Link from "next/link";

const fileTypeIcons = {
  pdf: "📄",
  sec: "📊",
  presentation: "📽️",
  external: "🔗",
};

export default function ResourceLink({ blok }: { blok: ResourceLinkStoryblok }) {
  return (
    <Link
      href={blok.link.cached_url}
      {...storyblokEditable(blok)}
      className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-6 border border-gray-200 transition-colors group"
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="text-4xl">{fileTypeIcons[blok.file_type]}</div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
            {blok.title}
          </h3>
          {blok.description && (
            <p className="text-sm text-gray-600">{blok.description}</p>
          )}
        </div>

        {/* Arrow */}
        <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
          →
        </div>
      </div>
    </Link>
  );
}
```

### 11. Footer Section Component (`app/components/storyblok/FooterSection.tsx`)

```typescript
import { storyblokEditable, StoryblokComponent } from "@storyblok/react/rsc";
import { FooterSectionStoryblok } from "@/app/types/storyblok";
import { render } from "storyblok-rich-text-react-renderer";

export default function FooterSection({ blok }: { blok: FooterSectionStoryblok }) {
  return (
    <footer
      {...storyblokEditable(blok)}
      className="bg-gray-900 text-gray-300 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Name */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {blok.company_name}
          </h2>
          {blok.contact_email && (
            <a
              href={`mailto:${blok.contact_email}`}
              className="text-blue-400 hover:text-blue-300"
            >
              {blok.contact_email}
            </a>
          )}
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {blok.legal_links.map((link) => (
            <StoryblokComponent blok={link} key={link._uid} />
          ))}
        </div>

        {/* Compliance Notice */}
        <div className="max-w-4xl mx-auto mb-8 text-xs leading-relaxed prose prose-invert prose-sm max-w-none text-center">
          {render(blok.compliance_notice)}
        </div>

        {/* Copyright */}
        <div className="text-center text-sm border-t border-gray-800 pt-8">
          {blok.copyright_text}
        </div>
      </div>
    </footer>
  );
}
```

### 12. Footer Link Component (`app/components/storyblok/FooterLink.tsx`)

```typescript
import { storyblokEditable } from "@storyblok/react/rsc";
import { FooterLinkStoryblok } from "@/app/types/storyblok";
import Link from "next/link";

export default function FooterLink({ blok }: { blok: FooterLinkStoryblok }) {
  return (
    <Link
      href={blok.url.cached_url}
      {...storyblokEditable(blok)}
      className="text-gray-400 hover:text-white text-sm transition-colors"
    >
      {blok.label}
    </Link>
  );
}
```

### 13. Page Component (`app/components/storyblok/Page.tsx`)

```typescript
import { StoryblokComponent } from "@storyblok/react/rsc";
import { PageStoryblok } from "@/app/types/storyblok";

export default function Page({ blok }: { blok: PageStoryblok }) {
  return (
    <>
      {blok.body?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </>
  );
}
```

### 14. Main Page Route (`app/page.tsx`)

```typescript
import { getStoryBySlug } from "@/app/lib/storyblok-client";
import { StoryblokStory } from "@storyblok/react/rsc";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const story = await getStoryBySlug("home");

    return {
      title: story.content.seo_title,
      description: story.content.seo_description,
      openGraph: {
        title: story.content.seo_title,
        description: story.content.seo_description,
        images: story.content.og_image
          ? [{ url: story.content.og_image.filename }]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "NexusBio Therapeutics",
      description: "Advancing oncology therapeutics",
    };
  }
}

export default async function HomePage() {
  try {
    const story = await getStoryBySlug("home");

    return <StoryblokStory story={story} />;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
          <p className="text-gray-600">
            Please create a story with slug "home" in Storyblok.
          </p>
        </div>
      </div>
    );
  }
}

// Enable ISR with 60-second revalidation
export const revalidate = 60;
```

### 15. Layout Configuration (`app/layout.tsx`)

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { storyblokInit } from "@storyblok/react/rsc";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusBio Therapeutics",
  description: "Advancing oncology therapeutics through innovative research",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Storyblok
  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  });

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

## BLOCKER IDENTIFICATION & MITIGATION

### CRITICAL BLOCKERS (Must Resolve Before Deployment)

#### 1. Storyblok Account & API Token Setup
**Severity:** ⛔ BLOCKER  
**Issue:** Cannot fetch content without valid tokens  
**Detection:** Runtime error on first page load  
**Mitigation:**
```bash
# Test token validity
curl -X GET "https://api.storyblok.com/v2/cdn/stories/home?token=YOUR_TOKEN&version=draft"

# Expected response: 200 with story JSON
# Error responses:
# - 401: Invalid token
# - 404: Story doesn't exist
# - 429: Rate limit exceeded
```
**Resolution Checklist:**
- [ ] Storyblok account created
- [ ] Space created (note Space ID)
- [ ] Preview token generated
- [ ] Management token generated (for schema setup)
- [ ] Tokens added to `.env.local`
- [ ] Verified token works with curl test

---

#### 2. Component Schema Creation
**Severity:** ⛔ BLOCKER  
**Issue:** Components must exist in Storyblok before frontend can render  
**Detection:** "Component not found" errors in Storyblok Visual Editor  
**Mitigation:**

**Option A: Manual UI Creation (Recommended for POC)**
1. Go to Storyblok > Components
2. Create each component from JSON schemas above
3. Manually configure each field

**Option B: Management API Automation**
```typescript
// app/scripts/setup-components.ts
import { storyblokManagementClient } from "@/app/lib/storyblok-client";

const SPACE_ID = "YOUR_SPACE_ID";

async function createComponent(componentSchema: any) {
  try {
    const response = await storyblokManagementClient.post(
      `spaces/${SPACE_ID}/components/`,
      {
        component: componentSchema,
      }
    );
    console.log(`✅ Created component: ${componentSchema.name}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Failed to create ${componentSchema.name}:`, error.response?.data || error);
  }
}

// Run: npx tsx app/scripts/setup-components.ts
```

**Resolution Checklist:**
- [ ] All 10 components created in Storyblok
- [ ] Component names match TypeScript interfaces
- [ ] Field types configured correctly
- [ ] component_whitelist restrictions set for bloks fields
- [ ] SEMANTIC: descriptions added to all fields

---

#### 3. Initial Story Creation
**Severity:** ⛔ BLOCKER  
**Issue:** Must create a story with slug "home" for homepage to work  
**Detection:** 404 error on localhost:3000  
**Mitigation:**
1. Go to Storyblok > Content
2. Create new story: "Home"
3. Set slug to "home"
4. Set content type to "page"
5. Add sections via Visual Editor

**Resolution Checklist:**
- [ ] Story named "Home" created
- [ ] Slug set to "home"
- [ ] Content type is "page"
- [ ] At least hero_section added
- [ ] Story published (or set to draft with draft mode enabled)

---

#### 4. Image Assets & CDN Configuration
**Severity:** ⚠️ HIGH  
**Issue:** Background images, icons, and OG images won't load without proper assets  
**Detection:** Broken image icons, console errors for missing images  
**Mitigation:**

**Storyblok Image Service:**
- Storyblok provides image optimization: `//a.storyblok.com/f/{space_id}/{path}/{filename}`
- Supports query parameters: `/m/1920x1080/filters:quality(80)`

**Next.js Image Configuration (`next.config.js`):**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
      },
    ],
  },
};

module.exports = nextConfig;
```

**Sample Images for POC:**
- Use Unsplash for placeholder medical/scientific images
- Upload to Storyblok asset library
- Configure in components

**Resolution Checklist:**
- [ ] next.config.js updated with Storyblok domain
- [ ] Sample images uploaded to Storyblok
- [ ] Background image added to hero_section
- [ ] Feature icons uploaded
- [ ] OG image uploaded (1200x630)

---

### HIGH PRIORITY BLOCKERS

#### 5. Storyblok Rate Limiting
**Severity:** ⚠️ HIGH  
**Issue:** 6 requests/second limit on paid plans (3/sec on free)  
**Detection:** 429 HTTP errors, API rejections  
**Impact:** During development with hot reload, can easily hit limit  
**Mitigation:**

```typescript
// app/lib/rate-limiter.ts
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerSecond = 5; // Stay under 6 limit
  private requestInterval = 1000 / this.requestsPerSecond;

  async execute<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        await request();
        await this.wait(this.requestInterval);
      }
    }

    this.processing = false;
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const rateLimiter = new RateLimiter();
```

**Usage:**
```typescript
const story = await rateLimiter.execute(() => 
  storyblokClient.get(`cdn/stories/${slug}`)
);
```

**Resolution Checklist:**
- [ ] Rate limiter implemented
- [ ] All API calls wrapped in rate limiter
- [ ] Monitoring logs added for rate limit warnings
- [ ] ISR revalidation interval set appropriately (60s minimum)

---

#### 6. Visual Editor Integration
**Severity:** ⚠️ HIGH  
**Issue:** Storyblok Visual Editor won't connect to localhost  
**Detection:** Preview doesn't load in Storyblok UI  
**Mitigation:**

**Enable Draft Mode API Route (`app/api/draft/route.ts`):**
```typescript
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "";

  // Validate secret to prevent unauthorized access
  if (secret !== process.env.STORYBLOK_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  // Enable draft mode
  draftMode().enable();

  // Redirect to the path from Storyblok
  redirect(`/${slug}`);
}
```

**Configure in Storyblok:**
1. Settings > Visual Editor
2. Set preview URL: `http://localhost:3000/api/draft?secret=YOUR_SECRET&slug=`
3. For production: Use your deployment URL

**Resolution Checklist:**
- [ ] Draft mode API route created
- [ ] STORYBLOK_PREVIEW_SECRET set in .env.local
- [ ] Visual Editor configured in Storyblok settings
- [ ] Test: Edit content in Storyblok, see changes in preview

---

### MEDIUM PRIORITY ISSUES

#### 7. TypeScript Type Safety
**Severity:** ⚠️ MEDIUM  
**Issue:** Manual type definitions can drift from actual Storyblok schema  
**Detection:** Runtime type mismatches, missing fields  
**Mitigation:**

**Storyblok Type Generator:**
```bash
# Install type generator
npm install --save-dev storyblok-generate-ts

# Add to package.json scripts
"scripts": {
  "generate-types": "storyblok-generate-ts source=app/types/storyblok.d.ts token=${STORYBLOK_MANAGEMENT_TOKEN}"
}

# Run when schema changes
npm run generate-types
```

**Alternative: Manual validation**
```typescript
// app/lib/validate-story.ts
import { z } from "zod";

const HeroSectionSchema = z.object({
  component: z.literal("hero_section"),
  headline: z.string(),
  subheadline: z.string(),
  cta_text: z.string(),
  // ... rest of schema
});

export function validateStory(story: unknown) {
  // Validate at runtime
  return HeroSectionSchema.parse(story);
}
```

**Resolution Checklist:**
- [ ] Type generator configured OR manual validation implemented
- [ ] Types regenerated after schema changes
- [ ] Runtime validation errors logged

---

#### 8. Responsive Image Loading
**Severity:** ⚠️ MEDIUM  
**Issue:** Large images slow mobile load times  
**Detection:** Lighthouse performance score <90, CLS issues  
**Mitigation:**

**Next.js Image Optimization:**
```typescript
<Image
  src={blok.background_image.filename}
  alt={blok.background_image.alt || ""}
  fill
  className="object-cover"
  priority={true}  // For above-fold images
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={80}  // Balance quality vs file size
/>
```

**Storyblok Image Service Parameters:**
```typescript
// Transform URLs for responsive images
function getResponsiveImage(url: string, width: number) {
  return `${url}/m/${width}x0/filters:quality(80):format(webp)`;
}

// Usage
<img 
  src={getResponsiveImage(blok.background_image.filename, 1920)}
  srcSet={`
    ${getResponsiveImage(blok.background_image.filename, 640)} 640w,
    ${getResponsiveImage(blok.background_image.filename, 1280)} 1280w,
    ${getResponsiveImage(blok.background_image.filename, 1920)} 1920w
  `}
/>
```

**Resolution Checklist:**
- [ ] All images use Next.js Image component
- [ ] priority prop set for above-fold images
- [ ] sizes prop configured for responsive loading
- [ ] Storyblok image service parameters used

---

#### 9. Richtext Rendering Security
**Severity:** ⚠️ MEDIUM  
**Issue:** Legal disclaimers contain richtext that could include unsafe HTML  
**Detection:** XSS vulnerability warnings, improperly rendered content  
**Mitigation:**

**Safe Richtext Rendering:**
```typescript
import { render } from "storyblok-rich-text-react-renderer";

// Default render is safe but limited
{render(blok.legal_disclaimer)}

// Custom resolver for specific nodes
const richtextOptions = {
  markResolvers: {
    link: (children: any, props: any) => {
      const { linktype, href, target } = props;
      if (linktype === "email") {
        return <a href={`mailto:${href}`}>{children}</a>;
      }
      return (
        <a 
          href={href} 
          target={target || "_self"}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

{render(blok.legal_disclaimer, richtextOptions)}
```

**Resolution Checklist:**
- [ ] All richtext fields use render() function
- [ ] Custom resolvers added for links
- [ ] External links include rel="noopener noreferrer"
- [ ] No dangerouslySetInnerHTML used

---

### LOW PRIORITY CONCERNS

#### 10. Staging vs Production Story Separation
**Severity:** ℹ️ LOW (Phase 1 only, CRITICAL for Phase 2+)  
**Issue:** No way to test content changes without affecting production  
**Detection:** Content edits immediately visible in production  
**Mitigation:**

**Phase 1 Workaround:**
- Use "draft" vs "published" story versions
- Test in Visual Editor preview before publishing

**Phase 2+ Solution (Requires Premium Plan):**
- Storyblok Pipelines feature
- Separate staging/production spaces
- Content promotion workflow

**Resolution Checklist:**
- [ ] Documented that staging requires Premium plan
- [ ] Client aware of $2,099/month upgrade timing
- [ ] Draft/published workflow explained to client

---

#### 11. SEO & Social Sharing
**Severity:** ℹ️ LOW (but important for launch)  
**Issue:** Missing metadata affects discoverability  
**Detection:** Poor social share previews, low search rankings  
**Mitigation:**

**Next.js Metadata API (already in page.tsx):**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const story = await getStoryBySlug("home");

  return {
    title: story.content.seo_title,
    description: story.content.seo_description,
    openGraph: {
      title: story.content.seo_title,
      description: story.content.seo_description,
      images: [{ url: story.content.og_image.filename }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: story.content.seo_title,
      description: story.content.seo_description,
      images: [story.content.og_image.filename],
    },
  };
}
```

**Testing:**
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

**Resolution Checklist:**
- [ ] SEO title (max 60 chars) set
- [ ] Meta description (max 160 chars) set
- [ ] OG image (1200x630) uploaded
- [ ] Tested in social media validators

---

## DEPLOYMENT STRATEGY

### Local Development (Your Laptop)

```bash
# 1. Start development server
npm run dev

# Open http://localhost:3000

# 2. Verify Storyblok connection
# - Edit content in Storyblok
# - Changes should reflect immediately (ISR with 60s cache)

# 3. Test Visual Editor
# - Open Storyblok > Content > Home > Edit
# - Visual Editor should load localhost:3000 in iframe
```

### Staging Environment (AWS Recommended)

**Option 1: AWS Amplify (Simplest)**
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify push
```

**Configuration:**
- Build command: `npm run build`
- Output directory: `.next`
- Environment variables: Add Storyblok tokens in Amplify Console

**Option 2: AWS App Runner**
- Container-based deployment
- Auto-scaling
- Requires Dockerfile

**Option 3: EC2 + Load Balancer**
- Most control, most complex
- Use PM2 for process management
- NGINX reverse proxy

**Resolution Checklist:**
- [ ] AWS account created
- [ ] Deployment platform chosen
- [ ] Environment variables configured
- [ ] Test deployment successful
- [ ] Custom domain configured (optional for POC)

### Production Environment

**Recommended: AWS Amplify or Vercel**

**AWS Amplify Pros:**
- Full AWS integration
- Custom domain with ACM certificates
- Branch-based deployments
- Cost-effective for low-traffic IR sites

**Vercel Pros:**
- Zero-config Next.js optimization
- Global CDN
- Automatic HTTPS
- Preview deployments for PRs

**Cost Comparison (estimated):**
- AWS Amplify: $0-50/month for Phase 1 traffic
- Vercel: Free tier sufficient for POC, $20/month Pro plan

**Client Decision Point:** Document in SOW that production hosting adds $0-50/month operational cost.

---

## TESTING CHECKLIST

### Functional Testing

- [ ] **Homepage loads** at localhost:3000
- [ ] **All sections render** (hero, features, clinical data, resources, footer)
- [ ] **Images load** without errors
- [ ] **Links work** (CTAs, resource links, footer links)
- [ ] **Richtext renders** (legal disclaimers, compliance notices)
- [ ] **Visual Editor connects** (can edit in Storyblok UI)
- [ ] **Draft mode works** (changes visible in preview before publishing)

### Responsive Testing

- [ ] **Mobile (375px):** All content readable, images load, no horizontal scroll
- [ ] **Tablet (768px):** Grid layouts adjust properly
- [ ] **Desktop (1920px):** Content centered, images don't pixelate

### Performance Testing

- [ ] **Lighthouse score:** >90 on all metrics
- [ ] **Core Web Vitals:**
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1
- [ ] **Image optimization:** WebP format served where supported
- [ ] **Bundle size:** Initial JS <200KB gzipped

### Compliance Testing (IR Specific)

- [ ] **Legal disclaimers visible** on all relevant sections
- [ ] **Forward-looking statements** properly disclosed
- [ ] **Risk disclosures** included in footer
- [ ] **SEC filing links** work and point to real SEC.gov (or placeholder)
- [ ] **Regulatory citations** formatted correctly

### Storyblok-Specific Testing

- [ ] **Component editing:** Non-technical user can change text
- [ ] **Image upload:** Can add new images via asset manager
- [ ] **Link changes:** Can update CTA and resource links
- [ ] **Publishing workflow:** Draft → Publish process clear
- [ ] **Version history:** Can view and restore previous versions

---

## PHASE 3 PREPARATION (Optimizely Integration Considerations)

Although Phase 3 is out of scope for BRIEF 1, architectural decisions now affect future integration.

### Component Design for Experimentation

**Each section must be independently testable:**

```typescript
// Future Phase 3: Optimizely flag will control which variant renders
export default function HeroSection({ blok, experimentVariant }: Props) {
  // Base implementation (control)
  if (!experimentVariant || experimentVariant === 'control') {
    return <HeroSectionControl blok={blok} />;
  }
  
  // Variant A: Different CTA placement
  if (experimentVariant === 'variant_a') {
    return <HeroSectionVariantA blok={blok} />;
  }
  
  // Variant B: Video background
  if (experimentVariant === 'variant_b') {
    return <HeroSectionVariantB blok={blok} />;
  }
}
```

**SEMANTIC metadata enables variant generation:**
- Storyblok story with SEMANTIC:headline
- Relevance AI reads semantic label
- Generates Google Ads variant (30 char max)
- Generates Meta Ads variant (with image)
- Generates Print variant (long-form)

**Architecture Decision for Phase 1:**
✅ **DO:** Keep component rendering logic separate from content fetching  
✅ **DO:** Use props/composition pattern (easy to inject experiment logic)  
✅ **DO:** Document component boundaries clearly  
❌ **DON'T:** Tightly couple content structure to layout  
❌ **DON'T:** Use global state for content (blocks experimentation)

---

## DOCUMENTATION REQUIREMENTS

### Code Documentation

```typescript
/**
 * Hero Section Component
 * 
 * PRIMARY USE: Landing page above-the-fold content
 * 
 * PHASE 3 NOTES: This component is A/B testable via Optimizely.
 * Variant testing planned for:
 * - CTA button placement (centered vs left-aligned)
 * - Background type (image vs video)
 * - Legal disclaimer position (inline vs footer reference)
 * 
 * COMPLIANCE: Legal disclaimer must always be visible.
 * Do not remove or conditionally hide.
 */
export default function HeroSection({ blok }: Props) {
  // Component code
}
```

### README for Client Handoff

**Create `HANDOFF.md`:**
```markdown
# NexusBio Landing Page - Developer Handoff

## Project Overview
Single landing page template built in Next.js + Storyblok CMS.

## Local Development
1. Clone repository
2. Copy `.env.example` to `.env.local`
3. Add Storyblok tokens
4. Run `npm install && npm run dev`

## Content Editing (Non-Technical Users)
1. Go to https://app.storyblok.com
2. Login with your credentials
3. Navigate to Content > Home
4. Click sections to edit in Visual Editor
5. Publish when ready

## Deployment
[Document chosen deployment platform]

## Support Contacts
- Developer: [Your contact]
- Storyblok Support: support@storyblok.com
- AWS Support: [If using AWS]

## Known Limitations (Phase 1)
- No approval workflows (requires Premium plan)
- No staging environment (requires Premium plan)
- No AI content transformation (Phase 2)
- No A/B testing (Phase 3)

## Next Steps (Phase 2+)
[Link to technical specification document]
```

---

## COST TRACKING FOR CLIENT TRANSPARENCY

### Phase 1 Actual Costs (Track These)

| Item | Estimate | Actual | Notes |
|------|----------|--------|-------|
| Project Setup | 2 hours | ___ | npm init, Storyblok account, tokens |
| Component Schema Creation | 4 hours | ___ | All 10 components in Storyblok |
| Frontend Components | 10 hours | ___ | React component development |
| API Integration | 2 hours | ___ | Storyblok client setup |
| Responsive Testing | 3 hours | ___ | Mobile/tablet/desktop |
| Deployment Setup | 3 hours | ___ | AWS/Vercel configuration |
| Documentation | 2 hours | ___ | Code comments, HANDOFF.md |
| Client Walkthrough | 1 hour | ___ | 30-minute demo + Q&A |
| **TOTAL** | **27 hours** | **___** | |

**Variance Analysis:**
- If >40 hours: Document complexity drivers
- If <20 hours: Template simpler than expected
- Update client on actual vs estimate

---

## SUCCESS CRITERIA

### Technical Success
- [ ] Landing page renders without errors
- [ ] All 5 sections present and functional
- [ ] Responsive on mobile, tablet, desktop
- [ ] Lighthouse score >90
- [ ] Storyblok Visual Editor works
- [ ] Non-technical user can edit content

### Client Success
- [ ] Matches reference landing page design
- [ ] Legal disclaimers properly displayed
- [ ] IR compliance requirements met
- [ ] Content creators can use without training
- [ ] Deployment to staging environment successful

### POC Success (Your Learning)
- [ ] Understand Storyblok component architecture
- [ ] Identify all blockers for client engagement
- [ ] Document API rate limit behaviors
- [ ] Know exactly what Premium plan features require
- [ ] Confident in Phase 2 integration complexity
- [ ] Can accurately estimate client implementation time

---

## NEXT STEPS AFTER PHASE 1

### Immediate (Week 4)
1. Schedule Phase 1 acceptance meeting
2. Demo to client stakeholders
3. Get feedback on component usability
4. Document any change requests

### Short-term (Month 2)
1. Decide on Premium plan upgrade timing
2. Plan Phase 2 kick-off (Relevance AI)
3. Review Optimizely Feature Experimentation pricing
4. Confirm Wrike middleware requirements

### Long-term (Quarter 2)
1. Complete remaining 4 phases
2. Full system integration testing
3. User training (content creators + legal team)
4. Production launch

---

## CRITICAL REMINDERS

⚠️ **This is YOUR POC** - Document every friction point, blocker, and gotcha. These notes become your client preparation guide.

⚠️ **Premium Plan Decision** - Client needs to know that $2,099/month upgrade is required for Phases 2-5. Don't let this be a surprise.

⚠️ **Rate Limits Matter** - 6 req/sec seems generous until you hit it during dev hot reload. Plan for this.

⚠️ **Semantic Metadata is Future-Proofing** - Even though Phase 2 AI integration is later, implementing SEMANTIC: convention now saves massive refactoring.

⚠️ **Component Boundaries Enable Experimentation** - Keep rendering logic modular. Optimizely integration in Phase 3 depends on clean component separation.

⚠️ **IR Compliance is Non-Negotiable** - Legal disclaimers, risk disclosures, and forward-looking statements cannot be optional or conditionally hidden. Ever.

---

END OF STORYBLOK PHASE 1 SPEC
