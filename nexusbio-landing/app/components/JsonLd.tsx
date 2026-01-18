/**
 * JSON-LD Structured Data Component
 *
 * Provides Schema.org structured data for better SEO and rich snippets.
 * Used in layout.tsx for site-wide organization data.
 *
 * Schema types included:
 * - Organization: Company information
 * - WebSite: Site search and navigation
 * - BreadcrumbList: Page hierarchy (add to individual pages)
 */

interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    type: string;
    telephone?: string;
    email?: string;
    contactType: string;
  };
}

interface WebsiteSchema {
  name: string;
  url: string;
  description?: string;
}

/**
 * Organization structured data
 * Customize with client information
 */
export function OrganizationJsonLd({
  name = "[Company Name]",
  url = "https://example.com",
  logo,
  description = "Official investor relations portal",
  sameAs = [],
  contactPoint,
}: Partial<OrganizationSchema>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        ...contactPoint,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Website structured data with search action
 */
export function WebsiteJsonLd({
  name = "[Company Name]",
  url = "https://example.com",
  description,
}: Partial<WebsiteSchema>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    ...(description && { description }),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb structured data
 * Use on individual pages for navigation hierarchy
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Medical Organization schema (for biopharma/healthcare companies)
 */
export function MedicalOrganizationJsonLd({
  name = "[Company Name]",
  url = "https://example.com",
  logo,
  description,
}: Partial<OrganizationSchema>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    medicalSpecialty: {
      "@type": "MedicalSpecialty",
      name: "Oncology",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage schema for FAQ sections
 */
export function FAQJsonLd({
  questions,
}: {
  questions: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
