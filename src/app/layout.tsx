import type { Metadata } from "next";
import type { ReactNode } from "react";
import Floating from "@/components/layout/floating";
import ThemeProvider from "@/components/provider/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Website | Feature Preview",
  description: "A private refactor preview with source-faithful navigation and temporary text-only pages.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="personal-website-theme"
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Floating />
          <main id="main-content" className="site-main">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
