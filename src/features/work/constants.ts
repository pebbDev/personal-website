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

// Stable dummy IDs for private layout previews; source URLs remain only for traceability.
const dummyCodes = [
  "k7m2",
  "v4q9",
  "r8n3",
  "p6t1",
  "x2d7",
  "b9f4",
  "n5w8",
  "h3j6",
  "t8c2",
  "y4p7",
  "q6z1",
  "m2a9",
  "d7v5",
  "w1r8",
  "f5k3",
  "c9e2",
  "s4u7",
  "g8b1",
  "j2h6",
  "l7t4",
  "a3x9",
  "e6n5",
] as const;

export const workProjects: readonly WorkProject[] = sourceProjectIds.map((sourceId, index) => {
  const code = dummyCodes[index];
  if (!code) throw new Error("Missing dummy project code");
  return {
    id: `concept-${code}`,
    // Source provenance is private and is never used as a displayed project ID.
    sourceHref: `/${sourceId}.html`,
    displayTitle: `Concept ${code.toUpperCase()}`,
    displayMeta: "Portfolio layout preview",
  };
});

export const workCategories: readonly WorkCategory[] = [
  {
    id: "uiux",
    title: "Collection Quartz",
    description: "Selected interface studies shown in a neutral layout preview.",
    projectIds: [
      "concept-k7m2",
      "concept-v4q9",
      "concept-r8n3",
      "concept-p6t1",
      "concept-x2d7",
      "concept-b9f4",
      "concept-n5w8",
      "concept-h3j6",
      "concept-t8c2",
    ],
  },
  {
    id: "branding",
    title: "Collection Ember",
    description: "Selected brand studies shown in a neutral layout preview.",
    projectIds: [
      "concept-y4p7",
      "concept-q6z1",
      "concept-m2a9",
      "concept-d7v5",
      "concept-w1r8",
      "concept-f5k3",
      "concept-c9e2",
      "concept-s4u7",
      "concept-g8b1",
    ],
  },
  {
    id: "social",
    title: "Collection Fern",
    description: "Selected social studies shown in a neutral layout preview.",
    projectIds: ["concept-y4p7", "concept-q6z1", "concept-j2h6", "concept-l7t4", "concept-a3x9"],
  },
  {
    id: "event",
    title: "Collection Azure",
    description: "Selected event studies shown in a neutral layout preview.",
    projectIds: ["concept-y4p7", "concept-q6z1", "concept-j2h6", "concept-w1r8", "concept-l7t4"],
  },
  {
    id: "ecommerce",
    title: "Collection Willow",
    description: "Selected commerce studies shown in a neutral layout preview.",
    projectIds: ["concept-e6n5", "concept-l7t4"],
  },
];

export function requireWorkProject(id: string): WorkProject {
  const project = workProjects.find((candidate) => candidate.id === id);

  if (!project) {
    throw new Error("Unknown Work project: " + id);
  }

  return project;
}
