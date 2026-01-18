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

async function createHomeStory() {
  const homeStoryContent = {
    name: "Home",
    slug: "home",
    content: {
      component: "page",
      body: [
        {
          component: "hero_section",
          logo: null,
          headline: "Architecting the Future of Oncology",
          subheadline:
            "NexusBio is pioneering Phase 3 precision therapeutics designed to overcome treatment resistance in solid tumors.",
          cta_text: "View Clinical Data",
          cta_link: {
            cached_url: "/clinical-data",
            fieldtype: "multilink",
            linktype: "url",
            url: "/clinical-data",
          },
          show_trial_badge: true,
          legal_disclaimer: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Forward-Looking Statements: This presentation contains forward-looking statements that involve risks and uncertainties. Actual results may differ materially.",
                  },
                ],
              },
            ],
          },
        },
        {
          component: "features_section",
          section_title: "Our Therapeutic Platform",
          section_subtitle:
            "Advancing a pipeline focused on high-unmet-need oncological indications.",
          features: [
            {
              component: "feature_block",
              title: "Precision Delivery",
              description:
                "Proprietary Nano-Ligand platform ensures 15x higher tumor accumulation compared to standard chemotherapy.",
            },
            {
              component: "feature_block",
              title: "Overcoming Resistance",
              description:
                "Targeting the NX-42 pathway to sensitize refractory tumors and improve patient outcomes.",
            },
            {
              component: "feature_block",
              title: "Targeted Cytotoxicity",
              description:
                "Minimizing off-target effects through selective activation within the tumor microenvironment.",
            },
          ],
        },
        {
          component: "clinical_data_section",
          section_title: "Phase 3 NX-101 Trial Results",
          data_points: [
            {
              component: "stat_block",
              metric: "42%",
              metric_label: "Overall Response Rate",
              context: "Compared to 15% in the control arm.",
            },
            {
              component: "stat_block",
              metric: "12.4m",
              metric_label: "Median Progression-Free Survival",
              context: "A significant improvement over current standard of care.",
            },
          ],
          trial_disclaimer: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Data source: ClinicalTrials.gov NCT04857294. Results based on interim analysis of Phase 3 cohort.",
                  },
                ],
              },
            ],
          },
          data_source: "ClinicalTrials.gov NCT04857294",
        },
        {
          component: "investor_resources_section",
          section_title: "Investor Materials",
          resources: [
            {
              component: "resource_link",
              title: "Q3 2024 Earnings Presentation",
              description: "Quarterly financial results and strategic update.",
              link: {
                fieldtype: "multilink",
                linktype: "url",
                url: "https://nexusbio.com/investors/q3-2024",
              },
              file_type: "presentation",
            },
            {
              component: "resource_link",
              title: "SEC Form 10-K",
              description: "Annual report for the fiscal year ended 2023.",
              link: {
                fieldtype: "multilink",
                linktype: "url",
                url: "https://nexusbio.com/investors/10k",
              },
              file_type: "sec",
            },
          ],
        },
        {
          component: "footer_section",
          company_name: "NexusBio Therapeutics, Inc.",
          copyright_text: "© 2024 NexusBio Therapeutics, Inc. All rights reserved.",
          compliance_notice: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "NexusBio is a clinical-stage biopharmaceutical company. Investigational products have not been approved for efficacy or safety by regulatory authorities.",
                  },
                ],
              },
            ],
          },
          contact_email: "ir@nexusbio.com",
        },
      ],
      seo_title: "NexusBio Therapeutics | Phase 3 Oncology Solutions",
      seo_description:
        "Advancing the next generation of precision oncology therapeutics for solid tumors.",
    },
  };

  try {
    // Check if story exists first
    const existing = await client.get(`spaces/${SPACE_ID}/stories/`, {
      with_slug: "home",
    });

    if (existing.data.stories?.length > 0) {
      const storyId = existing.data.stories[0].id;
      console.log(`Updating existing home story (ID: ${storyId})...`);
      await client.put(`spaces/${SPACE_ID}/stories/${storyId}`, {
        story: homeStoryContent,
        publish: 1,
      });
      console.log("✅ Home story updated and published!");
    } else {
      console.log("Creating new home story...");
      await client.post(`spaces/${SPACE_ID}/stories/`, {
        story: homeStoryContent,
        publish: 1,
      });
      console.log("✅ Home story created and published!");
    }
  } catch (error: any) {
    console.error("❌ Failed to build home story:", error.response?.data || error.message);
  }
}

createHomeStory();
