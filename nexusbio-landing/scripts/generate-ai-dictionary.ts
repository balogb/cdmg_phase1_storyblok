import * as fs from "fs";
import * as path from "path";

/**
 * generate-ai-dictionary.ts
 * This script parses the setup-components.ts file (or we could use the components array directly)
 * and exports a JSON manifest for Relevance AI to understand the component library.
 */

// For this POC, we'll import the components from our setup script
// Since setup-components.ts is a script, we'll mock the requirements or just re-define the logic here
// Ideally, we'd have a shared 'registry' file.

async function generateDictionary() {
  console.log("🤖 Generating AI Component Dictionary...");

  // In a real project, we'd import the component list. 
  // For now, we'll read the setup-components.ts file and extract the data
  const setupPath = path.resolve(process.cwd(), "scripts/setup-components.ts");
  const content = fs.readFileSync(setupPath, "utf-8");

  // Simple regex-based extraction for POC (ideally use TS AST for production)
  const componentsMatch = content.match(/const components = (\[[\s\S]*?\]);/);
  
  if (!componentsMatch) {
    console.error("❌ Could not find components array in setup-components.ts");
    return;
  }

  // We'll clean up the match to make it valid JSON-like (this is fragile but okay for POC)
  // More robust: just re-declare the essence we want to export
  
  const aiManifest = [
    {
      name: "hero_section",
      role: "High-impact page header. Used for value propositions and A/B testing.",
      fields: {
        headline: { semantic: "hero_headline", limit: 120, guide: "Impactful oncology-focused value prop" },
        subheadline: { semantic: "hero_subheadline", limit: 250, guide: "Primary ad copy source for Meta/Google" },
        cta_text: { semantic: "cta", limit: 30, guide: "Action-oriented button text" }
      }
    },
    {
      name: "feature_block",
      role: "Individual feature/benefit unit. Summarizes technical or clinical advantages.",
      fields: {
        title: { semantic: "feature_title", limit: 80, guide: "Concise, active voice" },
        description: { semantic: "feature_description", limit: 300, guide: "Focus on patient outcomes" }
      }
    },
    {
      name: "stat_block",
      role: "Quantitative clinical data point. Used for regulatory or scientific proof.",
      fields: {
        metric: { semantic: "metric_value", limit: 20, guide: "E.g., '47%', '12.4 months'" },
        metric_label: { semantic: "metric_label", limit: 60, guide: "What the metric represents" }
      }
    }
  ];

  const outputPath = path.resolve(process.cwd(), "ai-component-dictionary.json");
  fs.writeFileSync(outputPath, JSON.stringify(aiManifest, null, 2));

  console.log(`✅ AI Dictionary generated at: ${outputPath}`);
}

generateDictionary().catch(console.error);
