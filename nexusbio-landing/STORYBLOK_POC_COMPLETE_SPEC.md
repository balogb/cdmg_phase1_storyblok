# STORYBLOK POC COMPLETE SPECIFICATION
## Governed Marketing Tech Stack - CMS Builder Implementation

**Version:** 1.0
**Last Updated:** January 2026
**Status:** POC Complete - Ready for Client Adaptation

---

## EXECUTIVE SUMMARY

This document consolidates the complete Phase 1 POC implementation for a Storyblok-powered landing page system. The implementation exceeds the original specification by including governance guardrails, automated audits, and AI-readiness features that prepare the system for future phases.

### What This POC Demonstrates

| Capability | Status | Notes |
|------------|--------|-------|
| CMS-driven landing pages | ✅ Complete | 11 Storyblok components |
| Visual Editor integration | ✅ Complete | Real-time preview |
| Type-safe content fetching | ✅ Complete | Zod validation |
| Responsive design | ✅ Complete | Mobile/tablet/desktop |
| A/B testing readiness | ✅ Complete | Variant support in HeroSection |
| Accessibility compliance | ✅ Complete | Automated audits |
| Print/omnichannel output | ✅ Complete | @media print styles |
| CI/CD pipeline | ✅ Complete | GitHub Actions |
| AI content extraction readiness | ✅ Complete | SEMANTIC metadata |

---

## PROJECT CONFIGURATION

### Client Information (To Be Configured)

```
Company Name: [TBD - Client Company Name]
Ticker Symbol: [TBD - e.g., NASDAQ: XXXX]
Industry Vertical: [TBD - e.g., Biopharma, Medical Devices, Life Sciences]
Compliance Requirements: [TBD - e.g., SEC Regulation FD, FDA promotional guidelines]
Target Audience: [TBD - e.g., Institutional investors, analysts, retail investors]
```

### Landing Page Use Case

```
Campaign Type: [TBD - e.g., Product launch, clinical trial announcement, earnings release]
Page Purpose: [TBD - e.g., Investor relations, product information, lead generation]
Key Sections Required: [TBD - Select from available components]
```

---

## TECHNOLOGY STACK

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x (App Router) | React framework with RSC support |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4+ | Utility-first styling |
| Storyblok | Latest | Headless CMS |
| Zod | 3.x | Runtime validation |
| Node.js | 20.x LTS | Runtime environment |

### Key Dependencies

```json
{
  "@storyblok/react": "^5.x",
  "storyblok-js-client": "^6.x",
  "storyblok-rich-text-react-renderer": "^3.x",
  "@heroicons/react": "^2.x",
  "zod": "^3.x"
}
```

---

## STORYBLOK COMPONENT LIBRARY

### Component Overview

The POC includes 11 production-ready Storyblok components:

| # | Component | Type | Purpose |
|---|-----------|------|---------|
| 1 | `page` | Root | Page container with SEO fields |
| 2 | `hero_section` | Section | Above-fold hero with A/B variant support |
| 3 | `features_section` | Section | 3-4 column feature grid |
| 4 | `feature_block` | Nested | Individual feature card |
| 5 | `clinical_data_section` | Section | Statistics and data display |
| 6 | `stat_block` | Nested | Individual metric card |
| 7 | `investor_resources_section` | Section | Document downloads grid |
| 8 | `resource_link` | Nested | Individual resource item |
| 9 | `contact_form_section` | Section | Contact form with CMS-managed fields |
| 10 | `footer_section` | Section | Footer with compliance notices |
| 11 | `footer_link` | Nested | Footer navigation link |

### Global Components

| Component | Purpose |
|-----------|---------|
| `global_settings` | Site-wide logo, navigation, contact info |
| `nav_item` | Navigation menu item |

---

## COMPONENT SCHEMAS

### Semantic Metadata Convention

All field descriptions use this pattern for AI extraction readiness:
```
"SEMANTIC:field_type - Human description for context"
```

This enables Phase 2 AI content transformation without schema changes.

