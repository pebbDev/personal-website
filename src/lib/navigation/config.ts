import type { PreviewTab } from "./types";

// Private preview navigation. These hashes are not the final 25 .html routes.
export const previewRoutes = {
  home: "#home",
  "meet-me": "#meet-me",
  work: "#work",
} as const;

export const canonicalRoutes = {
  home: "/",
  work: "/work.html",
  meetMePreview: "/#meet-me",
} as const;

// Development-only CaseDetail destination; not a published case-study route.
export const localPreviewRoutes = {
  caseStudy01: `${canonicalRoutes.work}?preview=case-study-01`,
} as const;

export function getNavbarHref(id: PreviewTab, pathname: string): string {
  if (pathname === canonicalRoutes.home) return previewRoutes[id];
  if (id === "home") return "/#home";
  if (id === "meet-me") return canonicalRoutes.meetMePreview;
  return canonicalRoutes.work;
}
// Section destinations are distinct from the three preview tabs.
export const sectionRoutes = {
  contact: "#contact",
  mainContent: "#main-content",
} as const;
