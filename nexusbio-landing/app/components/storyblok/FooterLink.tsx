import { storyblokEditable } from "@storyblok/react/rsc";
import { FooterLinkStoryblok } from "@/app/types/storyblok";
import Link from "next/link";

export default function FooterLink({ blok }: { blok: FooterLinkStoryblok }) {
  return (
    <Link
      href={blok.url?.cached_url || "#"}
      {...storyblokEditable(blok)}
      className="text-gray-400 hover:text-white text-sm transition-colors"
    >
      {blok.label}
    </Link>
  );
}