### 1. Page (Root Component)

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
        "contact_form_section",
        "footer_section"
      ],
      "description": "SEMANTIC:page_sections - Page content sections"
    },
    "seo_title": {
      "type": "text",
      "required": true,
      "max_length": 60,
      "description": "SEMANTIC:seo_title - Page title for search engines (max 60 chars)"
    },
    "seo_description": {
      "type": "textarea",
      "required": true,
      "max_length": 160,
      "description": "SEMANTIC:seo_description - Meta description (max 160 chars)"
    },
    "og_image": {
      "type": "asset",
      "filetypes": ["images"],
      "description": "SEMANTIC:og_image - Social sharing image (1200x630 recommended)"
    }
  },
  "is_root": true,
  "is_nestable": false
}
```

### 2. Hero Section (with A/B Testing Support)

```json
{
  "name": "hero_section",
  "display_name": "Hero Section",
  "schema": {
    "logo": {
      "type": "asset",
      "filetypes": ["images"],
      "description": "SEMANTIC:logo - Company logo for hero display"
    },
    "headline": {
      "type": "text",
      "required": true,
      "max_length": 120,
      "description": "SEMANTIC:headline - Primary headline (optimized for SEO and ad platforms)"
    },
    "subheadline": {
      "type": "textarea",
      "required": true,
      "max_length": 250,
      "description": "SEMANTIC:subheadline - Supporting description (transforms to Meta ad text)"
    },
    "cta_text": {
      "type": "text",
      "max_length": 30,
      "default_value": "Learn More",
      "description": "SEMANTIC:cta - Call-to-action button text"
    },
    "cta_link": {
      "type": "multilink",
      "description": "SEMANTIC:cta_link - CTA destination URL"
    },
    "background_image": {
      "type": "asset",
      "filetypes": ["images"],
      "description": "SEMANTIC:hero_image - Background image (min 1920x1080)"
    },
    "legal_disclaimer": {
      "type": "richtext",
      "required": true,
      "description": "SEMANTIC:legal_disclaimer - Forward-looking statements (SEC compliance)"
    },
    "show_trial_badge": {
      "type": "boolean",
      "default_value": false,
      "description": "SEMANTIC:trial_badge - Display phase/trial status badge"
    },
    "variant": {
      "type": "option",
      "options": [
        {"name": "Control (Centered)", "value": "control"},
        {"name": "Variant B (Left-aligned)", "value": "variant_b"}
      ],
      "default_value": "control",
      "description": "SEMANTIC:ab_variant - A/B test layout variant"
    }
  },
  "is_nestable": true
}
```

### 3. Features Section

```json
{
  "name": "features_section",
  "display_name": "Features Section",
  "schema": {
    "section_title": {
      "type": "text",
      "required": true,
      "max_length": 100,
      "description": "SEMANTIC:section_headline - Section heading"
    },
    "section_subtitle": {
      "type": "textarea",
      "max_length": 200,
      "description": "SEMANTIC:section_description - Optional intro text"
    },
    "features": {
      "type": "bloks",
      "restrict_components": true,
      "component_whitelist": ["feature_block"],
      "minimum": 3,
      "description": "SEMANTIC:feature_list - Feature blocks (3-4 recommended)"
    }
  },
  "is_nestable": true
}
```

### 4. Feature Block

```json
{
  "name": "feature_block",
  "display_name": "Feature Block",
  "schema": {
    "icon": {
      "type": "asset",
      "filetypes": ["images"],
      "description": "SEMANTIC:icon - Feature icon (SVG preferred, 64x64)"
    },
    "title": {
      "type": "text",
      "required": true,
      "max_length": 80,
      "description": "SEMANTIC:feature_title - Feature headline"
    },
    "description": {
      "type": "textarea",
      "required": true,
      "max_length": 300,
      "description": "SEMANTIC:feature_description - Feature explanation"
    },
    "citation": {
      "type": "text",
      "max_length": 100,
      "description": "SEMANTIC:citation - Scientific/regulatory reference"
    }
  },
  "is_nestable": true
}
```

### 5. Clinical Data Section

```json
{
  "name": "clinical_data_section",
  "display_name": "Clinical Data Section",
  "schema": {
    "section_title": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:section_headline - Data section heading"
    },
    "data_points": {
      "type": "bloks",
      "restrict_components": true,
      "component_whitelist": ["stat_block"],
      "description": "SEMANTIC:clinical_metrics - Statistical data points"
    },
    "trial_disclaimer": {
      "type": "richtext",
      "description": "SEMANTIC:legal_disclaimer - Trial methodology disclosure"
    },
    "data_source": {
      "type": "text",
      "description": "SEMANTIC:citation - Data source reference"
    }
  },
  "is_nestable": true
}
```

### 6. Stat Block

```json
{
  "name": "stat_block",
  "display_name": "Stat Block",
  "schema": {
    "metric": {
      "type": "text",
      "required": true,
      "max_length": 20,
      "description": "SEMANTIC:metric_value - Primary statistic (e.g., '47%')"
    },
    "metric_label": {
      "type": "text",
      "required": true,
      "max_length": 60,
      "description": "SEMANTIC:metric_label - What the metric represents"
    },
    "context": {
      "type": "textarea",
      "max_length": 150,
      "description": "SEMANTIC:metric_context - Additional context"
    }
  },
  "is_nestable": true
}
```

### 7. Investor Resources Section

```json
{
  "name": "investor_resources_section",
  "display_name": "Investor Resources",
  "schema": {
    "section_title": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:section_headline - Resources heading"
    },
    "resources": {
      "type": "bloks",
      "restrict_components": true,
      "component_whitelist": ["resource_link"],
      "description": "SEMANTIC:resource_list - Downloadable documents"
    }
  },
  "is_nestable": true
}
```

### 8. Resource Link

```json
{
  "name": "resource_link",
  "display_name": "Resource Link",
  "schema": {
    "title": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:resource_title - Document title"
    },
    "description": {
      "type": "textarea",
      "description": "SEMANTIC:resource_description - Brief description"
    },
    "link": {
      "type": "multilink",
      "required": true,
      "description": "SEMANTIC:resource_link - Download URL"
    },
    "file_type": {
      "type": "option",
      "required": true,
      "options": [
        {"name": "PDF", "value": "pdf"},
        {"name": "SEC Filing", "value": "sec"},
        {"name": "Presentation", "value": "presentation"},
        {"name": "External Link", "value": "external"}
      ],
      "description": "SEMANTIC:resource_type - File type for icon"
    }
  },
  "is_nestable": true
}
```

### 9. Contact Form Section

```json
{
  "name": "contact_form_section",
  "display_name": "Contact Form Section",
  "schema": {
    "section_title": {
      "type": "text",
      "required": true,
      "max_length": 100,
      "description": "SEMANTIC:section_headline - Contact section title"
    },
    "section_subtitle": {
      "type": "textarea",
      "max_length": 250,
      "description": "SEMANTIC:section_description - Intro text"
    },
    "contact_email": {
      "type": "text",
      "description": "SEMANTIC:contact_email - Display email address"
    },
    "contact_phone": {
      "type": "text",
      "max_length": 30,
      "description": "SEMANTIC:contact_phone - Display phone number"
    },
    "address": {
      "type": "textarea",
      "max_length": 200,
      "description": "SEMANTIC:address - Office address"
    },
    "additional_info": {
      "type": "richtext",
      "description": "SEMANTIC:additional_info - Extra contact information"
    },
    "inquiry_types": {
      "type": "text",
      "description": "SEMANTIC:inquiry_types - Comma-separated inquiry options"
    },
    "submit_button_text": {
      "type": "text",
      "max_length": 30,
      "default_value": "Send Message",
      "description": "SEMANTIC:cta - Submit button text"
    },
    "success_title": {
      "type": "text",
      "max_length": 60,
      "description": "SEMANTIC:success_title - Confirmation heading"
    },
    "success_message": {
      "type": "text",
      "max_length": 200,
      "description": "SEMANTIC:success_message - Confirmation message"
    },
    "form_disclaimer": {
      "type": "text",
      "max_length": 300,
      "description": "SEMANTIC:legal_disclaimer - Privacy/consent notice"
    }
  },
  "is_nestable": true
}
```

### 10. Footer Section

```json
{
  "name": "footer_section",
  "display_name": "Footer",
  "schema": {
    "company_name": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:company_name - Legal entity name"
    },
    "copyright_text": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:copyright - Copyright notice"
    },
    "legal_links": {
      "type": "bloks",
      "restrict_components": true,
      "component_whitelist": ["footer_link"],
      "description": "SEMANTIC:legal_navigation - Privacy, terms links"
    },
    "compliance_notice": {
      "type": "richtext",
      "required": true,
      "description": "SEMANTIC:legal_disclaimer - SEC/FDA compliance statements"
    },
    "contact_email": {
      "type": "text",
      "description": "SEMANTIC:contact_email - IR contact email"
    }
  },
  "is_nestable": true
}
```

### 11. Footer Link

```json
{
  "name": "footer_link",
  "display_name": "Footer Link",
  "schema": {
    "label": {
      "type": "text",
      "required": true,
      "description": "SEMANTIC:link_text - Link text"
    },
    "url": {
      "type": "multilink",
      "required": true,
      "description": "SEMANTIC:link_url - Destination URL"
    }
  },
  "is_nestable": true
}
```

### Global Settings

```json
{
  "name": "global_settings",
  "display_name": "Global Settings",
  "schema": {
    "logo": {
      "type": "asset",
      "filetypes": ["images"],
      "description": "SEMANTIC:logo - Site-wide logo"
    },
    "navigation": {
      "type": "bloks",
      "restrict_components": true,
      "component_whitelist": ["nav_item"],
      "description": "SEMANTIC:navigation - Main navigation items"
    },
    "footer_text": {
      "type": "richtext",
      "description": "SEMANTIC:footer_text - Global footer content"
    },
    "contact_email": {
      "type": "text",
      "description": "SEMANTIC:contact_email - Global contact email"
    },
    "copyright": {
      "type": "text",
      "description": "SEMANTIC:copyright - Copyright text"
    }
  },
  "is_root": true
}
```

---

## IMPLEMENTED FEATURES

### Core Features (Original Spec)

#### 1. CMS-Driven Content
- All page content managed in Storyblok
- Visual Editor integration for real-time preview
- Draft/Published workflow support

#### 2. Type-Safe Data Fetching
- Zod schemas for runtime validation
- TypeScript types inferred from schemas
- Graceful fallback on validation errors (logs warning, doesn't crash)

#### 3. Responsive Design
- Mobile-first Tailwind CSS
- Tested at 375px, 768px, 1920px breakpoints
- No horizontal overflow issues

#### 4. Image Optimization
- Next.js Image component with Storyblok loader
- Automatic format conversion (WebP where supported)
- Responsive srcset generation

#### 5. SEO & Social Sharing
- Dynamic metadata from CMS
- Open Graph tags
- Twitter card support

#### 6. ISR (Incremental Static Regeneration)
- 60-second revalidation interval
- Cache-busting for development
- Automatic content updates without rebuild

### Enhancement Features (Beyond Original Spec)

#### 1. Automated Compliance Audits

**Accessibility Audit** (`scripts/audit-accessibility.ts`)
- Uses Axe-core for WCAG compliance
- Runs against all page routes
- Integrated into CI pipeline

**Responsive Layout Audit** (`scripts/audit-responsive.ts`)
- Detects horizontal overflow
- Tests iPhone, iPad, Desktop viewports
- Prevents broken layouts from deployment

#### 2. Omnichannel Output

**Print-Ready Styles** (`app/globals.css`)
```css
@media print {
  .print:hidden { display: none; }
  /* Automatic page breaks between sections */
  /* Background color preservation */
  /* Navigation/CTA removal */
}
```

**High-Resolution Asset Serving** (`app/lib/storyblok-loader.ts`)
- Bypasses WebP compression for print
- Serves original quality images when needed

#### 3. Workflow & AI Readiness

**Stage-Aware Preview** (`app/components/layout/WorkflowBanner.tsx`)
- Displays current workflow stage in Visual Editor
- Shows "Legal Review", "Draft", etc.
- Prevents confusion between content states

**Webhook Verification** (`scripts/webhook-verify.ts`)
- Validates Storyblok webhook signatures
- Ready for automated audit triggers
- Foundation for "Golden Path" governance

**Semantic Metadata** (`app/types/storyblok.ts`)
- All schemas use `SEMANTIC:` descriptions
- Zod validation for AI-readable structure
- Ready for Relevance AI integration

#### 4. A/B Testing Support

**Variant System** (`HeroSection.tsx`)
```typescript
const isVariantB = blok.variant === "variant_b";
// Layout adjusts based on variant
```
- Control vs Variant B layout options
- Ready for Optimizely flag integration
- Component-level experimentation

#### 5. CI/CD Pipeline

**Continuous Integration** (`.github/workflows/ci.yml`)
- TypeScript compilation check
- Lint validation
- Build verification
- Accessibility audit (blocks on failure)
- Responsive audit (blocks on failure)

**Deployment Pipeline** (`.github/workflows/deploy.yml`)
- Staging environment support
- Production deployment scaffolding
- Environment variable management

#### 6. Rate Limiting

**Queue-Based Rate Limiter** (`app/lib/storyblok-client.ts`)
```typescript
class RateLimiter {
  private requestsPerSecond = 3; // Free tier limit
  // Queue-based execution prevents 429 errors
}
```
- Prevents hitting Storyblok API limits
- Automatic request queuing
- Configurable for paid tiers (6 req/sec)

---

## PROJECT STRUCTURE

```
nexusbio-landing/
├── app/
│   ├── [slug]/
│   │   └── page.tsx              # Dynamic route handler
│   ├── api/
│   │   └── draft/
│   │       ├── route.ts          # Enable draft mode
│   │       └── disable/route.ts  # Disable draft mode
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Global header with nav
│   │   │   ├── Footer.tsx        # Global footer
│   │   │   └── WorkflowBanner.tsx # Workflow stage display
│   │   ├── storyblok/
│   │   │   ├── Page.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── FeatureBlock.tsx
│   │   │   ├── ClinicalDataSection.tsx
│   │   │   ├── StatBlock.tsx
│   │   │   ├── InvestorResourcesSection.tsx
│   │   │   ├── ResourceLink.tsx
│   │   │   ├── ContactFormSection.tsx
│   │   │   ├── FooterSection.tsx
│   │   │   └── FooterLink.tsx
│   │   └── StoryblokProvider.tsx  # Component registration
│   ├── lib/
│   │   ├── storyblok.ts          # Storyblok init
│   │   ├── storyblok-client.ts   # API client + rate limiter
│   │   └── storyblok-loader.ts   # Image loader
│   ├── types/
│   │   └── storyblok.ts          # Zod schemas + types
│   ├── globals.css               # Tailwind + print styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── scripts/
│   ├── setup-components.ts       # Schema creation automation
│   ├── create-page-stories.ts    # Sample page creation
│   ├── create-settings-story.ts  # Global settings setup
│   ├── create-home-story.ts      # Homepage content
│   ├── seed-golden-copy.ts       # Golden copy content
│   ├── audit-accessibility.ts    # A11y audit
│   ├── audit-responsive.ts       # Layout audit
│   ├── webhook-verify.ts         # Webhook validation
│   ├── generate-ai-dictionary.ts # AI metadata extraction
│   └── debug-storyblok.ts        # Debug utilities
├── .github/
│   └── workflows/
│       ├── ci.yml                # CI pipeline
│       └── deploy.yml            # Deployment pipeline
├── .env.local                    # Environment variables
├── next.config.ts                # Next.js configuration
└── package.json
```

---

## ENVIRONMENT CONFIGURATION

### Required Environment Variables

```bash
# .env.local

