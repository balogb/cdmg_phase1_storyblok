import { storyblokEditable, StoryblokServerComponent } from "@storyblok/react/rsc";
import { FooterSectionStoryblok } from "@/app/types/storyblok";
import { render } from "storyblok-rich-text-react-renderer";

export default function FooterSection({ blok }: { blok: FooterSectionStoryblok }) {
  return (
    <footer
      {...storyblokEditable(blok)}
      className="bg-gray-900 text-gray-300 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Name */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {blok.company_name}
          </h2>
          {blok.contact_email && (
            <a
              href={`mailto:${blok.contact_email}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {blok.contact_email}
            </a>
          )}
        </div>

        {/* Legal Links */}
        {blok.legal_links && blok.legal_links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {blok.legal_links.map((link) => (
              <StoryblokServerComponent blok={link} key={link._uid} />
            ))}
          </div>
        )}

        {/* Compliance Notice */}
        {blok.compliance_notice && (
          <div className="max-w-4xl mx-auto mb-8 text-xs leading-relaxed text-center text-gray-400">
            {render(blok.compliance_notice as Parameters<typeof render>[0])}
          </div>
        )}

        {/* Copyright */}
        <div className="text-center text-sm border-t border-gray-800 pt-8">
          {blok.copyright_text}
        </div>
      </div>
    </footer>
  );
}
