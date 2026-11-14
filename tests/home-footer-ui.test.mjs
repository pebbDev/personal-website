import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("Option A uses typed static data without runtime fixture logic", () => {
  for (const file of [
    "../src/features/home/lib/resolve-home-content.ts",
    "../src/features/home/lib/validate-home-content.ts",
    "../src/features/home/footer-content.ts",
  ]) {
    assert.equal(existsSync(new URL(file, import.meta.url)), false);
  }
  const homeData = read("../src/features/home/constants.ts");
  const footerData = read("../src/components/layout/Footer/constants.ts");
  assert.match(homeData, /export const contactCta: ContactCta/);
  assert.match(footerData, /export const dataFooter: FooterType/);

  assert.doesNotMatch(homeData + footerData, /process\.env|node:fs|JSON\.parse|fetch\(/);
});

test("Home directly composes static Contact CTA and shared Footer", () => {
  const home = read("../src/features/home/home.tsx");
  assert.match(home, /import Footer from "@\/components\/layout\/Footer"/);
  assert.match(home, /<Contact \/>/);

  assert.match(home, /<Footer variant="full" \/>/);
  assert.doesNotMatch(home, /getHomeFooterContent|PER24_PRIVATE_FOOTER_FILE|<svg|<path/);
});

test("Contact uses Lucide, Next Link, and inert fallback", () => {
  const contact = read("../src/features/home/sections/contact.tsx");
  assert.match(contact, /import \{ contactCta \} from "\.\.\/constants"/);
  assert.match(contact, /const \{ eyebrow, headline, description, label, href \} = contactCta/);
  assert.doesNotMatch(contact, /Contact\(\{ cta \}|const action =/);

  assert.match(contact, /MessageCircleMore/);
  assert.match(contact, /from "lucide-react"/);
  assert.match(contact, /from "next\/link"/);
  assert.match(contact, /\{href \?/);

  assert.match(contact, /home-contact-action--inactive/);
  assert.doesNotMatch(contact, /<svg|<path|<rect|<circle/);
});

test("CTA and Footer retain source responsive and motion styling", () => {
  const css = read("../src/app/globals.css");
  for (const token of [
    ".home-contact-cta",
    ".footer--full",
    ".footer__grid",
    "background-image: linear-gradient(currentColor, currentColor)",
    ".footer--full li a:focus-visible",
    "@media (prefers-reduced-motion: no-preference)",
  ]) {
    assert.ok(css.includes(token), token);
  }
  assert.match(css, /\.home-contact-cta\s*\{[^}]*padding:\s*80px 32px/s);
  assert.match(css, /@media \(max-width: 640px\)[^]*?\.home-contact-cta\s*\{[^}]*padding:\s*56px 22px/s);
});
