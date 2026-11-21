// Private preview navigation. These hashes are not the final 25 .html routes.
export const previewRoutes = {
  home: "#home",
  "meet-me": "#meet-me",
  work: "#work",
} as const;

// PER-18: private development preview and literal Work route.
export const localPreviewRoutes = {
  caseStudy01: "/work.html?preview=case-study-01",
} as const;

export function resolveNavbarHref(tab: keyof typeof previewRoutes, onWorkPage: boolean): string {
  if (!onWorkPage) return previewRoutes[tab];
  if (tab === "home") return "/";
  if (tab === "work") return "/work.html";
  return "/#meet-me";
}

// Section destinations are distinct from the three preview tabs.
export const sectionRoutes = {
  contact: "#contact",
  mainContent: "#main-content",
} as const;
