import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { initStoryblok } from "@/app/lib/storyblok";

const inter = Inter({ subsets: ["latin"] });

// Initialize Storyblok
initStoryblok();

export const metadata: Metadata = {
  title: "NexusBio Therapeutics",
  description: "Advancing oncology therapeutics through innovative research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
