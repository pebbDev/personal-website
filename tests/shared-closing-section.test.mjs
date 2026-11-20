import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

test("shared ClosingSection exposes typed feature-owned actions", () => {
  const types = read("src/components/layout/ClosingSection/types.ts");
  assert.match(types, /export type ClosingAction/);
  assert.match(types, /kind:\s*"link"/);
  assert.match(types, /kind:\s*"disabled"/);
  assert.match(types, /href:\s*string/);
  assert.match(types, /icon\?:\s*ReactNode/);
  assert.match(types, /export type ClosingSectionProps/);
  assert.match(types, /heading:\s*string/);
  assert.match(types, /primary:\s*ClosingAction/);
  assert.match(types, /secondary:\s*ClosingAction/);
});

test("shared ClosingSection owns markup, accessible heading, and privacy-neutral CTA", () => {
  const component = read("src/components/layout/ClosingSection/index.tsx");
  assert.match(component, /useId\(/);
  assert.match(component, /aria-labelledby=/);
  assert.match(component, /<h2/);
  assert.match(component, /closing-section-actions/);
  assert.match(component, /variant="line"/);
  assert.match(component, /variant="dark"/);
  assert.match(component, /<Button/);
  assert.doesNotMatch(component, /fachriallkhijaro|linkedin\.com|page\s*===\s*["']work["']/i);
});

test("shared CSS owns preserved Closing layout and progressive reveal", () => {
  const css = read("src/app/globals.css");
  assert.match(css, /\.closing-section\s*\{[\s\S]*?display:\s*flex;/);
  assert.match(css, /\.closing-section-actions\s*\{/);
  assert.match(css, /\.closing-section\[data-reveal="pending"\]/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("Meet Me Closing becomes a thin feature adapter with safe actions", () => {
  const adapter = read("src/features/meet-me/sections/closing.tsx");
  assert.match(adapter, /ClosingSection/);
  assert.match(adapter, /href:\s*"#work"/);
  assert.match(adapter, /label:\s*"See my work"/);
  assert.match(adapter, /kind:\s*"disabled"/);
  assert.match(adapter, /label:\s*"Say Hi 💬"/);
  assert.doesNotMatch(adapter, /linkedin\.com|mailto:/);
});
