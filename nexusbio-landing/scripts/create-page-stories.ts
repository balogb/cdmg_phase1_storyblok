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

async function createPages() {
  const pages = [
    {
      name: "About Us",
      slug: "about",
      content: {
        component: "page",
        seo_title: "About NexusBio Therapeutics",
        seo_description: "Learn about our mission to revolutionize oncology.",
        body: [
          {
            component: "hero_section",
            headline: "Our Mission: Pioneering Precision Oncology",
            subheadline: "We are dedicated to improving patient outcomes through innovative drug delivery systems.",
            cta_text: "Our Management Team",
            cta_link: { url: "/about", linktype: "url" },
            legal_disclaimer: {
              type: "doc",
              content: [{ type: "paragraph", content: [{ text: "NexusBio is a clinical-stage company.", type: "text" }] }],
            },
          },
        ],
      },
    },
    {
      name: "Contact",
      slug: "contact",
      content: {
        component: "page",
        seo_title: "Contact NexusBio",
        seo_description: "Get in touch with our investor relations or medical team.",
        body: [
          {
            component: "hero_section",
            headline: "Get in Touch",
            subheadline: "Whether you are an investor, researcher, or patient, we want to hear from you.",
            cta_text: "Email Us",
            cta_link: { url: "mailto:info@nexusbio.com", linktype: "url" },
            legal_disclaimer: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      text: "Contact information provided for institutional inquiries only.",
                      type: "text",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  ];

  for (const page of pages) {
    try {
      const existing = await client.get(`spaces/${SPACE_ID}/stories/`, {
        with_slug: page.slug,
      });

      if (existing.data.stories?.length > 0) {
        const storyId = existing.data.stories[0].id;
        console.log(`🔄 Updating: ${page.name} (ID: ${storyId})...`);
        await client.put(`spaces/${SPACE_ID}/stories/${storyId}`, {
          story: page,
          publish: 1,
        });
      } else {
        console.log(`🚀 Creating: ${page.name}...`);
        await client.post(`spaces/${SPACE_ID}/stories/`, {
          story: page,
          publish: 1,
        });
      }
      console.log(`✅ ${page.name} ready!`);
    } catch (error: any) {
      console.error(`❌ Failed ${page.name}:`, error.response?.data || error.message);
    }
  }
}

createPages().catch(console.error);
