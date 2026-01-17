import { chromium, devices } from "playwright";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "iPhone 13", ...devices["iPhone 13"] },
  { name: "iPad Pro 11", ...devices["iPad Pro 11"] },
  { name: "Desktop Chrome", viewport: { width: 1440, height: 900 } },
];

const TARGET_URLS = [
  "http://localhost:3000/",
  // Add more URLs as needed
];

const SCREENSHOT_DIR = path.join(process.cwd(), "test-results", "responsive-screenshots");

async function runResponsiveAudit() {
  console.log("🚀 Starting responsive layout audit...\n");

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();

  for (const url of TARGET_URLS) {
    console.log(`🔍 Auditing: ${url}`);

    for (const device of VIEWPORTS) {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();

      try {
        await page.goto(url, { waitUntil: "networkidle" });
        console.log(`   📱 Device: ${device.name}`);

        // 1. Check for horizontal overflow
        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.offsetWidth;
          const bodyWidth = document.body.scrollWidth;
          const elementsWithOverflow = Array.from(document.querySelectorAll("*")).filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.right > window.innerWidth || rect.left < 0;
          });

          return {
            hasOverflow: bodyWidth > docWidth || elementsWithOverflow.length > 0,
            bodyWidth,
            docWidth,
            overflowingElementsCount: elementsWithOverflow.length,
          };
        });

        if (overflow.hasOverflow) {
          console.warn(`   ⚠️  HORIZONTAL OVERFLOW DETECTED on ${device.name}!`);
          console.warn(`      Body scrollWidth: ${overflow.bodyWidth}, Viewport width: ${overflow.docWidth}`);
        } else {
          console.log(`   ✅ No horizontal overflow on ${device.name}.`);
        }

        // 2. Take screenshot
        const screenshotPath = path.join(
          SCREENSHOT_DIR,
          `${url.replace(/https?:\/\/|[:/]/g, "_")}_${device.name.replace(/\s+/g, "_")}.png`
        );
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`   📸 Screenshot saved: ${screenshotPath}`);

      } catch (error: any) {
        console.error(`   ❌ Error auditing ${url} on ${device.name}:`, error.message);
      } finally {
        await context.close();
      }
    }
    console.log("----------------------------------\n");
  }

  await browser.close();
  console.log("✨ Responsive audit complete! Results saved in", SCREENSHOT_DIR);
}

runResponsiveAudit().catch((err) => {
  console.error("Critical error during audit:", err);
  process.exit(1);
});
