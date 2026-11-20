import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(path, "utf8");

test("OnThisPage shares one ordered native-anchor navigation renderer", () => {
  const source = read("src/components/ui/OnThisPage/index.tsx");
  assert.match(source, /<nav\b/);
  assert.match(source, /aria-label="On this page"/);
  assert.match(source, /<ol>/);
  assert.match(source, /<li\b/);
  assert.match(source, /<a\b/);
  assert.match(source, /aria-current=/);
  assert.match(source, /headingElement/);
  assert.doesNotMatch(source, /layoutId|motion\.span|case-detail-toc-marker/);
});

test("OnThisPage Motion scrollspy owns subscriptions without manual scroll listeners", () => {
  const source = read("src/components/ui/OnThisPage/use-scrollspy.ts");
  assert.match(source, /useScroll/);
  assert.match(source, /useMotionValueEvent/);
  assert.match(source, /selectActiveSectionId/);
  assert.doesNotMatch(source, /addEventListener\(\s*["']scroll["']/);
  assert.doesNotMatch(source, /requestAnimationFrame/);
});

test("MeetMeToc delegates rendering and scrollspy while preserving native anchor contract", () => {
  const source = read("src/features/meet-me/components/MeetMeToc/index.tsx");
  assert.match(source, /OnThisPage/);
  assert.match(source, /useOnThisPageScrollspy/);
  assert.match(source, /useReducedMotion/);
  assert.match(source, /preventDefault\(/);
  assert.match(source, /scrollIntoView\(/);
  assert.doesNotMatch(source, /addEventListener\(\s*["']scroll["']/);
  assert.doesNotMatch(source, /requestAnimationFrame/);
});

test("OnThisPage CSS centralizes the static active indicator", () => {
  const source = read("src/app/globals.css");
  assert.match(source, /\.on-this-page a\s*\{/);
  assert.match(source, /\.on-this-page a\[aria-current="location"\]/);
  assert.match(source, /\.on-this-page a:focus-visible/);
  assert.doesNotMatch(source, /layoutId="case-detail-toc-marker"/);
});
