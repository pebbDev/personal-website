import assert from "node:assert/strict";
import test from "node:test";
import { requireWorkProject, workCategories, workProjects } from "../src/features/work/constants.ts";

const expectedProjectIds = [
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
    projectIds: ["cekat-innov-2025", "creative-designer-cekat-ai", "grid-network", "subaru-indonesia", "ergotron"],
  },
  {
    id: "event",
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
    projectIds: ["realfood-marketplace", "subaru-indonesia"],
  },
];

test("catalog records are unique and follow first source appearance", () => {
  assert.deepEqual(
    workProjects.map(({ id }) => id),
    expectedProjectIds
  );
  assert.equal(new Set(workProjects.map(({ id }) => id)).size, 22);
  assert.equal(new Set(workProjects.map(({ sourceHref }) => sourceHref)).size, 22);
  workProjects.forEach(({ id, sourceHref }) => assert.equal(sourceHref, `/${id}.html`));
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
  for (const id of ["cekat-innov-2025", "creative-designer-cekat-ai", "subaru-indonesia"]) {
    assert.equal(workCategories.filter(({ projectIds }) => projectIds.includes(id)).length, 3);
  }
});

test("project labels are generic and contain no cover references", () => {
  workProjects.forEach((project, index) => {
    const number = String(index + 1).padStart(2, "0");
    assert.equal(project.displayTitle, `Project study ${number}`);
    assert.equal(project.displayMeta, "Portfolio layout preview");
    assert.equal(Object.hasOwn(project, "approvedCover"), false);
  });
});

test("missing canonical project lookups throw an explanatory error", () => {
  assert.throws(() => requireWorkProject("missing-project"), /Unknown Work project/);
});
