"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Recipes",
    href: "/recipes",
    children: [
      { label: "Basic Salesforce Setup", href: "/recipes/basic-setup" },
      { label: "API with Postman", href: "/recipes/api-postman" },
      { label: "End-to-End Integration", href: "/recipes/end-to-end" },
    ],
  },
  { label: "Try It", href: "/python-app" },
  { label: "Sample Documents", href: "/samples" },
  { label: "Resources", href: "/resources" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);

  return (
    <nav className="bg-[var(--sf-navy)] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[var(--sf-navy)]" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
                <path d="M8 14h8v1.5H8zm0 3h6v1.5H8z"/>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">Document AI Lab</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setRecipesOpen(true)}
                  onMouseLeave={() => setRecipesOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname.startsWith(item.href)
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                    <svg className="inline-block w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  {recipesOpen && (
                    <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-sm transition-colors ${
                            pathname === child.href
                              ? "bg-[var(--sf-cloud)] text-[var(--sf-blue)] font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-2">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href ? "bg-white/20" : "text-white/80 hover:bg-white/10"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`block pl-8 pr-3 py-1.5 rounded-md text-sm ${
                      pathname === child.href ? "text-white font-medium" : "text-white/60 hover:text-white/80"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
