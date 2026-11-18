import type { WorkCategory, WorkProject } from "./types";

const sourceProjectIds = [
  "cekat-ai-website",
  "movastocks",
  "ocistok-mobile-apps",
  "poci",
  "maku",
  "realfood-mobile-apps",
  "nexta-dashboard",
  "k-circle",
  "jaro",
  "cekat-innov-2025",
  "creative-designer-cekat-ai",
  "furrr-fun",
  "realfood-kiddos",
  "ocistok-graphic",
  "kaporak",
  "mr-roastman",
  "de-jamu",
  "santuy-coffee",
  "grid-network",
  "subaru-indonesia",
  "ergotron",
  "realfood-marketplace",
] as const;

export const workProjects: readonly WorkProject[] = sourceProjectIds.map((id, index) => ({
  id,
  sourceHref: `/${id}.html`,
  displayTitle: `Project study ${String(index + 1).padStart(2, "0")}`,
  displayMeta: "Portfolio layout preview",
}));

export const workCategories: readonly WorkCategory[] = [
  {
    id: "uiux",
    title: "UI/UX Design",
    description: "Selected interface studies shown in a neutral layout preview.",
    projectIds: [
      "cekat-ai-website",
      "movastocks",
      "ocistok-mobile-apps",
      "poci",
      "maku",
      "realfood-mobile-apps",
      "nexta-dashboard",
      "k-circle",
      "jaro",
    ],
  },
  {
    id: "branding",
    title: "Branding",
    description: "Selected brand studies shown in a neutral layout preview.",
    projectIds: [
      "cekat-innov-2025",
      "creative-designer-cekat-ai",
      "furrr-fun",
      "realfood-kiddos",
      "ocistok-graphic",
      "kaporak",
      "mr-roastman",
      "de-jamu",
      "santuy-coffee",
    ],
  },
  {
    id: "social",
    title: "Social Media",
    description: "Selected social studies shown in a neutral layout preview.",
    projectIds: ["cekat-innov-2025", "creative-designer-cekat-ai", "grid-network", "subaru-indonesia", "ergotron"],
  },
  {
    id: "event",
    title: "Event",
    description: "Selected event studies shown in a neutral layout preview.",
    projectIds: [
      "cekat-innov-2025",
      "creative-designer-cekat-ai",
      "grid-network",
      "ocistok-graphic",
      "subaru-indonesia",
    ],
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description: "Selected commerce studies shown in a neutral layout preview.",
    projectIds: ["realfood-marketplace", "subaru-indonesia"],
  },
];

export function requireWorkProject(id: string): WorkProject {
  const project = workProjects.find((candidate) => candidate.id === id);

  if (!project) {
    throw new Error("Unknown Work project: " + id);
  }

  return project;
}
