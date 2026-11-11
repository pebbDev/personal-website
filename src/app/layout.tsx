import type { Metadata } from "next";
import type { ReactNode } from "react";

import Footer from "@/components/common/footer/footer";
import Navbar from "@/components/common/navbar/navbar";
import NavbarMobile from "@/components/common/navbar/navbar-mobile";

import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Website | Refactor Foundation",
  description: "The modular Next.js foundation for the Personal-Website refactor.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="sr-only rounded bg-white p-3 text-ink focus:not-sr-only">
          Skip to content
        </a>
        <Navbar />
        <NavbarMobile />
        <main id="main-content" className="mx-auto w-full max-w-site px-5 pb-20 pt-12 md:px-7">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
