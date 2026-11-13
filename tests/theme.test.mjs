import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

test("Tailwind utilities reference source-derived semantic CSS colors", () => {
  const config = readFileSync(new URL("../tailwind.config.ts", import.meta.url), "utf8");
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  for (const [name, token] of [
    ["ink", "--foreground"],
    ["canvas", "--background"],
    ["muted", "--muted"],
    ["outline", "--border"],
  ]) {
    assert.ok(config.includes(`${name}: "var(${token})"`), `${name} must use ${token}`);
    assert.ok(css.includes(token), `missing ${token}`);
  }
  assert.match(css, /color-scheme:\s*light/);
  assert.doesNotMatch(css, /prefers-color-scheme:\s*dark/);
});
