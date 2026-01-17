import { storyblokEditable } from "@storyblok/react/rsc";
import { HeroSectionStoryblok } from "@/app/types/storyblok";
import { render, MARK_LINK } from "storyblok-rich-text-react-renderer";
import Image from "next/image";
import Link from "next/link";

const richtextOptions = {
  markResolvers: {
    [MARK_LINK]: (children: any, props: any) => {
      const { linktype, href, target } = props;
      if (linktype === "email") {
        return <a href={`mailto:${href}`}>{children}</a>;
      }
      return (
        <a
          href={href}
          target={target || "_self"}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          {children}
        </a>
      );
    },
  },
};

export default function HeroSection({ blok }: { blok: HeroSectionStoryblok }) {
  const isVariantB = blok.variant === "variant_b";

  return (
    <section
      {...storyblokEditable(blok)}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      {blok.background_image?.filename && (
        <div className="absolute inset-0 z-0">
          <Image
            src={blok.background_image.filename}
            alt={blok.background_image.alt || ""}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
      )}

      {/* Fallback background if no image */}
      {!blok.background_image?.filename && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900 to-blue-700" />
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className={`${isVariantB ? "text-left max-w-2xl" : "text-center mx-auto"}`}>
          {/* Company Logo */}
          {blok.logo?.filename && (
            <div className={`mb-8 flex ${isVariantB ? "justify-start" : "justify-center"}`}>
              <Image
                src={blok.logo.filename}
                alt={blok.logo.alt || "NexusBio Logo"}
                width={180}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </div>
          )}

          {/* Phase 3 Badge */}
          {blok.show_trial_badge && (
            <div className="inline-flex items-center px-4 py-2 mb-6 bg-blue-600 rounded-full text-sm font-semibold">
              Phase 3 Clinical Trial
            </div>
          )}

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {blok.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            {blok.subheadline}
          </p>

          {/* CTA */}
          <Link
            href={blok.cta_link?.cached_url || "#"}
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg"
          >
            {blok.cta_text}
          </Link>

          {/* Legal Disclaimer */}
          {blok.legal_disclaimer && (
            <div className={`mt-12 text-xs text-gray-300 leading-relaxed ${isVariantB ? "max-w-xl" : "max-w-3xl mx-auto"}`}>
              {render(blok.legal_disclaimer, richtextOptions)}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
