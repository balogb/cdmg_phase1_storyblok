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

async function seedGoldenCopy() {
  console.log("🧬 Seeding 'Golden Copy' Oncology Content...");

  try {
    // 1. Fetch the 'home' story
    const { data } = await client.get(`spaces/${SPACE_ID}/stories/`, {
      // Management API uses 'by_slugs' or just lists
    }) as any;
    
    const homeStory = data.stories.find((s: any) => s.slug === "home");
    if (!homeStory) {
      console.error("❌ 'home' story not found. Please create it first in the UI.");
      return;
    }

    console.log("Found home story:", homeStory.name, "(ID:", homeStory.id, ")");

    // 2. Define Golden Copy content for Hero
    const goldenContent = {
      ...homeStory.content,
      component: "page",
      body: [
        {
          _uid: "hero-123",
          component: "hero_section",
          headline: "Architecting the Future of precision Oncology",
          subheadline: "NexusBio is pioneering Phase 3 precision therapeutics designed to overcome treatment resistance in solid tumors through innovative drug delivery systems.",
          cta_text: "Access Phase 3 Data",
          cta_link: { cached_url: "clinical-data", linktype: "story" },
          show_trial_badge: true,
          variant: "control"
        },
        {
          _uid: "features-456",
          component: "features_section",
          section_title: "Precision Engineering for Patient Outcomes",
          section_subtitle: "Our platform leverages three core technological pillars to enhance therapeutic efficacy and minimize off-target toxicity.",
          features: [
            {
              _uid: "f1",
              component: "feature_block",
              title: "Selective Internalization",
              description: "Proprietary ligands enable high-affinity binding to tumor-specific biomarkers, ensuring payload delivery directly into the malignant cell cytoplasm.",
            },
            {
              _uid: "f2",
              component: "feature_block",
              title: "Controlled Release Kinetics",
              description: "Engineered pH-sensitive linkers trigger drug release only within the acidic microenvironment of the tumor, sparing healthy systemic tissue.",
            }
          ]
        }
      ]
    };

    // 3. Update the story via Management API
    await client.put(`spaces/${SPACE_ID}/stories/${homeStory.id}`, {
      story: {
        content: goldenContent,
        publish: 1
      } as any
    });

    console.log("✅ 'home' story updated with Golden Copy!");
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.response?.data || error.message);
  }
}

seedGoldenCopy().catch(console.error);
