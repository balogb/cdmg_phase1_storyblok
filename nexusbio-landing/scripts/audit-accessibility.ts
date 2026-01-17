import { chromium } from "playwright";
import { injectAxe, checkA11y } from "axe-playwright";

async function runAudit() {
  console.log("🚀 Starting accessibility audit...\n");
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const urls = [
    "http://localhost:3000/",
    "http://localhost:3000/about",
    "http://localhost:3000/contact"
  ];

  for (const url of urls) {
    console.log(`🔍 Auditing: ${url}`);
    try {
      await page.goto(url);
      await injectAxe(page);
      
      const results = await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true }
      });

      console.log(`✅ ${url} passed accessibility checks!`);
    } catch (error: any) {
      console.error(`❌ ${url} failed accessibility checks.`);
      // Extract violations if possible
      if (error.message.includes("violations")) {
        console.error("Violations found. Please run with a visual debugger or check individual component semantics.");
      } else {
        console.error(error.message);
      }
    }
    console.log("----------------------------------\n");
  }

  await browser.close();
  console.log("✨ Audit complete!");
}

runAudit().catch((err) => {
  console.error("Critical error during audit:", err);
  process.exit(1);
});
