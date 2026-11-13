import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

test("capsule navigation switches same-page hash previews instead of using routes", () => {
  const navbar = readFileSync(new URL("../src/components/common/navbar/navbar.tsx", import.meta.url), "utf8");
  for (const hash of ["#home", "#meet-me", "#work"]) {
    assert.ok(navbar.includes(`href: "${hash}"`), `missing ${hash}`);
  }
  assert.doesNotMatch(navbar, /from "next\/link"|usePathname|\.html/);
});

test("single page preview includes home, meet-me and work descriptions", () => {
  const view = readFileSync(new URL("../src/features/home/home.tsx", import.meta.url), "utf8");
  assert.match(view, /Home/);
  assert.match(view, /Meet Me/);
  assert.match(view, /My Lab/);
  assert.match(view, /usePreviewTab/);
});
