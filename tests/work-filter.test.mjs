import assert from "node:assert/strict";
import test from "node:test";
import { workCategories } from "../src/features/work/constants.ts";
import { parseWorkFilter, selectWorkCategories } from "../src/features/work/catalog/filter.ts";

test("Work hashes resolve exactly to five categories or All", () => {
  const accepted = ["uiux", "branding", "social", "event", "ecommerce"];
  for (const id of accepted) assert.equal(parseWorkFilter(`#${id}`), id);
  for (const hash of ["", "#work", "#unknown", "#WRONG", "#BRANDING", "#", "branding", "#ecommerce/"]) {
    assert.equal(parseWorkFilter(hash), "all", `unexpected hash: ${hash}`);
  }
});

test("All returns five source-ordered categories with 30 placements", () => {
  const selected = selectWorkCategories(workCategories, "all");
  assert.deepEqual(
    selected.map((category) => category.id),
    ["uiux", "branding", "social", "event", "ecommerce"]
  );
  assert.deepEqual(
    selected.map((category) => category.projectIds.length),
    [9, 9, 5, 5, 2]
  );
  assert.equal(
    selected.reduce((sum, category) => sum + category.projectIds.length, 0),
    30
  );
});

test("One category selection retains only the correct ordered project references", () => {
  for (const [id, length] of [
    ["uiux", 9],
    ["branding", 9],
    ["social", 5],
    ["event", 5],
    ["ecommerce", 2],
  ]) {
    const selected = selectWorkCategories(workCategories, id);
    assert.equal(selected.length, 1);
    assert.equal(selected[0].id, id);
    assert.equal(selected[0].projectIds.length, length);
    assert.equal(
      selected[0],
      workCategories.find((category) => category.id === id)
    );
  }
});

test("Filtering is pure and never changes canonical Work category ordering", () => {
  const before = workCategories.map(({ id, projectIds }) => [id, [...projectIds]]);
  const result = selectWorkCategories(workCategories, "branding");
  assert.deepEqual(
    result.map((category) => category.id),
    ["branding"]
  );
  assert.deepEqual(
    workCategories.map(({ id, projectIds }) => [id, [...projectIds]]),
    before
  );
});
