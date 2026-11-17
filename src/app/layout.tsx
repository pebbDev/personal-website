import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import ThemeProvider from "@/components/provider/theme-provider";
import { NavLink, sectionRoutes } from "@/lib/navigation";
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
          <NavLink href={sectionRoutes.mainContent} className="skip-link">
            Skip to content
          </NavLink>
          <Navbar />
          <main id="main-content" className="site-main" tabIndex={-1}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
