import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { initStoryblok } from "@/app/lib/storyblok";
import { draftMode } from "next/headers";
import { getGlobalSettings } from "@/app/lib/storyblok-client";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusBio Therapeutics",
  description: "Advancing oncology therapeutics through innovative research",
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

  return (
    <html lang="en">
      <body className={inter.className}>
        {settings && <Header settings={settings} />}
        <main className="pt-20">
          {children}
        </main>
        {settings && <Footer settings={settings} />}
      </body>
    </html>
  );
}
