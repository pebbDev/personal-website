import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const navbar = readFileSync(
  new URL("../src/components/common/navbar/navbar.tsx", import.meta.url),
  "utf8",
);
const css = readFileSync(
  new URL("../src/components/common/navbar/navbar.css", import.meta.url),
  "utf8",
);

test("navbar renders source navigation labels and uses Lucide icons, without original media", () => {
  for (const label of ["Come In", "Meet Me", "My Lab", "Say Hello"])
    assert.ok(navbar.includes(label), label);
  assert.match(navbar, /from ["']lucide-react["']/);
  assert.match(navbar, /aria-current/);
  assert.doesNotMatch(navbar, /<img|<Image|memoji\.png|character\.png/i);
});

test("nav follows source desktop and tablet/mobile breakpoint, scroll compact and reduced motion", () => {
  assert.match(css, /@media\s*\(max-width:\s*900px\)/);
  assert.match(css, /bottom:\s*calc\(14px\s*\+\s*env\(safe-area-inset-bottom/);
  assert.match(css, /\.topnav\.compact/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
