import { GlobalSettingsStoryblok } from "@/app/types/storyblok";
import { render } from "storyblok-rich-text-react-renderer";

export default function Footer({ settings }: { settings: GlobalSettingsStoryblok }) {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* About Section */}
          <div className="max-w-md">
            <div className="text-lg font-bold text-gray-900 mb-4">NexusBio Therapeutics</div>
            <div className="text-sm text-gray-600 leading-relaxed mb-6">
              {settings.footer_text ? render(settings.footer_text) : (
                "Advancing the next generation of precision oncology therapeutics through innovative research and clinical excellence."
              )}
            </div>
            {settings.contact_email && (
              <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
              </div>
            )}
          </div>

          {/* Compliance & Copyright */}
          <div className="md:text-right flex flex-col justify-between">
            <div className="text-xs text-gray-500 max-w-md md:ml-auto leading-relaxed">
              NexusBio is a clinical-stage biopharmaceutical company. Investigational products have not been approved for efficacy or safety by regulatory authorities.
            </div>
            <div className="mt-8 text-sm text-gray-400">
              {settings.copyright || `© ${new Date().getFullYear()} NexusBio Therapeutics, Inc. All rights reserved.`}
            </div>
          </div>
        </div>

        {/* Legal Links Placeholder */}
        <div className="pt-8 border-t border-gray-200 flex flex-wrap justify-center md:justify-start gap-8">
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider font-semibold">Privacy Policy</a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider font-semibold">Terms of Service</a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider font-semibold">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}
