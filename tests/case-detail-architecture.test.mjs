import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("CaseDetail is a manually authored component without a published route or registry", () => {
  assert.equal(existsSync("src/features/work/components/CaseDetail/index.tsx"), true);
  assert.equal(existsSync("src/features/work/components/CaseDetail/route-manifest.json"), false);
  assert.equal(existsSync("src/app/case-detail/page.tsx"), false);
  assert.equal(existsSync("src/app/cekat-ai-website.html/page.tsx"), false);
  assert.equal(existsSync("src/app/work.html/page.tsx"), true);
  assert.equal(existsSync("src/app/[slug]/page.tsx"), false);
  const nextConfig = readFileSync("next.config.mjs", "utf8");
  assert.doesNotMatch(nextConfig, /case-detail|rewrites|route-manifest/);
});

test("CaseDetail and ProjectCard styles live in the global stylesheet", () => {
  const globalCss = readFileSync("src/app/globals.css", "utf8");
  assert.match(globalCss, /\.case-detail-reading-grid/);
  assert.doesNotMatch(globalCss, /\.work-project-card-link/);
  assert.equal(existsSync("src/features/work/components/CaseDetail/styles.css"), false);
  assert.equal(existsSync("src/features/work/components/ProjectCard/styles.css"), false);
  assert.doesNotMatch(readFileSync("src/features/work/components/CaseDetail/index.tsx", "utf8"), /\.\/styles\.css/);
  assert.doesNotMatch(readFileSync("src/features/work/components/ProjectCard/index.tsx", "utf8"), /\.\/styles\.css/);
});

test("CaseDetail scroll spy delegates lifecycle to Motion without handwritten listeners", () => {
  const toc = readFileSync("src/features/work/components/CaseDetail/CaseTOC.tsx", "utf8");
  assert.match(toc, /from "motion\/react"/);
  assert.match(toc, /useScroll/);
  assert.match(toc, /useMotionValueEvent/);
  assert.doesNotMatch(toc, /useEffect|addEventListener|requestAnimationFrame|cancelAnimationFrame/);
  assert.match(toc, /aria-current/);
});

test("Catalog project cards are intentionally inert until detail routing is approved", () => {
  const card = readFileSync("src/features/work/components/ProjectCard/index.tsx", "utf8");
  assert.doesNotMatch(card, /getImplementedCaseHref|<a[\s>]/);
  assert.match(card, /Case study preview/);
});
