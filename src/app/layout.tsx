import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/common/navbar/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Website | Feature Preview",
  description:
    "A private refactor preview with source-faithful navigation and temporary text-only pages.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="site-main">
          {children}
        </main>
      </body>
    </html>
  );
}
