import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Document AI Lab - Salesforce Data Cloud",
  description:
    "A hands-on learning portal for Salesforce Data Cloud Document AI. Recipes, sample documents, API guides, and end-to-end integrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                Document AI Lab &mdash; A learning portal for Salesforce Data Cloud Document AI
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <a
                  href="https://help.salesforce.com/s/articleView?id=data.c360_a_document_ai.htm&type=5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--sf-blue)] transition-colors"
                >
                  Salesforce Docs
                </a>
                <a
                  href="https://trailhead.salesforce.com/content/learn/modules/data-360-process-content"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--sf-blue)] transition-colors"
                >
                  Trailhead
                </a>
                <a
                  href="https://github.com/ananth-anto/sf-datacloud-idp-testbed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--sf-blue)] transition-colors"
                >
                  GitHub Testbed
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
