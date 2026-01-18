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
            component: "contact_form_section",
            section_title: "Contact Us",
            section_subtitle: "Have questions about our clinical trials or investment opportunities? We're here to help.",
            contact_email: "info@nexusbio.com",
            contact_phone: "+1 (555) 123-4567",
            address: "123 Innovation Drive\nSuite 400\nBoston, MA 02110",
            inquiry_types: "Investor Relations,Clinical Trial Information,Partnership Opportunities,Media Inquiry,General Inquiry",
            submit_button_text: "Send Message",
            success_title: "Message Sent!",
            success_message: "Thank you for reaching out. Our team will respond within 2 business days.",
            form_disclaimer: "By submitting this form, you agree to our privacy policy. We will never share your information with third parties.",
          },
        ],
      },
    },
    {
      name: "Clinical Data",
      slug: "clinical-data",
      content: {
        component: "page",
        seo_title: "Clinical Data | NexusBio Therapeutics",
        seo_description: "Review our Phase 3 clinical trial results and research data.",
        body: [
          {
            component: "hero_section",
            headline: "Clinical Trial Results",
            subheadline: "Rigorous science. Meaningful outcomes. Our data speaks for itself.",
            cta_text: "View Full Report",
            cta_link: { url: "#data", linktype: "url" },
            show_trial_badge: true,
            legal_disclaimer: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      text: "Data presented is from ongoing clinical trials. Results may vary. Not intended as medical advice.",
                      type: "text",
                    },
                  ],
                },
              ],
            },
          },
          {
            component: "clinical_data_section",
            section_title: "Phase 3 Trial Results",
            data_points: [
              {
                component: "stat_block",
                metric: "73%",
                metric_label: "Overall Response Rate",
                context: "vs. 45% in standard of care arm",
                _uid: "stat-1",
              },
              {
                component: "stat_block",
                metric: "18.2",
                metric_label: "Median PFS (months)",
                context: "Progression-free survival",
                _uid: "stat-2",
              },
              {
                component: "stat_block",
                metric: "42%",
                metric_label: "Reduction in Adverse Events",
                context: "Grade 3+ events vs. comparator",
                _uid: "stat-3",
              },
            ],
            trial_disclaimer: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      text: "Results from NXB-301 Phase 3 trial (n=847). Primary endpoint: Overall Response Rate. Secondary endpoints: PFS, OS, safety. Data cutoff: January 2024.",
                      type: "text",
                    },
                  ],
                },
              ],
            },
            data_source: "NXB-301 Phase 3 Clinical Trial, Data on File",
            _uid: "clinical-section-1",
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
    } catch (error) {
      const err = error as { response?: { data?: unknown }; message?: string };
      console.error(`❌ Failed ${page.name}:`, err.response?.data || err.message);
    }
  }
}

createPages().catch(console.error);
