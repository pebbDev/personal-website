// Private preview navigation. These hashes are not the final 25 .html routes.
export const previewRoutes = {
  home: "#home",
  "meet-me": "#meet-me",
  work: "#work",
} as const;

// Section destinations are distinct from the three preview tabs.
export const sectionRoutes = {
  contact: "#contact",
  mainContent: "#main-content",
} as const;