# Storyblok API Tokens
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token
STORYBLOK_MANAGEMENT_TOKEN=your_management_token
STORYBLOK_SPACE_ID=your_space_id

# Draft Mode
STORYBLOK_PREVIEW_SECRET=random_secret_string

# Environment
NEXT_PUBLIC_ENV=development
```

### Storyblok Account Setup

1. **Create Account:** https://app.storyblok.com/#!/signup
2. **Create Space:** "[Client Name] Landing Page"
3. **Generate Tokens:**
   - Settings > Access Tokens > Preview Token
   - My Account > Personal Access Tokens (for Management API)
4. **Note Space ID:** From URL `app.storyblok.com/#!/me/spaces/{SPACE_ID}`
5. **Configure Region:** EU or US data center

### Visual Editor Setup

1. Go to Settings > Visual Editor
2. Set preview URL: `https://your-domain.com/api/draft?secret=YOUR_SECRET&slug=`
3. For local dev: `http://localhost:3000/api/draft?secret=YOUR_SECRET&slug=`

---

## DEPLOYMENT

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Available Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "setup:components": "npx tsx scripts/setup-components.ts",
    "setup:settings": "npx tsx scripts/create-settings-story.ts",
    "setup:home": "npx tsx scripts/create-home-story.ts",
    "setup:pages": "npx tsx scripts/create-page-stories.ts",
    "audit:a11y": "npx tsx scripts/audit-accessibility.ts",
    "audit:responsive": "npx tsx scripts/audit-responsive.ts"
  }
}
```

### Production Deployment

**Recommended Platforms:**
- **Vercel** (zero-config Next.js, preview deployments)
- **AWS Amplify** (full AWS integration)
- **AWS App Runner** (container-based)

**Required Configuration:**
1. Set environment variables in deployment platform
2. Configure Storyblok Visual Editor URL to production domain
3. Update CORS settings if needed

---

## TESTING CHECKLIST

### Functional Testing

- [ ] Homepage loads at root URL
- [ ] All page sections render correctly
- [ ] Dynamic routes work (`/about`, `/contact`, `/clinical-data`)
- [ ] Images load without errors
- [ ] Links navigate correctly
- [ ] Rich text renders (legal disclaimers)
- [ ] Visual Editor connects and shows preview
- [ ] Draft mode shows unpublished changes
- [ ] Contact form submits (POC: console log)

### Responsive Testing

- [ ] Mobile (375px): Content readable, no horizontal scroll
- [ ] Tablet (768px): Grid layouts adjust
- [ ] Desktop (1920px): Content centered, images sharp

### Performance Testing

- [ ] Lighthouse score >90 on all metrics
- [ ] LCP <2.5s
- [ ] CLS <0.1
- [ ] FID <100ms

### Compliance Testing

- [ ] Legal disclaimers visible on all relevant sections
- [ ] Forward-looking statements properly disclosed
- [ ] Compliance notices in footer
- [ ] Print layout renders correctly (Cmd/Ctrl+P)

### Audit Testing

```bash
# Run accessibility audit
npm run audit:a11y

