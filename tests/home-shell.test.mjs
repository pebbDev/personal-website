import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const sections = [
  ["hero", "Hero", "hero"],
  ["about", "About", "about"],
  ["journey", "Journey", "journey"],
  ["things", "Things", "things"],
  ["gallery", "Gallery", "gallery"],
  ["testimonials", "Testimonials", "words"],
  ["clients", "Clients", "clients"],
  ["contact", "Contact", "contact"],
];

test("Home provides the global #home navigation target above the hero", () => {
  const home = read("src/features/home/home.tsx");
  const topLevel = home.match(/return\s*\(\s*<div\b([^>]*)>\s*<Hero\s*\/>/);
  assert.ok(topLevel, "Home must start above the hero without adding another main");
  assert.match(topLevel[1], /\bid="home"/, "global #home links need a native scroll target at the top of Home");
});

test("Home composes exactly eight source-mapped sections in source order", () => {
  const home = read("src/features/home/home.tsx");
  assert.deepEqual(
    [...home.matchAll(/import (\w+) from "\.\/sections\/([\w-]+)"/g)].map(([, name, file]) => [file, name]),
    sections.map(([file, name]) => [file, name])
  );
  assert.deepEqual(
    [...home.matchAll(/<(Hero|About|Journey|Things|Gallery|Testimonials|Clients|Contact)(?:\s+[^>]*)?\s*\/>/g)].map(
      ([, name]) => name
    ),
    sections.map(([, name]) => name)
  );
  assert.doesNotMatch(home, /use client|usePreviewTab|PagePlaceholder|<main\b|<nav\b|<Floating\b/);
});

for (const [file, name, id] of sections) {
  test(`${name} provides a static, labelled semantic section at #${id}`, () => {
    const path = `src/features/home/sections/${file}.tsx`;
    assert.ok(existsSync(new URL(path, root)), `missing ${path}`);
    const section = read(path);
    assert.match(section, new RegExp(`export default function ${name}\\(`));
    assert.equal([...section.matchAll(/<section\b/g)].length, 1);
    assert.match(section, new RegExp(`<section\\b[^>]*id="${id}"`));
    assert.match(section, new RegExp(`aria-labelledby="${id}-heading"`));
    assert.match(section, new RegExp(`<h${id === "hero" ? "1" : "2"}\\b[^>]*id="${id}-heading"[^>]*>[^<]+<`));
    assert.match(section, /className="home-wrap(?:\s[^"<>]*)?"/);
    assert.match(section, /<p\b[^>]*>\s*[^<]+\s*<\/p>/);
    assert.doesNotMatch(section, /use client|useEffect|useState|useRef|onClick|role="tab|<main\b|<nav\b|<footer\b/);
  });
}

test("full-width Home leaves the original geometry on non-home previews only", () => {
  const css = read("src/app/globals.css");
  const main = css.match(/\.site-main\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(main, /min-height:\s*100vh/);
  assert.doesNotMatch(main, /max-width|padding|margin/);
  assert.match(
    css,
    /\.page-preview-frame\s*\{[^}]*max-width:\s*1120px;[^}]*margin:\s*0 auto;[^}]*padding:\s*160px 24px 100px;/s
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*900px\)\s*\{[^]*?\.page-preview-frame\s*\{\s*padding:\s*80px 16px calc\(140px \+ env\(safe-area-inset-bottom, 0px\)\);/
  );
  const preview = read("src/components/layout/preview-switch.tsx");
  assert.match(preview, /if \(activeTab === "home"\) return home;/);
  for (const name of ["meet-me", "work"]) {
    const page = read("src/features/" + name + "/" + name + ".tsx");
    assert.match(page, /<div className="page-preview-frame">\s*<PagePlaceholder \{\.\.\.previewData\} \/>\s*<\/div>/);
  }
});

test("Home shell uses scoped, fluid geometry and source responsive gutters", () => {
  const css = read("src/app/globals.css");
  for (const [, , id] of sections) assert.ok(css.includes(`.home-${id}`), `missing .home-${id}`);
  assert.match(
    css,
    /\.home-wrap\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*1120px;[^}]*margin:\s*0 auto;[^}]*padding:\s*0 24px;/s
  );
  assert.match(css, /\.home-section\s*\{[^}]*padding:\s*120px 0;/s);
  assert.match(css, /\.home-hero\s*\{[^}]*min-height:\s*660px;/s);
  assert.match(css, /\.home-clients\s*\{[^}]*width:\s*100%;/s);
  assert.match(css, /@media\s*\(max-width:\s*640px\)[^]*?\.home-wrap\s*\{\s*padding:\s*0 16px;/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)[^]*?\.home-hero\s*\{\s*min-height:\s*600px;/);
  assert.match(css, /@media\s*\(max-width:\s*1020px\)[^]*?\.home-about/);
  assert.match(css, /@media\s*\(max-width:\s*900px\)[^]*?\.home\s*\{[^}]*safe-area-inset-bottom/);
  // Do not disguise overflowing content by clipping the entire Home or size it with viewport units.
  const homeCss = css.slice(css.indexOf("/* Home shell"), css.indexOf("/* PER-24:")).replace(/\/\*[^]*?\*\//g, "");
  assert.ok(homeCss.length > 0, "missing scoped Home shell CSS");
  assert.doesNotMatch(homeCss, /100vw|overflow-x:\s*(hidden|clip)|@keyframes|animation:|transition:/);
  for (const match of homeCss.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
    const selector = match[1].trim();
    assert.ok(
      selector.split(",").every((part) => part.trim().startsWith(".home")),
      selector
    );
  }
});

test("Home reuses shared Footer and Button without source media or fabricated controls", () => {
  const home = read("src/features/home/home.tsx");
  assert.match(home, /import Footer from "@\/components\/layout\/Footer"/);
  assert.match(home, /<Footer\s+variant="full"/);
  assert.match(home, /<Footer variant="full" \/>/);
  assert.match(home, /<Contact \/>/);

  const hero = read("src/features/home/sections/hero.tsx");
  assert.match(hero, /import \{ Button \} from "@\/components\/ui\/Button"/);
  assert.match(hero, /<Button\s+href="#contact"/);
  const content = [home, ...sections.map(([file]) => read(`src/features/home/sections/${file}.tsx`))].join("\n");
  assert.doesNotMatch(content, /<video\b|<audio\b|<blockquote\b|<button\b|<nav\b/);
  assert.doesNotMatch(content, /fachri|fachry|gmail\.com|linkedin\.com\/in\/|data-od-id|role="tab/i);
});

test("Home adds only substantive shell modules and participates in the existing test command", () => {
  const directory = new URL("src/features/home/sections/", root);
  assert.ok(existsSync(directory), "missing section modules");
  assert.deepEqual(readdirSync(directory).sort(), sections.map(([file]) => `${file}.tsx`).sort());
  for (const path of ["home.module.css", "home.css", "data", "hooks"]) {
    assert.equal(existsSync(new URL(`src/features/home/${path}`, root)), false, path);
  }
  assert.ok(JSON.parse(read("package.json")).scripts.test.includes("tests/home-shell.test.mjs"));
});
