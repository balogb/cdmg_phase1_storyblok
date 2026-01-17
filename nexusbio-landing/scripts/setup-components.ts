import StoryblokClient from "storyblok-js-client";
import * as fs from "fs";
import * as path from "path";

// Manually parse .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
}

const SPACE_ID = process.env.STORYBLOK_SPACE_ID || "";
const MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN || "";

const client = new StoryblokClient({
  oauthToken: MANAGEMENT_TOKEN,
});

const components = [
  // 0. Nav Item (nested, no dependencies)
  {
    name: "nav_item",
    display_name: "Navigation Item",
    schema: {
      label: {
        type: "text",
        required: true,
        description: "SEMANTIC:link_text - Label for the navigation link",
        display_name: "Label",
      },
      link: {
        type: "multilink",
        required: true,
        description: "SEMANTIC:link_url - Target URL for the navigation link",
        display_name: "Link",
      },
    },
    is_root: false,
    is_nestable: true,
    color: "#1b98e0",
  },

  // 0.1 Global Settings
  {
    name: "global_settings",
    display_name: "Global Settings",
    schema: {
      logo: {
        type: "asset",
        filetypes: ["images"],
        description: "SEMANTIC:logo - Site-wide company logo",
        display_name: "Logo",
      },
      navigation: {
        type: "bloks",
        restrict_components: true,
        component_whitelist: ["nav_item"],
        description: "SEMANTIC:navigation - Main header navigation links",
        display_name: "Header Navigation",
      },
      footer_text: {
        type: "richtext",
        description: "SEMANTIC:footer_about - Brief about text for the footer",
        display_name: "Footer About Text",
      },
      contact_email: {
        type: "text",
        description: "SEMANTIC:contact_email - Global contact email address",
        display_name: "Contact Email",
      },
      copyright: {
        type: "text",
        description: "SEMANTIC:copyright - Copyright notice text",
        display_name: "Copyright Text",
      },
    },
    is_root: true,
    is_nestable: false,
    color: "#78909c",
  },

  // 1. Footer Link (nested, no dependencies)
  {
    name: "footer_link",
    display_name: "Footer Link",
    schema: {
      label: {
        type: "text",
        required: true,
        description: "SEMANTIC:link_text - Link text",
        display_name: "Label",
      },
      url: {
        type: "multilink",
        required: true,
        description: "SEMANTIC:link_url - Destination URL",
        display_name: "URL",
      },
    },
    is_root: false,
    is_nestable: true,
    color: "#78909c",
  },

  // 2. Resource Link (nested, no dependencies)
  {
    name: "resource_link",
    display_name: "Resource Link",
    schema: {
      title: {
        type: "text",
        required: true,
        description: "SEMANTIC:resource_title - Document or link title",
        display_name: "Title",
      },
      description: {
        type: "textarea",
        description: "SEMANTIC:resource_description - Brief description of resource",
        display_name: "Description",
      },
      link: {
        type: "multilink",
        required: true,
        description: "SEMANTIC:resource_link - URL or asset download",
        display_name: "Link",
      },
      file_type: {
        type: "option",
        options: [
          { name: "PDF", value: "pdf" },
          { name: "SEC Filing", value: "sec" },
          { name: "Presentation", value: "presentation" },
          { name: "External Link", value: "external" },
        ],
        description: "SEMANTIC:resource_type - Type of resource for icon display",
        display_name: "File Type",
      },
    },
    is_root: false,
    is_nestable: true,
    color: "#ab47bc",
  },

  // 3. Feature Block (nested, no dependencies)
  {
    name: "feature_block",
    display_name: "Feature Block",
    schema: {
      icon: {
        type: "asset",
        filetypes: ["images"],
        description: "SEMANTIC:icon - Feature icon (SVG preferred, will display at 64x64)",
        display_name: "Icon",
      },
      title: {
        type: "text",
        required: true,
        max_length: 80,
        description: "SEMANTIC:feature_title - Feature headline (AI-GUIDE: Concise, active voice, 80 chars max)",
        display_name: "Title",
      },
      description: {
        type: "textarea",
        required: true,
        max_length: 300,
        description: "SEMANTIC:feature_description - Detailed explanation (AI-GUIDE: Focus on patient outcomes or technical advantages, 300 chars max)",
        display_name: "Description",
      },
      citation: {
        type: "text",
        description: "SEMANTIC:citation - Scientific citation or regulatory reference",
        display_name: "Citation (Optional)",
      },
    },
    is_root: false,
    is_nestable: true,
    color: "#66bb6a",
  },

  // 4. Stat Block (nested, no dependencies)
  {
    name: "stat_block",
    display_name: "Stat Block",
    schema: {
      metric: {
        type: "text",
        required: true,
        description: "SEMANTIC:metric_value - Primary statistic (e.g., '47%', '12.4 months')",
        display_name: "Metric",
      },
      metric_label: {
        type: "text",
        required: true,
        description: "SEMANTIC:metric_label - What the metric represents",
        display_name: "Metric Label",
      },
      context: {
        type: "textarea",
        description: "SEMANTIC:metric_context - Additional context or comparison",
        display_name: "Context (Optional)",
      },
    },
    is_root: false,
    is_nestable: true,
    color: "#ffa726",
  },

  // 5. Hero Section (nestable, no dependencies)
  {
    name: "hero_section",
    display_name: "Hero Section",
    schema: {
      logo: {
        type: "asset",
        filetypes: ["images"],
        description: "SEMANTIC:logo - Company logo symbol (PNG/SVG, will display at 48x48)",
        display_name: "Company Logo",
      },
      headline: {
        type: "text",
        required: true,
        max_length: 120,
        description: "SEMANTIC:hero_headline - Primary SEO-optimized headline (AI-GUIDE: Impactful oncology-focused value prop, 120 chars max)",
        display_name: "Headline",
      },
      subheadline: {
        type: "textarea",
        required: true,
        max_length: 250,
        description: "SEMANTIC:hero_subheadline - Supporting description (AI-GUIDE: Primary ad copy source for Meta/Google, 250 chars max)",
        display_name: "Subheadline",
      },
      cta_text: {
        type: "text",
        required: true,
        default_value: "View Clinical Data",
        description: "SEMANTIC:cta - Primary call-to-action button text",
        display_name: "CTA Button Text",
      },
      cta_link: {
        type: "multilink",
        required: true,
        description: "SEMANTIC:cta_link - URL for primary action (internal or external)",
        display_name: "CTA Link",
      },
      background_image: {
        type: "asset",
        filetypes: ["images"],
        description: "SEMANTIC:hero_image - Background image (min 1920x1080, will optimize for responsive)",
        display_name: "Background Image",
      },
      legal_disclaimer: {
        type: "richtext",
        required: true,
        description: "SEMANTIC:legal_disclaimer - Forward-looking statements and risk disclosure (required for SEC compliance)",
        display_name: "Legal Disclaimer",
      },
      show_trial_badge: {
        type: "boolean",
        default_value: true,
        description: "SEMANTIC:trial_badge - Display Phase 3 status badge",
        display_name: "Show Phase 3 Badge",
      },
      variant: {
        type: "option",
        options: [
          { name: "Control (Centered)", value: "control" },
          { name: "Variant B (Left Aligned)", value: "variant_b" },
        ],
        default_value: "control",
        description: "SEMANTIC:experiment_variant - Component variant for A/B testing",
        display_name: "A/B Test Variant",
      },
    },
    is_root: false,
    is_nestable: true,
    color: "#1b98e0",
  },

  // 6. Features Section (depends on feature_block)
  {
    name: "features_section",
    display_name: "Features Section",
    schema: {
      section_title: {
        type: "text",
        required: true,
        description: "SEMANTIC:section_headline - Section heading",
        display_name: "Section Title",
      },
      section_subtitle: {
        type: "textarea",
        description: "SEMANTIC:section_description - Optional introductory text",
        display_name: "Section Subtitle",
      },
      features: {
        type: "bloks",
        restrict_components: true,
        component_whitelist: ["feature_block"],
        minimum: 3,
        maximum: 4,
        description: "SEMANTIC:feature_list - Individual feature blocks (3-4 recommended)",
        display_name: "Feature Blocks",
      },
    },
    is_root: false,
    is_nestable: true,
    color: "#66bb6a",
  },

  // 7. Clinical Data Section (depends on stat_block)
  {
    name: "clinical_data_section",
    display_name: "Clinical Data Section",
    schema: {
      section_title: {
        type: "text",
        required: true,
        description: "SEMANTIC:section_headline - Data section heading",
        display_name: "Section Title",
      },
      data_points: {
        type: "bloks",
        restrict_components: true,
        component_whitelist: ["stat_block"],
        description: "SEMANTIC:clinical_metrics - Individual data points with regulatory context",
        display_name: "Data Points",
      },
      trial_disclaimer: {
        type: "richtext",
        required: true,
        description: "SEMANTIC:legal_disclaimer - Trial methodology and limitations disclosure",
        display_name: "Trial Disclaimer",
      },
      data_source: {
        type: "text",
        description: "SEMANTIC:citation - Primary data source (e.g., 'ClinicalTrials.gov NCT04857294')",
        display_name: "Data Source",
      },
    },
    is_root: false,
    is_nestable: true,
    color: "#ffa726",
  },

  // 8. Investor Resources Section (depends on resource_link)
  {
    name: "investor_resources_section",
    display_name: "Investor Resources",
    schema: {
      section_title: {
        type: "text",
        required: true,
        description: "SEMANTIC:section_headline - Resources section heading",
        display_name: "Section Title",
      },
      resources: {
        type: "bloks",
        restrict_components: true,
        component_whitelist: ["resource_link"],
        description: "SEMANTIC:resource_list - Downloadable documents and external links",
        display_name: "Resource Links",
      },
    },
    is_root: false,
    is_nestable: true,
    color: "#ab47bc",
  },

  // 9. Footer Section (depends on footer_link)
  {
    name: "footer_section",
    display_name: "Footer",
    schema: {
      company_name: {
        type: "text",
        required: true,
        default_value: "NexusBio Therapeutics, Inc.",
        description: "SEMANTIC:company_name - Legal entity name",
        display_name: "Company Name",
      },
      copyright_text: {
        type: "text",
        required: true,
        description: "SEMANTIC:copyright - Copyright notice",
        display_name: "Copyright Text",
      },
      legal_links: {
        type: "bloks",
        restrict_components: true,
        component_whitelist: ["footer_link"],
        description: "SEMANTIC:legal_navigation - Privacy policy, terms, etc.",
        display_name: "Legal Links",
      },
      compliance_notice: {
        type: "richtext",
        required: true,
        description: "SEMANTIC:legal_disclaimer - SEC, FDA compliance statements",
        display_name: "Compliance Notice",
      },
      contact_email: {
        type: "text",
        description: "SEMANTIC:contact_email - Investor relations email",
        display_name: "Contact Email",
      },
    },
    is_root: false,
    is_nestable: true,
    color: "#78909c",
  },

  // 10. Page (root component, depends on all section components)
  {
    name: "page",
    display_name: "Page",
    schema: {
      body: {
        type: "bloks",
        restrict_components: true,
        component_whitelist: [
          "hero_section",
          "features_section",
          "clinical_data_section",
          "investor_resources_section",
          "footer_section",
        ],
        description: "SEMANTIC:page_sections - Page content sections",
        display_name: "Page Sections",
      },
      seo_title: {
        type: "text",
        required: true,
        max_length: 60,
        description: "SEMANTIC:seo_title - Page title for search engines and social sharing",
        display_name: "SEO Title",
      },
      seo_description: {
        type: "textarea",
        required: true,
        max_length: 160,
        description: "SEMANTIC:seo_description - Meta description for search results",
        display_name: "SEO Description",
      },
      og_image: {
        type: "asset",
        filetypes: ["images"],
        description: "SEMANTIC:og_image - Social sharing image (1200x630 recommended)",
        display_name: "Open Graph Image",
      },
    },
    is_root: true,
    is_nestable: false,
    color: "#1b98e0",
  },
];

