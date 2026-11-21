import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import ThemeProvider from "@/components/provider/theme-provider";
import { NavLink, sectionRoutes } from "@/lib/navigation";
import "./globals.css";

const siteUrl = new URL("https://febriyadiii.vercel.app");
const title = "Febriyadi | Personal Website";
const description = "A space for ideas and work.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    type: "website",
    siteName: "Febriyadi",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image.png"],
  },
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
