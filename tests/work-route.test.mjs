import assert from "node:assert/strict";
import test from "node:test";
import { implementedLegacyRoutes, resolveImplementedLegacyPage } from "../src/lib/navigation/legacy-routes.ts";
import { canonicalRoutes, getNavbarHref } from "../src/lib/navigation/config.ts";

test("only implemented Work legacy route resolves and absent case-study routes fail closed", () => {
  assert.deepEqual(implementedLegacyRoutes, [{ sourceFile: "work.html", kind: "work" }]);
  assert.deepEqual(resolveImplementedLegacyPage("work.html"), { sourceFile: "work.html", kind: "work" });
  assert.equal(resolveImplementedLegacyPage("missing.html"), null);
  assert.equal(resolveImplementedLegacyPage("cekat-ai-website.html"), null);
  assert.equal(resolveImplementedLegacyPage("meet-me.html"), null);
});

test("legacy navigation resolves by pathname while keeping root preview hashes unchanged", () => {
  assert.equal(canonicalRoutes.work, "/work.html");
  assert.equal(canonicalRoutes.home, "/");
  assert.equal(getNavbarHref("home", "/"), "#home");
  assert.equal(getNavbarHref("meet-me", "/"), "#meet-me");
  assert.equal(getNavbarHref("work", "/"), "#work");
  assert.equal(getNavbarHref("home", "/work.html"), "/#home");
  assert.equal(getNavbarHref("meet-me", "/work.html"), "/#meet-me");
  assert.equal(getNavbarHref("work", "/work.html"), "/work.html");
});
