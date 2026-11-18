import assert from "node:assert/strict";
import test from "node:test";
import { eventually, openBrowser } from "./browser-helper.mjs";

test("Work shell uses the approved safe editorial composition", { timeout: 120000 }, async (t) => {
  const browser = await openBrowser(t);
  const { send, evaluate } = browser;

  await send("Page.navigate", { url: `${browser.url}/#work` });
  await eventually(
    () => evaluate(`!!document.querySelector(".page-preview-frame, .work-page")`),
    Boolean,
    "Work preview did not mount"
  );

  const shell = await evaluate(`(() => {
    const root = document.querySelector(".work-page");
    const closing = root?.querySelector(".work-closing");
    const inactive = closing?.querySelector(".work-closing-action--inactive");
    return {
      root: !!root && root.id === "work",
      container: !!root?.querySelector(".work-container"),
      headings: Array.from(root?.querySelectorAll("h1") || [], heading => heading.textContent.trim()),
      lead: !!root?.querySelector(".work-intro .work-intro-copy")?.textContent.trim(),
      closing: closing?.querySelector("h2")?.textContent.trim(),
      footer: root?.querySelectorAll(".footer--compact").length || 0,
      footerNotice: root?.querySelector(".footer--compact")?.textContent.trim(),
      placeholders: document.querySelectorAll(".page-placeholder, .page-preview-frame").length,
      nestedMain: document.querySelectorAll("main main").length,
      homeHref: closing?.querySelector('a[href="#home"]')?.getAttribute("href"),
      inactiveTag: inactive?.tagName,
      inactiveLabel: inactive?.textContent.trim(),
      inactiveStatus: !!closing?.querySelector(".work-closing-status")?.textContent.trim(),
      unsafeLinks: root?.querySelectorAll('a[href^="http"], a[href$=".html"]').length || 0,
    };
  })()`);

  assert.equal(shell.root, true);
  assert.equal(shell.container, true);
  assert.deepEqual(shell.headings, ["My Lab"]);
  assert.equal(shell.lead, true);
  assert.equal(shell.closing, "Have a project in mind?");
  assert.equal(shell.footer, 1);
  assert.equal(shell.footerNotice, "Personal portfolio layout preview — content pending authorization.");
  assert.equal(shell.placeholders, 0);
  assert.equal(shell.nestedMain, 0);
  assert.equal(shell.homeHref, "#home");
  assert.equal(shell.inactiveTag, "SPAN");
  assert.equal(shell.inactiveLabel, "Say Hi");
  assert.equal(shell.inactiveStatus, true);
  assert.equal(shell.unsafeLinks, 0);

  await evaluate(`document.querySelector('.work-closing a[href="#home"]').click()`);
  await eventually(
    () => evaluate(`window.location.hash === "#home" && !!document.querySelector(".home")`),
    Boolean,
    "Home action did not navigate to the Home preview"
  );
  await evaluate(`window.location.hash = "#work"`);
  await eventually(
    () => evaluate(`!!document.querySelector(".work-page")`),
    Boolean,
    "Work preview did not restore after Home navigation"
  );
});