# Run responsive audit
npm run audit:responsive
```

---

## CLIENT ADAPTATION GUIDE

### Step 1: Replace Company Information

Update the following in Storyblok:

1. **Global Settings Story:**
   - Logo asset
   - Navigation items
   - Contact email
   - Copyright text

2. **Home Story:**
   - SEO title and description
   - Hero headline and subheadline
   - Legal disclaimer text
   - Feature content
   - Clinical data (if applicable)
   - Footer compliance notice

### Step 2: Create Additional Pages

Use the existing page creation script as a template:

```bash
# Edit scripts/create-page-stories.ts with client content
npm run setup:pages
```

### Step 3: Configure Branding

1. Upload client logo to Storyblok assets
2. Update Tailwind theme colors if needed (`tailwind.config.ts`)
3. Replace placeholder images with client assets

### Step 4: Configure Deployment

1. Create deployment environment (Vercel/AWS)
2. Set production environment variables
3. Configure custom domain
4. Update Storyblok Visual Editor URL

---

## STORYBLOK TIER CONSIDERATIONS

### Free Tier (Current POC)
- ✅ Sufficient for single developer
- ✅ All component features work
- ⚠️ 3 requests/second API limit
- ❌ No workflow approvals
- ❌ No staging environment

### Premium Tier ($2,099/month)
- Required for Phases 2-5
- Workflow approvals (Legal/Regulatory review)
- Content pipelines (Staging → Production)
- Team collaboration
- 6 requests/second API limit

**Recommendation:** Start on Free tier for client POC. Plan Premium upgrade timing with client before Phase 2.

---

## NEXT PHASES PREPARATION

### Phase 2: AI Content Transformation
- SEMANTIC metadata already in place
- `generate-ai-dictionary.ts` script ready
- Component structure supports variant generation

### Phase 3: Optimizely Integration
- A/B variant support in HeroSection
- Component boundaries enable experimentation
- Props/composition pattern ready for flag injection

### Phase 4: Wrike Integration
- Webhook verification scaffold in place
- Workflow banner shows current stage
- Ready for approval workflow triggers

### Phase 5: Full Integration
- CI/CD pipeline ready for multi-environment
- Type-safe architecture prevents regressions
- Audit system ensures quality gates

---

## GOVERNANCE & COMPLIANCE

### Non-Negotiable Requirements

1. **Legal disclaimers** must always be visible
2. **Forward-looking statements** cannot be hidden
3. **Compliance notices** required in footer
4. **Risk disclosures** must be accessible

### Audit Enforcement

The CI pipeline **fails** if:
- Accessibility audit finds WCAG violations
- Responsive audit detects layout overflow
- TypeScript compilation errors exist
- ESLint rules are violated

This prevents non-compliant content from reaching production.

---

## SUPPORT & DOCUMENTATION

### Code Documentation
All components include JSDoc comments explaining:
- Primary use case
- Phase 3+ experimentation notes
- Compliance requirements

### Storyblok Support
- Documentation: https://www.storyblok.com/docs
- Support: support@storyblok.com

### Client Handoff
A separate `HANDOFF.md` should be created with:
- Client-specific configuration
- Content editing instructions
- Deployment procedures
- Support contacts

---

## REVISION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial consolidated spec |

---

END OF STORYBLOK POC COMPLETE SPECIFICATION
