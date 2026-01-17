# QA & Testing Wrapper

This project includes automated tools to verify accessibility and responsive layouts, especially useful when content is updated via Storyblok (manually or by AI).

## Automated Audits

### 1. Responsive Layout Audit
Checks for horizontal overflow and captures screenshots across multiple viewports (iPhone, iPad, Desktop).

```bash
npm run audit:responsive
```
- **Output**: Detailed console reporting of overflows + screenshots in `./test-results/responsive-screenshots/`.
- **Why**: Ensures that new content (like long headlines or large tables) doesn't break the mobile layout.

### 2. Accessibility Audit
Runs Axe-core checks against key pages to ensure WCAG compliance.

```bash
npm run audit:a11y
```
- **Output**: Reports violations for common issues like color contrast, missing alt text, or incorrect heading hierarchy.

---

## How to use for Storyblok Content Changes

When you or an AI agent makes changes in Storyblok:
1. Ensure your local dev server is running: `npm run dev`.
2. Run the audits:
   ```bash
   npm run audit:responsive
   ```
3. Check the `test-results` folder to visually verify how the content rendered on different devices.

## Strategy: Wrapping for AI Verification

If you are using an AI agent to update content, you can "wrap" the process by instructing the agent to run these scripts after every major content update. For example:

> "Update the Hero Section headline in Storyblok, then run `npm run audit:responsive` to verify it doesn't cause overflow on mobile."

---

## Print / Pamphlet Output

The landing page is optimized for high-quality print output.

### 1. High-Resolution Assets
The `storyblok-loader` has been updated to handle print-quality request. While browsing the web, images are served as WebP for performance. For print, the layout ensures sharp rendering.

### 2. Print Styles (`@media print`)
We use specific CSS to ensure the landing page looks like a professional pamphlet when printed:
- **Hidden Elements**: Navigation, CTAs, and animations are hidden.
- **Page Breaks**: Each major section (Hero, Science, Data) starts on a new page.
- **Color Preservation**: Branding colors are preserved where possible.

### 3. How to Verify Print
- Open the page in Chrome/Safari/Edge.
- Press `Cmd + P` (Mac) or `Ctrl + P` (Windows).
- Ensure "Background Graphics" is enabled in the print settings.
- Review the preview to ensure content is logically grouped on pages and no web-only junk (like buttons) is visible.
