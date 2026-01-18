import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { initStoryblok } from "@/app/lib/storyblok";
import { draftMode } from "next/headers";
import { getGlobalSettings } from "@/app/lib/storyblok-client";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import StoryblokProvider from "@/app/components/StoryblokProvider";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/app/components/JsonLd";

const inter = Inter({ subsets: ["latin"] });

/**
 * Viewport configuration
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a8a" },
  ],
};

/**
 * Site-wide metadata
 * Page-specific metadata is set in individual page.tsx files
 */
export const metadata: Metadata = {
  // Base metadata - customize for client
  title: {
    default: "[Company Name] | Investor Relations",
    template: "%s | [Company Name]",
  },
  description: "Official investor relations portal. Access clinical data, SEC filings, and corporate information.",

  // Keywords for SEO
  keywords: [
    "investor relations",
    "clinical trials",
    "SEC filings",
    "corporate governance",
  ],

  // Author and publisher
  authors: [{ name: "[Company Name]" }],
  creator: "[Company Name]",
  publisher: "[Company Name]",

  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons configuration
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#2563eb" },
    ],
  },

  // Web app manifest
  manifest: "/manifest.json",

  // Open Graph defaults (page-specific OG overrides these)
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "[Company Name]",
  },

  // Twitter card defaults
  twitter: {
    card: "summary_large_image",
    creator: "@companyhandle",
  },

  // Verification (add actual values when setting up)
  // verification: {
  //   google: "google-site-verification-code",
  //   yandex: "yandex-verification-code",
  // },

  // App links
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "[Company Name]",
  },

  // Format detection
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  // Category
  category: "business",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize Storyblok
  initStoryblok();

  const { isEnabled } = await draftMode();
  const settings = await getGlobalSettings(isEnabled);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <OrganizationJsonLd
          name="[Company Name]"
          url={siteUrl}
          description="Official investor relations portal"
          contactPoint={{
            type: "ContactPoint",
            email: "ir@example.com",
            contactType: "investor relations",
          }}
        />
        <WebsiteJsonLd
          name="[Company Name]"
          url={siteUrl}
          description="Access clinical data, SEC filings, and corporate information"
        />
      </head>
      <body className={inter.className}>
        <StoryblokProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {settings && <Header settings={settings} />}
          <main id="main-content" className="pt-20">
            {children}
          </main>
          {settings && <Footer settings={settings} />}
        </StoryblokProvider>
      </body>
    </html>
  );
}