async function createComponent(component: typeof components[0]) {
  try {
    // Check if component exists
    // @ts-ignore - Storyblok Management API types are inconsistent
    const existingComponents = (await client.get(`spaces/${SPACE_ID}/components/`)) as any;
    const existing = existingComponents.data.components.find((c: { name: string; id: number }) => c.name === component.name);

    if (existing) {
      console.log(`🔄 Updating: ${component.display_name} (ID: ${existing.id})...`);
      // @ts-ignore
      await client.put(`spaces/${SPACE_ID}/components/${existing.id}`, {
        component: { ...component, id: existing.id },
      });
      console.log(`✅ Updated: ${component.display_name}`);
      return existing;
    }

    // @ts-ignore
    const response = (await client.post(`spaces/${SPACE_ID}/components/`, {
      component,
    })) as any;
    console.log(`✅ Created: ${component.display_name}`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorData = (error as { response?: { data?: unknown } })?.response?.data;
    console.error(`❌ Failed: ${component.display_name}`, errorData || errorMessage);
    throw error;
  }
}

async function main() {
  console.log("🚀 Setting up Storyblok components...\n");

  for (const component of components) {
    await createComponent(component);
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log("\n✨ Component setup complete!");
  console.log("\nNext steps:");
  console.log("1. Go to Storyblok → Content");
  console.log('2. Create a new story with slug "home"');
  console.log('3. Set content type to "page"');
  console.log("4. Add sections and publish");
}

main().catch(console.error);
