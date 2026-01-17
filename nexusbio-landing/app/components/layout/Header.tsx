import Link from "next/link";
import Image from "next/image";
import { GlobalSettingsStoryblok } from "@/app/types/storyblok";

export default function Header({ settings }: { settings: GlobalSettingsStoryblok }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {settings.logo?.filename ? (
              <Image
                src={settings.logo.filename}
                alt={settings.logo.alt || "NexusBio Logo"}
                width={40}
                height={40}
                className="w-10 h-10"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                N
              </div>
            )}
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              NexusBio
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {settings.navigation?.map((item) => (
              <Link
                key={item._uid}
                href={item.link.cached_url || item.link.url || "#"}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Placeholder */}
          <div className="md:hidden">
            <button className="text-gray-600">
              <span className="sr-only">Open menu</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
