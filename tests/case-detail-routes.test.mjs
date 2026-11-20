import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

test("only the approved Work URL is routed; CaseDetail remains a manual component", () => {
  assert.equal(existsSync("src/app/work.html/page.tsx"), true);
  assert.equal(existsSync("src/app/[slug]/page.tsx"), false);
  assert.equal(existsSync("src/app/case-detail/page.tsx"), false);
  assert.equal(existsSync("src/app/cekat-ai-website.html/page.tsx"), false);
  assert.equal(existsSync("src/features/work/components/CaseDetail/route-manifest.json"), false);
});

test("Next config does not rewrite CaseDetail to an internal URL", () => {
  const config = readFileSync("next.config.mjs", "utf8");
  assert.doesNotMatch(config, /rewrites|route-manifest|case-detail/i);
});
