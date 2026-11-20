import assert from "node:assert/strict";
import test from "node:test";
import { requireWorkProject, workCategories, workProjects } from "../src/features/work/constants.ts";

const expectedProjectIds = [
  "concept-k7m2",
  "concept-v4q9",
  "concept-r8n3",
  "concept-p6t1",
  "concept-x2d7",
  "concept-b9f4",
  "concept-n5w8",
  "concept-h3j6",
  "concept-t8c2",
  "concept-y4p7",
  "concept-q6z1",
  "concept-m2a9",
  "concept-d7v5",
  "concept-w1r8",
  "concept-f5k3",
  "concept-c9e2",
  "concept-s4u7",
  "concept-g8b1",
  "concept-j2h6",
  "concept-l7t4",
  "concept-a3x9",
  "concept-e6n5",
];

const expectedSourceIds = [
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
];

const expectedCategories = [
  {
    id: "uiux",
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
    projectIds: ["concept-y4p7", "concept-q6z1", "concept-j2h6", "concept-l7t4", "concept-a3x9"],
  },
  {
    id: "event",
    projectIds: ["concept-y4p7", "concept-q6z1", "concept-j2h6", "concept-w1r8", "concept-l7t4"],
  },
  {
    id: "ecommerce",
    projectIds: ["concept-e6n5", "concept-l7t4"],
  },
];

test("catalog records are unique and follow first source appearance", () => {
  assert.deepEqual(
    workProjects.map(({ id }) => id),
    expectedProjectIds
  );
  assert.equal(new Set(workProjects.map(({ id }) => id)).size, 22);
  assert.equal(new Set(workProjects.map(({ sourceHref }) => sourceHref)).size, 22);
  workProjects.forEach(({ sourceHref }, i) => assert.equal(sourceHref, `/${expectedSourceIds[i]}.html`));
});

test("categories preserve source order and all 30 unique-in-category placements", () => {
  assert.deepEqual(
    workCategories.map(({ id }) => id),
    ["uiux", "branding", "social", "event", "ecommerce"]
  );
  assert.deepEqual(
    workCategories.map(({ id, projectIds }) => ({ id, projectIds })),
    expectedCategories
  );
  assert.deepEqual(
    workCategories.map(({ projectIds }) => projectIds.length),
    [9, 9, 5, 5, 2]
  );
  assert.equal(
    workCategories.reduce((total, { projectIds }) => total + projectIds.length, 0),
    30
  );

  for (const { projectIds } of workCategories) {
    assert.equal(new Set(projectIds).size, projectIds.length);
    for (const id of projectIds) assert.equal(requireWorkProject(id).id, id);
  }
});

test("approved repeat projects appear in exactly three categories", () => {
  for (const id of ["concept-y4p7", "concept-q6z1", "concept-l7t4"]) {
    assert.equal(workCategories.filter(({ projectIds }) => projectIds.includes(id)).length, 3);
  }
});

const expectedLabels = [
  "Concept K7M2",
  "Concept V4Q9",
  "Concept R8N3",
  "Concept P6T1",
  "Concept X2D7",
  "Concept B9F4",
  "Concept N5W8",
  "Concept H3J6",
  "Concept T8C2",
  "Concept Y4P7",
  "Concept Q6Z1",
  "Concept M2A9",
  "Concept D7V5",
  "Concept W1R8",
  "Concept F5K3",
  "Concept C9E2",
  "Concept S4U7",
  "Concept G8B1",
  "Concept J2H6",
  "Concept L7T4",
  "Concept A3X9",
  "Concept E6N5",
];

test("project labels are generic and contain no cover references", () => {
  workProjects.forEach((project, index) => {
    assert.equal(project.displayTitle, expectedLabels[index]);
    assert.equal(project.displayMeta, "Portfolio layout preview");
    assert.equal(Object.hasOwn(project, "approvedCover"), false);
  });
});

test("missing canonical project lookups throw an explanatory error", () => {
  assert.throws(() => requireWorkProject("missing-project"), /Unknown Work project/);
});
