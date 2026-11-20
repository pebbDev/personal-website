import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { canonicalRoutes, getNavbarHref } from "../src/lib/navigation/config.ts";

test("Work keeps a literal .html route and does not depend on catch-all routing", () => {
  assert.equal(existsSync("src/app/work.html/page.tsx"), true);
  assert.equal(existsSync("src/app/[slug]/page.tsx"), false);
});

test("Work and detail navbar destinations remain correct outside the root preview", () => {
  assert.equal(canonicalRoutes.work, "/work.html");
  assert.equal(canonicalRoutes.home, "/");
  assert.equal(getNavbarHref("home", "/"), "#home");
  assert.equal(getNavbarHref("meet-me", "/"), "#meet-me");
  assert.equal(getNavbarHref("work", "/"), "#work");
  assert.equal(getNavbarHref("home", "/work.html"), "/#home");
  assert.equal(getNavbarHref("meet-me", "/work.html"), "/#meet-me");
  assert.equal(getNavbarHref("work", "/work.html"), "/work.html");
  assert.equal(getNavbarHref("home", "/cekat-ai-website.html"), "/#home");
  assert.equal(getNavbarHref("work", "/cekat-ai-website.html"), "/work.html");
  assert.equal(getNavbarHref("work", "/case-detail"), "/work.html");
});

test("Navbar delegates route-aware link behavior to NavLink", () => {
  const navbar = readFileSync("src/components/layout/Navbar/index.tsx", "utf8");
  const navLink = readFileSync("src/lib/navigation/NavLink.tsx", "utf8");
  const navigationIndex = readFileSync("src/lib/navigation/index.ts", "utf8");
  assert.doesNotMatch(navbar, /usePathname|useNavbarNavigation|next\/navigation|window\.location/);
  assert.match(navbar, /navTab=\{link\.id\}/);
  assert.match(navbar, /homeBrand/);
  assert.match(navLink, /usePathname/);
  assert.match(navLink, /usePreviewTab/);
  assert.match(navLink, /getNavbarHref/);
  assert.doesNotMatch(navigationIndex, /useNavbarNavigation/);
  assert.equal(existsSync("src/lib/navigation/use-navbar-navigation.ts"), false);
});
