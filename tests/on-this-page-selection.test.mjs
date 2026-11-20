import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import ts from "typescript";

// Transpile the standalone pure TS helper without adding a test runner dependency.
const filename = resolve("src/components/ui/OnThisPage/select-active.ts");
const source = readFileSync(filename, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const loaded = { exports: {} };
new Function("module", "exports", compiled.outputText)(loaded, loaded.exports);
const { selectActiveSectionId } = loaded.exports;

const items = (...ids) => ids.map((id) => ({ id, label: id }));
const tops = (positions) => (id) => (Object.hasOwn(positions, id) ? positions[id] : null);

test("OnThisPage selects the last section past 35% viewport line", () => {
  const toc = items("first", "second");
  assert.equal(selectActiveSectionId(toc, tops({ first: -100, second: 352 }), 1000), "first");
  assert.equal(selectActiveSectionId(toc, tops({ first: -100, second: 348 }), 1000), "second");
  assert.equal(selectActiveSectionId(toc, tops({ first: -100, second: 350 }), 1000), "second");
});

test("OnThisPage chooses the last crossed item in display order, not the lowest top", () => {
  const toc = items("first", "second", "third", "fourth");
  assert.equal(selectActiveSectionId(toc, tops({ first: 10, second: 349, third: 330, fourth: 351 }), 1000), "third");
  assert.equal(selectActiveSectionId(toc, tops({ first: 100, second: 100, third: 100, fourth: 100 }), 1000), "fourth");
});

test("OnThisPage falls back to first existing section when none crosses the reading line", () => {
  assert.equal(
    selectActiveSectionId(
      items("missing", "first-real", "second-real"),
      tops({ "first-real": 800, "second-real": 500 }),
      1000
    ),
    "first-real"
  );
  assert.equal(selectActiveSectionId(items("missing", "found"), tops({ found: 349 }), 1000), "found");
});

test("OnThisPage returns null for empty items or missing section targets", () => {
  assert.equal(
    selectActiveSectionId(
      [],
      () => {
        throw new Error("No section should be queried");
      },
      1000
    ),
    null
  );
  assert.equal(
    selectActiveSectionId(items("one", "two"), () => null, 1000),
    null
  );
});

test("OnThisPage supports dynamic 2 to 8 items without fixed ID unions", () => {
  for (let count = 2; count <= 8; count++) {
    const ids = Array.from({ length: count }, (_, index) => `custom-section-${index + 1}`);
    const positions = Object.fromEntries(ids.map((id, index) => [id, index === count - 1 ? 348 : 100]));
    assert.equal(selectActiveSectionId(items(...ids), tops(positions), 1000), ids[count - 1]);
    assert.equal(
      selectActiveSectionId(items(...ids), () => 999, 1000),
      ids[0]
    );
  }
});
