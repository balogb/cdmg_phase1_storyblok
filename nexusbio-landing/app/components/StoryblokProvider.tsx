"use client";

import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import HeroSection from "@/app/components/storyblok/HeroSection";
import FeaturesSection from "@/app/components/storyblok/FeaturesSection";
import FeatureBlock from "@/app/components/storyblok/FeatureBlock";
import ClinicalDataSection from "@/app/components/storyblok/ClinicalDataSection";
import StatBlock from "@/app/components/storyblok/StatBlock";
import InvestorResourcesSection from "@/app/components/storyblok/InvestorResourcesSection";
import ResourceLink from "@/app/components/storyblok/ResourceLink";
import ContactFormSection from "@/app/components/storyblok/ContactFormSection";
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
  contact_form_section: ContactFormSection,
  footer_section: FooterSection,
  footer_link: FooterLink,
  page: Page,
};

/**
 * StoryblokProvider
 * This client component initializes Storyblok once for the client side,
 * facilitating real-time updates in the Visual Editor.
 */
export default function StoryblokProvider({ children }: { children: React.ReactNode }) {
  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components,
    apiOptions: {
      region: "eu",
    },
  });

  return <>{children}</>;
}
