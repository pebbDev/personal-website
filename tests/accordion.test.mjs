import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("Accordion uses native details and summary with feature-owned content", () => {
  const source = read("../src/components/ui/Accordion/index.tsx");
  const types = read("../src/components/ui/Accordion/types.ts");
  assert.match(source, /export default function Accordion/);
  assert.match(source, /import type \{ AccordionProps \} from "\.\/types"/);
  assert.match(types, /title: ReactNode/);
  assert.match(types, /children: ReactNode/);
  assert.match(types, /defaultOpen\?: boolean/);
  assert.match(source, /<details\b/);
  assert.match(source, /<summary\b/);
  assert.match(source, /\{title\}/);
  assert.match(source, /toggle-body/);
  assert.match(source, /open=\{defaultOpen\}/);
  assert.doesNotMatch(source, /@radix|useState|aria-expanded|onClick=|"use client"/);
});

test("Disclosure CSS preserves source marker, open state, focus and reduced motion", () => {
  const css = read("../src/app/globals.css");
  assert.match(css, /\.toggle\s*\{[^}]*margin-top:\s*14px;[^}]*border-top:/s);
  assert.match(css, /\.toggle summary\s*\{[^}]*padding:\s*12px 0/s);
  assert.match(css, /\.toggle summary::before\s*\{[^}]*border-left:\s*6px solid currentColor/s);
  assert.match(css, /\.toggle\[open\] summary::before\s*\{[^}]*transform:\s*rotate\(90deg\)/s);
  assert.match(css, /\.toggle summary:focus-visible/);
  assert.match(css, /\.toggle-body\s*\{[^}]*overflow-wrap:/s);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.toggle summary::before/);
});
