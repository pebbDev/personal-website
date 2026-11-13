import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const config = readFileSync(new URL("../tailwind.config.ts", import.meta.url), "utf8");

test("light stays the source default and Tailwind references semantic tokens", () => {
  assert.match(css, /:root\s*\{[^}]*color-scheme:\s*light/s);
  for (const [name, token] of [
    ["ink", "--foreground"],
    ["canvas", "--background"],
    ["muted", "--muted"],
    ["outline", "--border"],
  ]) {
    assert.ok(config.includes(`${name}: "var(${token})"`), `${name} must use ${token}`);
  }
  assert.match(css, /--background:\s*#ffffff/);
});

test("class-based dark variant overrides global and navigation surfaces", () => {
  assert.match(css, /\.dark\s*\{/);
  assert.doesNotMatch(css, /\[data-theme="dark"\]/);
  assert.match(css, /--background:\s*#101114/);
  for (const token of ["--foreground", "--muted", "--border", "--nav-shell", "--nav-toggle-bg", "--nav-active-bg"]) {
    assert.ok(css.includes(token), `missing ${token}`);
  }
  assert.match(css, /color-scheme:\s*dark/);
  assert.doesNotMatch(css, /@media\s*\(prefers-color-scheme:\s*dark\)/);
});
