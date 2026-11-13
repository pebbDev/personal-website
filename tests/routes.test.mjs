import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";

test("capsule navigation switches same-page hash previews instead of using routes", () => {
  const navbar = readFileSync(new URL("../src/components/layout/floating.tsx", import.meta.url), "utf8");
  for (const hash of ["#home", "#meet-me", "#work"]) {
    assert.ok(navbar.includes(`href: "${hash}"`), `missing ${hash}`);
  }
  assert.doesNotMatch(navbar, /from "next\/link"|usePathname|\.html/);
});

test("preview hash state stays in a client boundary that accepts server-rendered Home", () => {
  const path = new URL("../src/features/home/components/preview-switch.tsx", import.meta.url);
  assert.ok(existsSync(path), "missing PreviewSwitch client boundary");
  const view = readFileSync(path, "utf8");
  assert.match(view, /^"use client";/);
  assert.match(view, /import type \{ ReactNode \} from "react"/);
  assert.match(view, /home:\s*ReactNode/);
  assert.match(view, /const activeTab = usePreviewTab\(\)/);
  assert.match(view, /if \(activeTab === "home"\) return home;/);
  assert.match(view, /<PagePlaceholder \{\.\.\.previews\[activeTab\]\} \/>/);
  assert.doesNotMatch(view, /import Home|window\.|addEventListener|<main|<Floating/);
});

test("Meet Me and My Lab retain their existing placeholder titles and descriptions", () => {
  const path = new URL("../src/features/home/components/preview-switch.tsx", import.meta.url);
  assert.ok(existsSync(path), "missing PreviewSwitch placeholder content");
  const view = readFileSync(path, "utf8");
  assert.match(view, /"meet-me":\s*\{\s*title: "Meet Me",/);
  assert.ok(
    view.includes(
      'description: "This is the Meet Me preview. Its original experience will be reconstructed in a later slice."'
    )
  );
  assert.match(view, /work:\s*\{\s*title: "My Lab",/);
  assert.ok(
    view.includes(
      'description: "This is the My Lab preview. Project content and filters will be reconstructed in a later slice."'
    )
  );
  assert.match(view, /from "@\/components\/common\/page-placeholder"/);
  assert.match(view, /from "@\/lib\/preview-tab"/);
});

test("Home remains a server component with its temporary Home placeholder", () => {
  const home = readFileSync(new URL("../src/features/home/home.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(home, /use client|usePreviewTab|PreviewSwitch/);
  assert.match(home, /<PagePlaceholder/);
  assert.match(home, /title="Home"/);
  assert.ok(
    home.includes('description="This is the Home page. The reconstructed experience will be built section by section."')
  );
});

test("homepage route passes server Home into PreviewSwitch without owning preview or layout logic", () => {
  const page = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /import Home from "@\/features\/home\/home"/);
  assert.match(page, /import PreviewSwitch from "@\/features\/home\/components\/preview-switch"/);
  assert.match(page, /return <PreviewSwitch home=\{<Home \/>\} \/>;/);
  assert.doesNotMatch(page, /use client|usePreviewTab|PagePlaceholder|<main|<Floating|<Footer/);
});
