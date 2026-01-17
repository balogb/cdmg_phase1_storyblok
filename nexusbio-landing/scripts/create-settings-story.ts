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

async function createSettingsStory() {
  const settingsContent = {
    name: "Settings",
    slug: "settings",
    content: {
      component: "global_settings",
      navigation: [
        {
          component: "nav_item",
          label: "Home",
          link: {
            url: "/",
            linktype: "url",
          },
        },
        {
          component: "nav_item",
          label: "About",
          link: {
            url: "/about",
            linktype: "url",
          },
        },
        {
          component: "nav_item",
          label: "Clinical Data",
          link: {
            url: "/clinical-data",
            linktype: "url",
          },
        },
        {
          component: "nav_item",
          label: "Investors",
          link: {
            url: "/investors",
            linktype: "url",
          },
        },
      ],
      footer_text: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: "NexusBio Therapeutics is a clinical-stage biopharmaceutical company dedicated to developing innovative oncology treatments.",
                type: "text",
              },
            ],
          },
        ],
      },
      contact_email: "ir@nexusbio.com",
      copyright: "© 2024 NexusBio Therapeutics, Inc. All rights reserved.",
    },
  };

  try {
    // Check if story exists first
    const existing = await client.get(`spaces/${SPACE_ID}/stories/`, {
      with_slug: "settings",
    });

    if (existing.data.stories?.length > 0) {
      const storyId = existing.data.stories[0].id;
      console.log(`🔄 Updating existing settings story (ID: ${storyId})...`);
      await client.put(`spaces/${SPACE_ID}/stories/${storyId}`, {
        story: settingsContent,
        publish: 1,
      });
      console.log("✅ Settings story updated and published!");
    } else {
      console.log("🚀 Creating new settings story...");
      await client.post(`spaces/${SPACE_ID}/stories/`, {
        story: settingsContent,
        publish: 1,
      });
      console.log("✅ Settings story created and published!");
    }
  } catch (error: unknown) {
    console.error("❌ Failed to build settings story:", error.response?.data || error.message);
  }
}

createSettingsStory().catch(console.error);
