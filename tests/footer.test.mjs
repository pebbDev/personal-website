import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("shared Footer declares two source-observed variants with caller-owned content", () => {
  const footer = read("../src/components/layout/footer.tsx");
  assert.match(footer, /export default function Footer/);
  assert.match(footer, /variant: "full"/);
  assert.match(footer, /variant: "compact"/);
  assert.match(footer, /navigation: readonly FooterLink\[\]/);
  assert.match(footer, /contact: readonly FooterLink\[\]/);
  assert.match(footer, /<footer\b/);
  assert.match(footer, /footer__card/);
  assert.match(footer, /footer__grid/);
  assert.match(footer, /footer__bottom/);
  assert.match(footer, /Quick Links/);
  assert.match(footer, /Get in Touch/);  assert.match(footer, /footer__grid--\$\{columnCount\}/);
  assert.match(footer, /Number\(props\.navigation\.length > 0\)/);
  assert.match(footer, /Number\(props\.contact\.length > 0\)/);
});

test("shared Footer keeps source identity and closing CTA outside the component", () => {
  const footer = read("../src/components/layout/footer.tsx");
  assert.doesNotMatch(footer, /fachri|fachry|memoji\.png|gmail\.com|linkedin\.com\/in\//i);
  assert.doesNotMatch(footer, /className="end"|className="footer-end"/);
  assert.match(footer, /<a href=\{link\.href\}/);
});

test("footer variant styles are scoped and responsive", () => {
  const css = read("../src/app/globals.css");
  for (const selector of [".footer--full", ".footer--compact", ".footer__card", ".footer__grid", ".footer__bottom"]) {
    assert.ok(css.includes(selector), selector);
  }
  assert.match(css, /\.footer__grid\s*\{[^}]*grid-template-columns:\s*1fr auto auto/s);
  assert.match(css, /@media\s*\(max-width:\s*640px\)/);  assert.match(css, /\.footer__grid--1\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);
  assert.match(css, /\.footer__grid--2\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\) auto/s);
});
