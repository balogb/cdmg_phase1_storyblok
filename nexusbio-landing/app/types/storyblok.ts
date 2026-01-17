import { z } from "zod";

// --- Base Schemas ---

export const StoryblokAssetSchema = z.preprocess((val) => val === null ? undefined : val, z.object({
  filename: z.string(),
  alt: z.string().optional(),
}).optional());

export const StoryblokLinkSchema = z.object({
  cached_url: z.string().optional(),
  url: z.string().optional(),
  linktype: z.string(),
});

interface StoryblokRichTextNode {
  type: string;
  content?: StoryblokRichTextNode[];
  [key: string]: unknown;
}

export const StoryblokRichtextSchema: z.ZodType<StoryblokRichTextNode> = z.lazy(() =>
  z.object({
    type: z.string(),
    content: z.array(StoryblokRichtextSchema).optional(),
  }).catchall(z.unknown())
);

// --- Component Schemas ---

export const HeroSectionSchema = z.object({
  component: z.literal("hero_section"),
  logo: StoryblokAssetSchema,
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().min(1, "Subheadline is required"),
  cta_text: z.string().default("Learn More"),
  cta_link: StoryblokLinkSchema,
  background_image: StoryblokAssetSchema,
  legal_disclaimer: StoryblokRichtextSchema.optional(), // Richtext
  show_trial_badge: z.boolean().default(false),
  variant: z.enum(["control", "variant_b"]).default("control"),
  _uid: z.string(),
});

export const FeatureBlockSchema = z.object({
  component: z.literal("feature_block"),
  icon: StoryblokAssetSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  citation: z.string().optional(),
  _uid: z.string(),
});

export const FeaturesSectionSchema = z.object({
  component: z.literal("features_section"),
  section_title: z.string().min(1),
  section_subtitle: z.string().optional(),
  features: z.array(FeatureBlockSchema).default([]),
  _uid: z.string(),
});

export const StatBlockSchema = z.object({
  component: z.literal("stat_block"),
  metric: z.string().min(1),
  metric_label: z.string().min(1),
  context: z.string().optional(),
  _uid: z.string(),
});

export const ClinicalDataSectionSchema = z.object({
  component: z.literal("clinical_data_section"),
  section_title: z.string().min(1),
  data_points: z.array(StatBlockSchema).default([]),
  trial_disclaimer: StoryblokRichtextSchema.optional(),
  data_source: z.string().optional(),
  _uid: z.string(),
});

export const ResourceLinkSchema = z.object({
  component: z.literal("resource_link"),
  title: z.string().min(1),
  description: z.string().optional(),
  link: StoryblokLinkSchema,
  file_type: z.enum(["pdf", "sec", "presentation", "external"]),
  _uid: z.string(),
});

export const InvestorResourcesSectionSchema = z.object({
  component: z.literal("investor_resources_section"),
  section_title: z.string().min(1),
  resources: z.array(ResourceLinkSchema).default([]),
  _uid: z.string(),
});

export const FooterLinkSchema = z.object({
  component: z.literal("footer_link"),
  label: z.string().min(1),
  url: StoryblokLinkSchema,
  _uid: z.string(),
});

export const FooterSectionSchema = z.object({
  component: z.literal("footer_section"),
  company_name: z.string().min(1),
  copyright_text: z.string().min(1),
  legal_links: z.array(FooterLinkSchema).default([]),
  compliance_notice: StoryblokRichtextSchema.optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  _uid: z.string(),
});

export const NavItemSchema = z.object({
  component: z.literal("nav_item"),
  label: z.string().min(1),
  link: StoryblokLinkSchema,
  _uid: z.string(),
});

export const GlobalSettingsSchema = z.object({
  component: z.literal("global_settings"),
  logo: StoryblokAssetSchema,
  navigation: z.array(NavItemSchema).default([]),
  footer_text: StoryblokRichtextSchema.optional(), // Richtext
  contact_email: z.string().optional().nullable(),
  copyright: z.string().optional().nullable(),
  _uid: z.string(),
});

export const PageSchema = z.object({
  component: z.literal("page"),
  body: z.array(
    z.discriminatedUnion("component", [
      HeroSectionSchema,
      FeaturesSectionSchema,
      ClinicalDataSectionSchema,
      InvestorResourcesSectionSchema,
      FooterSectionSchema,
    ])
  ).default([]),
  seo_title: z.string().max(60).optional().default("NexusBio Therapeutics"),
  seo_description: z.string().max(160).optional().default("Advancing oncology therapeutics."),
  og_image: StoryblokAssetSchema,
  _uid: z.string(),
});

export const StorySchema = z.object({
  id: z.number(),
  uuid: z.string(),
  name: z.string(),
  slug: z.string(),
  full_slug: z.string(),
  content: PageSchema,
  created_at: z.string(),
  published_at: z.string().nullable(),
  first_published_at: z.string().nullable(),
});

// --- Inferred Types ---

export type StoryblokAsset = z.infer<typeof StoryblokAssetSchema>;
export type StoryblokLink = z.infer<typeof StoryblokLinkSchema>;
export type StoryblokRichtext = z.infer<typeof StoryblokRichtextSchema>;

export type HeroSectionStoryblok = z.infer<typeof HeroSectionSchema>;
export type FeatureBlockStoryblok = z.infer<typeof FeatureBlockSchema>;
export type FeaturesSectionStoryblok = z.infer<typeof FeaturesSectionSchema>;
export type StatBlockStoryblok = z.infer<typeof StatBlockSchema>;
export type ClinicalDataSectionStoryblok = z.infer<typeof ClinicalDataSectionSchema>;
export type ResourceLinkStoryblok = z.infer<typeof ResourceLinkSchema>;
export type InvestorResourcesSectionStoryblok = z.infer<typeof InvestorResourcesSectionSchema>;
export type FooterLinkStoryblok = z.infer<typeof FooterLinkSchema>;
export type FooterSectionStoryblok = z.infer<typeof FooterSectionSchema>;
export type NavItemStoryblok = z.infer<typeof NavItemSchema>;
export type GlobalSettingsStoryblok = z.infer<typeof GlobalSettingsSchema>;
export type PageStoryblok = z.infer<typeof PageSchema>;
export type StoryblokStory = z.infer<typeof StorySchema>;
