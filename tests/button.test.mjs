import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("Button exposes only the observed CTA variants and sizes", () => {
  const component = read("../src/components/ui/Button/index.tsx");
  const types = read("../src/components/ui/Button/types.ts");
  const variants = read("../src/components/ui/Button/variants.ts");
  assert.match(component, /export function Button/);
  for (const variant of ['"base"', '"primary"', '"dark"', '"line"']) {
    assert.ok(types.includes(variant), `missing variant ${variant}`);
  }
  for (const size of ['"sm"', '"md"', '"lg"']) {
    assert.ok(types.includes(size), `missing size ${size}`);
  }
  assert.match(component, /import type \{ ButtonProps \} from "\.\/types"/);
  assert.match(component, /getButtonClasses\(variant, size, className\)/);
  assert.match(variants, /export function getButtonClasses/);
  assert.doesNotMatch(component + variants, /shadcn|@radix|class-variance-authority|use client|next\/link/i);
});

test("Button uses real anchors for navigation and native buttons for actions", () => {
  const component = read("../src/components/ui/Button/index.tsx");
  const types = read("../src/components/ui/Button/types.ts");
  assert.match(types, /href:\s*string/);
  assert.match(types, /href\?:\s*never/);
  assert.match(types, /disabled\?:\s*never/);
  assert.match(component, /<a\b/);
  assert.match(component, /<button\b/);
  assert.match(component, /type=\{type\}/);
  assert.match(component, /type\s*=\s*"button"/);
  assert.doesNotMatch(component, /onClick=\{\(\)\s*=>\s*location\./);
});

test("Button source styles preserve base, primary, dark, line and size rules", () => {
  const css = read("../src/app/globals.css");
  for (const selector of [
    ".btn {",
    ".btn--primary {",
    ".btn--dark {",
    ".btn--line {",
    ".btn--sm {",
    ".btn--md {",
    ".btn--lg {",
  ]) {
    assert.ok(css.includes(selector), `missing ${selector}`);
  }
  assert.match(css, /\.btn--sm\s*\{[^}]*height:\s*40px/s);
  assert.match(css, /\.btn--md\s*\{[^}]*height:\s*44px/s);
  assert.match(css, /\.btn--lg\s*\{[^}]*height:\s*52px/s);
  assert.match(css, /@media\s*\(max-width:\s*640px\)[\s\S]*\.btn--lg\s*\{[^}]*height:\s*48px/s);
});

test("Button CSS supports focus, hover, disabled and reduced motion", () => {
  const css = read("../src/app/globals.css");
  assert.match(css, /\.btn:hover/);
  assert.match(css, /\.btn:active/);
  assert.match(css, /\.btn:focus-visible/);
  assert.match(css, /\.btn:disabled/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.btn/);
});

test("Button stays free of source identity, CV and feature-specific tab/filter patterns", () => {
  const component = read("../src/components/ui/Button/index.tsx");
  assert.doesNotMatch(component, /fachri|fachry|memoji|gmail\.com|linkedin\.com|\.ctab|\.chip|\.sayhi/i);
  assert.doesNotMatch(component, /<img\b|<Image\b/);
});
