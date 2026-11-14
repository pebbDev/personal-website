import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";

test("capsule navigation switches same-page hash previews instead of using routes", () => {
  const navbar = readFileSync(new URL("../src/components/layout/Navbar/index.tsx", import.meta.url), "utf8");
  const links = readFileSync(new URL("../src/components/layout/Navbar/constants.ts", import.meta.url), "utf8");
  const config = readFileSync(new URL("../src/lib/navigation/config.ts", import.meta.url), "utf8");
  const hook = readFileSync(new URL("../src/lib/navigation/preview-tab.ts", import.meta.url), "utf8");
  for (const hash of ["#home", "#meet-me", "#work"]) {
    assert.ok(config.includes('"' + hash + '"'), "missing " + hash);
  }
  assert.match(links, /previewRoutes/);
  assert.match(hook, /hashchange/);
  assert.match(hook, /useSyncExternalStore/);
  assert.equal(existsSync(new URL("../src/lib/preview-tab.ts", import.meta.url)), false);
  assert.doesNotMatch(navbar, /from "next\/link"|usePathname|\.html/);
});

test("preview hash state stays in a small layout client boundary", () => {
  const path = new URL("../src/components/layout/preview-switch.tsx", import.meta.url);
  assert.ok(existsSync(path), "missing PreviewSwitch client boundary");
  const view = readFileSync(path, "utf8");
  assert.match(view, /^"use client";/);
  assert.match(view, /import type \{ ReactNode \} from "react"/);
  assert.match(view, /home:\s*ReactNode/);
  assert.match(view, /const activeTab = usePreviewTab\(\)/);
  assert.match(view, /from "@\/lib\/navigation"/);
  assert.match(view, /if \(activeTab === "home"\) return home;/);
  assert.match(view, /if \(activeTab === "meet-me"\) return <MeetMe \/>;/);
  assert.match(view, /return <Work \/>;/);
  assert.doesNotMatch(view, /PagePlaceholder|page-preview-frame|title:|description:|window\.|addEventListener|<main/);
});

test("Meet Me and My Lab own typed placeholder content like Home", () => {
  for (const [folder, component, title, description] of [
    [
      "meet-me",
      "MeetMe",
      "Meet Me",
      "This is the Meet Me preview. Its original experience will be reconstructed in a later slice.",
    ],
    [
      "work",
      "Work",
      "My Lab",
      "This is the My Lab preview. Project content and filters will be reconstructed in a later slice.",
    ],
  ]) {
    const read = (file) => readFileSync(new URL("../src/features/" + folder + "/" + file, import.meta.url), "utf8");
    const page = read(folder + ".tsx");
    const data = read("constants.ts");
    const types = read("types.ts");
    assert.match(page, new RegExp("export default function " + component + "\\("));
    assert.match(page, /import \{ previewData \} from "\.\/constants"/);
    assert.match(page, /<div className="page-preview-frame">\s*<PagePlaceholder \{\.\.\.previewData\} \/>\s*<\/div>/);
    assert.ok(data.includes('title: "' + title + '"'));
    assert.ok(data.includes('description: "' + description + '"'));
    assert.match(data, /export const previewData: PagePreview/);
    assert.match(types, /export type PagePreview/);
    assert.doesNotMatch(page, /use client|usePreviewTab|window\.|<main|<nav/);
  }
});

test("Home remains a server component composing the Home feature", () => {
  const home = readFileSync(new URL("../src/features/home/home.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(home, /use client|usePreviewTab|PreviewSwitch/);
  assert.match(home, /<Hero\s*\/>/);
  assert.match(home, /<Contact\s*\/>/);

  assert.doesNotMatch(home, /PagePlaceholder/);
});

test("homepage route passes server Home into PreviewSwitch without owning preview or layout logic", () => {
  const page = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /import Home from "@\/features\/home\/home"/);
  assert.match(page, /import PreviewSwitch from "@\/components\/layout\/preview-switch"/);
  assert.match(page, /return <PreviewSwitch home=\{<Home \/>\} \/>;/);
  assert.doesNotMatch(page, /use client|usePreviewTab|PagePlaceholder|<main|<Floating|<Footer/);
});
