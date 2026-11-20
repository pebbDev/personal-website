import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("unrouted CaseDetail preserves semantic disclosures, anchor TOC and responsive styles", () => {
  const article = readFileSync("src/features/work/components/CaseDetail/CaseArticle.tsx", "utf8");
  const section = readFileSync("src/features/work/components/CaseDetail/CaseSection.tsx", "utf8");
  const toc = readFileSync("src/features/work/components/CaseDetail/CaseTOC.tsx", "utf8");
  const css = readFileSync("src/app/globals.css", "utf8");
  assert.match(article, /<details/);
  assert.match(article, /<summary/);
  assert.match(article, /<CaseSection/);
  assert.match(section, /<section/);
  assert.match(section, /aria-labelledby/);
  assert.match(toc, /aria-current/);
  assert.match(toc, /useReducedMotion/);
  assert.match(css, /\.case-detail-reading-grid/);
  assert.match(css, /max-width: 1100px/);
  assert.match(css, /max-width: 900px/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
