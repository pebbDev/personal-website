import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const source = new URL("../src/features/home/footer-content.ts", import.meta.url);
const previousPath = process.env.PER24_PRIVATE_FOOTER_FILE;
const fixtureDirectory = mkdtempSync(join(tmpdir(), "per24-footer-"));
const fixturePath = join(fixtureDirectory, "content.json");
let getHomeFooterContent;

before(async () => {
  assert.ok(existsSync(source), "Task 1 must provide the typed server footer resolver");
  // This package has no ESM type declaration. Execute the real TS module using
  // Node's built-in stripping, without adding a loader or changing package type.
  const code = stripTypeScriptTypes(readFileSync(source, "utf8"));
  ({ getHomeFooterContent } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`));
});

after(() => {
  if (previousPath === undefined) delete process.env.PER24_PRIVATE_FOOTER_FILE;
  else process.env.PER24_PRIVATE_FOOTER_FILE = previousPath;
  assert.equal(resolve(fixtureDirectory).startsWith(resolve(tmpdir()) + "\\"), process.platform === "win32");
  rmSync(fixtureDirectory, { recursive: true, force: true });
});

function fallback() {
  delete process.env.PER24_PRIVATE_FOOTER_FILE;
  return getHomeFooterContent();
}

function privateContent() {
  return {
    cta: {
      eyebrow: "Test contact",
      headline: "A synthetic heading.",
      description: "Synthetic private fixture for tests only.",
      label: "Test action",
      href: "mailto:qa@example.test",
    },
    brand: { label: "Test brand", href: "#home", avatarAvailable: false },
    tagline: "Synthetic tagline.",
    navigation: [
      { label: "Start", href: "#home" },
      { label: "About", href: "#meet-me" },
      { label: "Lab", href: "#work" },
      { label: "Contact", href: "#contact" },
    ],
    contact: [
      { label: "Test network", href: "https://example.test/profile" },
      { label: "Test email", href: "mailto:qa@example.test" },
      { label: "Unavailable" },
    ],
    bottom: "Synthetic bottom notice.",
  };
}

function loadFixture(value) {
  writeFileSync(fixturePath, JSON.stringify(value));
  process.env.PER24_PRIVATE_FOOTER_FILE = fixturePath;
  return getHomeFooterContent();
}

test("unset fixture returns neutral structured content and inert contact slots", () => {
  const content = fallback();
  assert.deepEqual(Object.keys(content).sort(), ["bottom", "brand", "contact", "cta", "navigation", "tagline"]);
  assert.equal(content.navigation.length, 4);
  assert.deepEqual(content.navigation.map((link) => link.href), ["#home", "#meet-me", "#work", "#contact"]);
  assert.equal(content.contact.length, 3);
  assert.ok(content.contact.every((link) => link.label.length > 0 && link.href === undefined));
  assert.equal(content.cta.href, undefined);
  assert.equal(content.brand.avatarAvailable, false);
  assert.equal(content.brand.avatar, undefined);
  assert.ok([content.cta.eyebrow, content.cta.headline, content.cta.description, content.cta.label,
    content.tagline, content.bottom].every((value) => typeof value === "string" && value.trim().length > 0));
  assert.doesNotMatch(JSON.stringify(content), /https?:|mailto:|@|\/assets\//i);
});

test("valid opt-in file resolves synthetic content with whitelisted hrefs", () => {
  const fixture = privateContent();
  assert.deepEqual(loadFixture(fixture), fixture);
  delete fixture.brand;
  delete fixture.cta.href;
  assert.deepEqual(loadFixture(fixture), fixture, "brand and CTA destination are optional");
});

test("private avatar metadata is optional and availability is explicit", () => {
  const fixture = privateContent();
  fixture.brand.avatar = { src: "/assets/memoji.png", alt: "Synthetic avatar" };
  fixture.brand.avatarAvailable = true;
  assert.deepEqual(loadFixture(fixture).brand, fixture.brand);
  fixture.brand.avatarAvailable = false;
  const brand = loadFixture(fixture).brand;
  assert.equal(brand.avatarAvailable, false);
  assert.equal(brand.avatar, undefined, "unavailable assets cannot produce a broken image");
});

test("missing, unreadable, malformed, or unsafe fixture paths silently fall back", (t) => {
  const expected = fallback();
  const spies = ["log", "warn", "error"].map((method) => t.mock.method(console, method, () => {}));
  writeFileSync(fixturePath, "{ private-invalid-json");
  for (const path of [
    fixturePath, join(fixtureDirectory, "missing.json"), fixtureDirectory,
    "relative.json", "../private.json", "file:///private.json", "https://example.test/private.json",
    "\\\\example.test\\share\\private.json", "C:private.json", `${fixturePath}\0`,
  ]) {
    process.env.PER24_PRIVATE_FOOTER_FILE = path;
    assert.deepEqual(getHomeFooterContent(), expected);
  }
  assert.ok(spies.every((spy) => spy.mock.callCount() === 0), "no fixture values or errors may be logged");
});

test("malformed field shapes reject the whole fixture instead of mixing private and fallback content", () => {
  const expected = fallback();
  const mutations = [
    () => null, () => [], () => ({}),
    (f) => ({ ...f, cta: null }),
    (f) => ({ ...f, tagline: " " }),
    (f) => ({ ...f, bottom: 42 }),
    (f) => ({ ...f, navigation: f.navigation.slice(1) }),
    (f) => ({ ...f, contact: [...f.contact, { label: "Extra" }] }),
    (f) => ({ ...f, contact: [null, ...f.contact.slice(1)] }),
    (f) => ({ ...f, cta: { ...f.cta, description: "bad\0text" } }),
    (f) => ({ ...f, brand: { label: "Test", avatarAvailable: "true" } }),
    (f) => ({ ...f, brand: { ...f.brand, avatarAvailable: true } }),
    (f) => ({ ...f, brand: { ...f.brand, avatar: { src: "/assets/../private.png", alt: "Test" } } }),
  ];
  for (const mutate of mutations) assert.deepEqual(loadFixture(mutate(privateContent())), expected);
});

test("every href field rejects executable, relative, redirect-like, or malformed URLs", () => {
  const expected = fallback();
  const invalidHrefs = [
    "javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,test", "http://example.test",
    "//example.test", "/redirect?url=https://example.test", "https:example.test", "https:///example.test",
    "https://", "https://user:pass@example.test", "https://example.test\\@evil.test",
    " https://example.test", "https://example.test/has space", "mailto:", "mailto:missing-at",
    "mailto:qa@example.test?subject=test%0D%0ABcc:other@example.test", "#//example.test", "#bad hash", 42, null,
  ];
  for (const href of invalidHrefs) {
    for (const field of ["cta", "brand", "navigation", "contact"]) {
      const fixture = privateContent();
      (Array.isArray(fixture[field]) ? fixture[field][0] : fixture[field]).href = href;
      assert.deepEqual(loadFixture(fixture), expected, `${field} must reject unsafe href`);
    }
  }
});

test("hash, HTTPS and simple mailto destinations remain usable", () => {
  for (const href of ["#", "#contact", "https://example.test/a?view=1#part", "mailto:qa@example.test"]) {
    const fixture = privateContent();
    fixture.cta.href = href;
    assert.equal(loadFixture(fixture).cta.href, href);
  }
});

test("unknown JSON properties cannot leak into resolved content and fallback is isolated between calls", () => {
  const fixture = privateContent();
  const content = loadFixture({ ...fixture, privateNote: "synthetic secret", cta: { ...fixture.cta, extra: "secret" } });
  assert.deepEqual(content, fixture);
  const neutral = fallback();
  neutral.contact[0].label = "Mutated";
  assert.notEqual(fallback().contact[0].label, "Mutated");
  assert.equal(JSON.stringify(fallback()).includes("synthetic secret"), false);
});
