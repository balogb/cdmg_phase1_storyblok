import type { SbBlokData } from "@storyblok/react/rsc";

// Asset type
export interface StoryblokAsset {
  filename: string;
  alt?: string;
}

// Link type
export interface StoryblokLink {
  cached_url: string;
  linktype: string;
}

// Richtext type
export type StoryblokRichtext = {
  type: string;
  content?: StoryblokRichtext[];
  [key: string]: unknown;
};

// Hero Section
export interface HeroSectionStoryblok extends SbBlokData {
  component: "hero_section";
  logo?: StoryblokAsset;
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_link: StoryblokLink;
  background_image?: StoryblokAsset;
  legal_disclaimer: any; // Richtext type
  show_trial_badge: boolean;
  variant?: "control" | "variant_b";
}

// Feature Block
export interface FeatureBlockStoryblok extends SbBlokData {
  component: "feature_block";
  icon?: StoryblokAsset;
  title: string;
  description: string;
  citation?: string;
}

// Features Section
export interface FeaturesSectionStoryblok extends SbBlokData {
  component: "features_section";
  section_title: string;
  section_subtitle?: string;
  features: FeatureBlockStoryblok[];
}

// Stat Block
export interface StatBlockStoryblok extends SbBlokData {
  component: "stat_block";
  metric: string;
  metric_label: string;
  context?: string;
}

// Clinical Data Section
export interface ClinicalDataSectionStoryblok extends SbBlokData {
  component: "clinical_data_section";
  section_title: string;
  data_points: StatBlockStoryblok[];
  trial_disclaimer: StoryblokRichtext;
  data_source?: string;
}

// Resource Link
export interface ResourceLinkStoryblok extends SbBlokData {
  component: "resource_link";
  title: string;
  description?: string;
  link: StoryblokLink;
  file_type: "pdf" | "sec" | "presentation" | "external";
}

// Investor Resources Section
export interface InvestorResourcesSectionStoryblok extends SbBlokData {
  component: "investor_resources_section";
  section_title: string;
  resources: ResourceLinkStoryblok[];
}

// Footer Link
export interface FooterLinkStoryblok extends SbBlokData {
  component: "footer_link";
  label: string;
  url: StoryblokLink;
}

// Footer Section
export interface FooterSectionStoryblok extends SbBlokData {
  component: "footer_section";
  company_name: string;
  copyright_text: string;
  legal_links: FooterLinkStoryblok[];
  compliance_notice: StoryblokRichtext;
  contact_email?: string;
}

// Nav Item
export interface NavItemStoryblok extends SbBlokData {
  component: "nav_item";
  label: string;
  link: {
    url: string;
    linktype: string;
    cached_url: string;
  };
}

// Global Settings
export interface GlobalSettingsStoryblok extends SbBlokData {
  component: "global_settings";
  logo?: {
    filename: string;
    alt?: string;
  };
  navigation?: NavItemStoryblok[];
  footer_text?: any; // Richtext
  contact_email?: string;
  copyright?: string;
}

// Page (Root)
export interface PageStoryblok extends SbBlokData {
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
  og_image?: StoryblokAsset;
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
