import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";

const navbar = readFileSync(new URL("../src/components/common/navbar/navbar.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("navbar preserves source labels with Lucide icons, without third-party images", () => {
  for (const label of ["Come In", "Meet Me", "My Lab"]) assert.ok(navbar.includes(label), label);
  assert.match(navbar, /from ["']lucide-react["']/);
  assert.match(navbar, /aria-current/);
  assert.doesNotMatch(navbar, /<img|<Image|memoji\.png|character\.png/i);
});

test("Navbar delegates the Sun/Moon control to independent ThemeToggle", () => {
  const toggle = readFileSync(
    new URL("../src/components/common/theme-toggle/theme-toggle.tsx", import.meta.url),
    "utf8"
  );
  assert.match(navbar, /<ThemeToggle\s*\/>/);
  assert.match(toggle, /\bSun\b/);
  assert.match(toggle, /\bMoon\b/);
  assert.match(toggle, /<button/);
  assert.match(toggle, /Switch to dark mode/);
  assert.match(toggle, /Switch to light mode/);
  assert.doesNotMatch(navbar, /Say Hello|\bHand\b|localStorage|themechange/);
});

test("nav styles remain global, source-responsive and reduced-motion aware", () => {
  assert.equal(existsSync(new URL("../src/components/common/navbar/navbar.css", import.meta.url)), false);
  assert.doesNotMatch(navbar, /navbar\.css/);
  assert.match(css, /@media\s*\(max-width:\s*900px\)/);
  assert.match(css, /bottom:\s*calc\(14px\s*\+\s*env\(safe-area-inset-bottom/);
  assert.match(css, /\.topnav\.compact/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("filled theme button gains hover shadow and subtle press feedback without recoloring", () => {
  assert.match(css, /\.theme-toggle\s*\{[^}]*background:\s*var\(--nav-toggle-bg\)/s);
  assert.match(css, /\.theme-toggle:hover:not\(:active\)\s*\{[^}]*box-shadow:/s);
  const shadowFor = (selector) => {
    const selectorStart = css.indexOf(`  ${selector} {`);
    assert.notEqual(selectorStart, -1, `missing ${selector} rule`);
    const block = css.slice(selectorStart).match(/\{([^}]*)\}/)?.[1] ?? "";
    return block
      .match(/box-shadow:\s*([^;]+);/)?.[1]
      .replace(/\s+/g, " ")
      .trim();
  };
  assert.equal(shadowFor(".theme-toggle:hover:not(:active)"), shadowFor(".brand:hover"));
  assert.match(css, /\.theme-toggle:active\s*\{[^}]*transform:\s*scale\(0\.96\)/s);
  assert.doesNotMatch(css, /\.theme-toggle:hover:not\(:active\)\s*\{[^}]*background:/s);
  assert.match(
    css,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.theme-toggle:active\s*\{\s*transform:\s*none;/
  );
});
