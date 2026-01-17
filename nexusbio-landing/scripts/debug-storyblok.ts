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

const client = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
});

async function debugFetch() {
  console.log("Using Access Token:", process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN?.slice(0, 5) + "...");
  
  try {
    const { data: publishedData } = await client.get(`cdn/stories/home`, {
      version: "published",
      cv: Date.now(),
    });
    console.log("Published Headline:", publishedData.story.content.body[0]?.headline || "N/A");

    const { data: draftData } = await client.get(`cdn/stories/home`, {
      version: "draft",
      cv: Date.now(),
    });
    console.log("Draft Headline:", draftData.story.content.body[0]?.headline || "N/A");
    
    console.log("Story ID:", publishedData.story.id);
    console.log("Last Published At:", publishedData.story.published_at);
  } catch (error: unknown) {
    console.error("Fetch failed:", error.message);
  }
}

debugFetch();
