"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GlobalSettingsStoryblok } from "@/app/types/storyblok";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header({ settings }: { settings: GlobalSettingsStoryblok }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {settings.logo?.filename ? (
              <div className="flex items-center">
                <Image
                  src={settings.logo.filename}
                  alt={settings.logo.alt || "NexusBio Logo"}
                  width={160}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  N
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  NexusBio
                </span>
              </div>
            )}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {settings.navigation?.map((item) => {
              const href = item.link.cached_url ? `/${item.link.cached_url}` : item.link.url || "#";
              const active = isActive(href);
              return (
                <Link
                  key={item._uid}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium transition-colors rounded-md px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    active ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-1 shadow-lg"
        >
          {settings.navigation?.map((item) => {
            const href = item.link.cached_url ? `/${item.link.cached_url}` : item.link.url || "#";
            const active = isActive(href);
            return (
              <Link
                key={item._uid}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block px-3 py-4 text-base font-medium rounded-md focus:outline-none focus-visible:bg-gray-50 ${
                  active ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-center mt-4 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
