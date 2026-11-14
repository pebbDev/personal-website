import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("Footer follows Hammercode group data model and three-file architecture", () => {
  const component = read("../src/components/layout/Footer/index.tsx");
  const data = read("../src/components/layout/Footer/constants.ts");
  const types = read("../src/components/layout/Footer/types.ts");

  assert.equal(existsSync(new URL("../src/components/layout/footer.tsx", import.meta.url)), false);

  assert.match(component, /import \{ dataFooter, type FooterProps \} from "\.\/constants"/);
  assert.doesNotMatch(component, /from "\.\/types"/);
  assert.match(data, /export type \{ FooterProps \} from "\.\/types"/);
  assert.match(component, /const Footer = \(props: FooterProps\) =>/);
  assert.match(component, /const \{ brand, resource, contact, copyright \} = dataFooter/);
  assert.match(component, /export default Footer/);
  assert.match(data, /export const dataFooter: FooterType/);
  for (const group of ["brand", "resource", "contact", "copyright"]) {
    assert.ok(data.includes(`${group}: {`), group);
    assert.ok(types.includes(`${group}: {`), group);
  }
  assert.doesNotMatch(component, /function FooterItem|<FooterItem|<svg|<path|<rect/);
});

test("Navigation and contact render source-faithful markup directly", () => {
  const component = read("../src/components/layout/Footer/index.tsx");
  const constants = read("../src/components/layout/Footer/constants.ts");
  assert.match(component, /resource\.data\.map/);
  assert.match(component, /contact\.data\.map/);
  assert.match(component, /<Link href=\{data\.navigate_url\}>\{data\.name\}<\/Link>/);
  assert.match(component, /data\.navigate_url \?/);
  assert.match(component, /<span className="footer__inactive">/);
  assert.match(component, /rel=\{data\.navigate_url\.startsWith\("https:\/\/"\) \? "noopener noreferrer"/);
  assert.match(component, /footer__icon/);
  assert.match(constants, /from "lucide-react"/);
  for (const name of ["Mail", "ContactRound", "Camera"]) assert.ok(constants.includes(name));
  assert.doesNotMatch(component + constants, /fachri|fachry|memoji\.png|gmail\.com/i);
});

test("Footer retains original classes, compact variant and responsive styling", () => {
  const component = read("../src/components/layout/Footer/index.tsx");
  const css = read("../src/app/globals.css");
  for (const selector of ["footer--full", "footer--compact", "footer__card", "footer__grid", "footer__bottom"]) {
    assert.ok(component.includes(selector), selector);
    assert.ok(css.includes(`.${selector}`), selector);
  }
  assert.match(component, /props\.variant === "compact"/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)/);
});
