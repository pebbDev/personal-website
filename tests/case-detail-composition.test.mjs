import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = "src/features/work/components/CaseDetail";
const source = (filename) => readFileSync(root + "/" + filename, "utf8");

test("CaseDetail entry composes independently authored visual components", () => {
  for (const name of ["CaseHero.tsx", "CaseMedia.tsx", "CaseArticle.tsx", "CaseSection.tsx", "CaseTOC.tsx"]) {
    assert.equal(existsSync(root + "/" + name), true, name);
  }
  const entry = source("index.tsx");
  for (const component of ["CaseHero", "CaseArticle", "CaseTOC"]) {
    assert.match(entry, new RegExp("<" + component + "\\b"), component);
  }
  assert.match(entry, /CasePlaceholder/);
  assert.doesNotMatch(entry, /<h1|<h2|<h3|<details|<summary|<blockquote|<ol|<dl/);
  assert.doesNotMatch(entry, /use client|dangerouslySetInnerHTML|iframe/);
});

test("CaseArticle preserves five hand-composed sections and native disclosures", () => {
  const article = source("CaseArticle.tsx");
  assert.equal((article.match(/<CaseSection\b/g) || []).length, 5);
  assert.match(article, /<details/);
  assert.match(article, /<summary/);
  assert.match(article, /caseStudy\.designPages\.map/);
  assert.match(article, /CaseMedia/);
  const section = source("CaseSection.tsx");
  assert.match(section, /aria-labelledby/);
  assert.match(section, /ReactNode/);
});

test("CaseHero composes without a Closing section or public route", () => {
  assert.match(source("CaseHero.tsx"), /<h1/);
  assert.match(source("CaseHero.tsx"), /case-detail-browser/);
  assert.equal(existsSync(root + "/CaseClosing.tsx"), false);
  assert.doesNotMatch(source("index.tsx"), /CaseClosing/);
  assert.doesNotMatch(source("index.tsx"), /route-manifest|next\/navigation/);
  assert.equal(existsSync("src/app/case-detail/page.tsx"), false);
});

test("Work owns Intro and Catalog without duplicating cross-branch Closing", () => {
  const work = readFileSync("src/features/work/work.tsx", "utf8");
  assert.doesNotMatch(work, /<Closing|sections\/closing|homeHref/);
  assert.equal(existsSync("src/features/work/sections/closing.tsx"), false);
  assert.doesNotMatch(readFileSync("src/app/globals.css", "utf8"), /\.work-closing\b|\.case-detail-closing\b/);
  assert.match(work, /<Footer/);
});
