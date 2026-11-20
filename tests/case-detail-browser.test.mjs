import assert from "node:assert/strict";
import test from "node:test";
import { eventually, openBrowser } from "./browser-helper.mjs";

test("no detail URL is published while manual CaseDetail design is in progress", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  assert.equal((await fetch(browser.url + "/work.html")).status, 200);
  for (const url of [
    "/cekat-ai-website.html",
    "/case-detail",
    "/case-detail?caseId=cekat-ai-website",
    "/kaporak.html",
    "/random.html",
  ]) {
    assert.equal((await fetch(browser.url + url)).status, 404, url);
  }
  await browser.send("Page.navigate", { url: browser.url + "/work.html" });
  await eventually(() => browser.evaluate('!!document.querySelector(".work-page")'), Boolean, "Work did not mount");
  assert.equal(await browser.evaluate('document.querySelectorAll(".work-project-card a").length'), 0);
  assert.equal(await browser.evaluate('document.querySelectorAll(".work-project-card").length'), 30);
});
