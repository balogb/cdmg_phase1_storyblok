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

---

## Workflow Integration (CDMG Best Practice)

This project is prepared for Storyblok's workflow/approval stages.

### 1. Stage-Aware Previews
When viewing a page in the Storyblok Visual Editor, a **Workflow Banner** appears at the bottom right.
- It displays the current stage (e.g., "Draft", "Ready to Publish").
- It highlights critical tags like `Legal Approved`.
- **Purpose**: Prevents accidental publishing or review of incomplete content.

### 2. Automated Guardrails (Webhooks)
For enterprise-grade compliance, we recommend connecting Storyblok Webhooks to our audit scripts.
- **Reference Script**: See `scripts/webhook-verify.ts`.
- **The "Golden Path"**:
    1. AI/Editor updates content.
    2. Workflow moves to "Ready for Review".
    3. Storyblok triggers a webhook to your server.
    4. Your server runs `npm run audit:responsive` and `npm run audit:a11y`.
    5. If audits fail, the content is automatically flagged or moved back to "Draft".

### 3. How to Verify Workflows
1. Open a story in Storyblok.
2. Change the Workflow Stage.
3. Observe the `WorkflowBanner` update in the preview (real-time).

---

## CI/CD & Deployment Guardrails

This project uses **GitHub Actions** to automate quality checks and deployments.

### 1. Continuous Integration (`ci.yml`)
Runs on every push or pull request to `main` or `staging`.
- **Validation**: Checks for linting errors and TypeScript type safety.
- **Automated Audits**: Runs the `audit:responsive` and `audit:a11y` scripts in a headless environment.
- **Artifacts**: Screenshots of any detected layout failures are uploaded as GitHub Action artifacts for visual debugging.

### 2. Deployment Scaffolding (`deploy.yml`)
Handles automated deployments to multiple environments.
- **Staging**: Deploys when code is merged into the `staging` branch.
- **Production**: Deploys when code is merged into the `main` branch.

### 3. Required Secrets
To enable the CI/CD pipeline, ensure the following secrets are configured in your GitHub repository:
- `NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN`
- `STORYBLOK_MANAGEMENT_TOKEN`
- (Optional) `VERCEL_TOKEN` / `AWS_ACCESS_KEY` for physical deployments.
